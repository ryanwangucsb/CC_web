from django.contrib import admin
from django.urls import path, include
from django.conf import settings # For media files
from django.conf.urls.static import static # For media files

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Include URLs from your API app
]

# Serve media files (product images) only in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

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