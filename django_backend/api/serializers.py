from rest_framework import serializers
from .models import products, Order, OrderItem
from django.contrib.auth.models import User

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # Only expose necessary fields

# Serializer for the Product model
class ProductSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')  # Map 'name' to 'title' for React
    category = serializers.CharField(default='General')  # Add default category
    popularity = serializers.IntegerField(default=0)  # Add default popularity
    
    class Meta:
        model = products
        fields = ['id', 'title', 'description', 'price', 'image', 'stock_quantity', 'category', 'popularity', 'created_at']

# Serializer for the OrderItem model (used within the Order serializer)
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name') # Include product name for clarity

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_purchase']
        read_only_fields = ['price_at_purchase'] # Price should be set by backend based on product

# Serializer for the Order model
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    user_username = serializers.ReadOnlyField(source='user.username') # Include username for clarity

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_username', 'total_amount', 'created_at', 'status', 'order_items']
        read_only_fields = ['total_amount', 'status', 'created_at'] # These are set by the backend