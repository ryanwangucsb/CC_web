from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from .models import products, Order, OrderItem
from .serializers import UserSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer
from django.db import transaction # For atomic operations
from .supabase_auth import SupabaseAuthBackend

class SupabaseDRFAuthentication(BaseAuthentication):
    """
    Custom DRF authentication class for Supabase JWT tokens
    """
    
    def authenticate(self, request):
        # Get the Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        print(f"DEBUG: Auth header: {auth_header}")
        
        if not auth_header.startswith('Bearer '):
            print("DEBUG: No Bearer token found")
            return None
            
        # Extract the token
        token = auth_header.split(' ')[1]
        print(f"DEBUG: Token extracted: {token[:20]}...")
        
        # Use our custom auth backend to validate the token
        supabase_backend = SupabaseAuthBackend()
        user = supabase_backend.authenticate(request, token=token)
        
        print(f"DEBUG: User from auth: {user}")
        
        if user:
            return (user, None)
        return None

# User ViewSet (for user management)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Add permissions as needed, e.g., only authenticated users can view, admins can manage
    # permission_classes = [permissions.IsAuthenticated]

# Product ViewSet (for listing and managing products)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = products.objects.all()
    serializer_class = ProductSerializer
    # Allow anyone to view products, but only authenticated users (admins) to create/update/delete
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser] # Or a custom permission for farmers
        else:
            self.permission_classes = [permissions.AllowAny]
        return [permission() for permission in self.permission_classes]

# Order ViewSet (for managing orders)
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()  # Add this line!
    serializer_class = OrderSerializer
    authentication_classes = [SupabaseDRFAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own orders
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # When creating an order, link it to the current authenticated user
        serializer.save(user=self.request.user)

    # Custom action to create an order with items (more complex logic)
    @action(detail=False, methods=['post'], url_path='create-with-items', permission_classes=[permissions.AllowAny])
    def create_order_with_items(self, request):
        # Allow anonymous orders for inventory updates
        user = request.user if request.user.is_authenticated else None
        items_data = request.data.get('items') # Expecting a list of {product_id, quantity}

        if not items_data:
            return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = 0
        order_items_to_create = []

        try:
            with transaction.atomic(): # Ensure atomicity: all or nothing
                order = Order.objects.create(user=user, total_amount=0) # Total amount will be updated

                for item_data in items_data:
                    product_id = item_data.get('product_id')
                    quantity = item_data.get('quantity')

                    try:
                        product = products.objects.get(id=product_id)
                    except products.DoesNotExist:
                        raise ValueError(f"Product with ID {product_id} not found.")

                    if product.stock_quantity < quantity:
                        raise ValueError(f"Not enough stock for {product.name}. Available: {product.stock_quantity}")

                    # Deduct from stock
                    product.stock_quantity -= quantity
                    product.save()

                    item_price = product.price * quantity
                    total_amount += item_price
                    order_items_to_create.append(OrderItem(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=product.price # Store price at time of purchase
                    ))

                OrderItem.objects.bulk_create(order_items_to_create) # Create all order items efficiently
                order.total_amount = total_amount
                order.save()

                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred during order creation.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)