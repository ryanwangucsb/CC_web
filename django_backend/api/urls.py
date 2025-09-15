from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, UserViewSet

# Create a router instance
router = DefaultRouter()

# Register your ViewSets with the router
router.register(r'products', ProductViewSet) # Base URL: /api/products/
router.register(r'orders', OrderViewSet)     # Base URL: /api/orders/
router.register(r'users', UserViewSet)       # Base URL: /api/users/

urlpatterns = [
    path('', include(router.urls)),
]