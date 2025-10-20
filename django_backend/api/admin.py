from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path
from .models import products, Order, OrderItem

def change_price_action(modeladmin, request, queryset):
    """Custom action to change price of selected products"""
    if request.POST.get('post'):
        new_price = request.POST.get('new_price')
        if new_price:
            try:
                price = float(new_price)
                updated = queryset.update(price=price)
                modeladmin.message_user(request, f'Successfully updated price for {updated} products.', messages.SUCCESS)
            except ValueError:
                modeladmin.message_user(request, 'Invalid price format. Please enter a valid number.', messages.ERROR)
        return HttpResponseRedirect(request.get_full_path())
    
    return render(request, 'admin/change_price.html', {
        'products': queryset,
        'action_name': 'change_price',
        'title': 'Change Price'
    })

def change_stock_action(modeladmin, request, queryset):
    """Custom action to change stock quantity of selected products"""
    if request.POST.get('post'):
        new_stock = request.POST.get('new_stock')
        if new_stock:
            try:
                stock = int(new_stock)
                updated = queryset.update(stock_quantity=stock)
                modeladmin.message_user(request, f'Successfully updated stock for {updated} products.', messages.SUCCESS)
            except ValueError:
                modeladmin.message_user(request, 'Invalid stock format. Please enter a valid number.', messages.ERROR)
        return HttpResponseRedirect(request.get_full_path())
    
    return render(request, 'admin/change_stock.html', {
        'products': queryset,
        'action_name': 'change_stock',
        'title': 'Change Stock Quantity'
    })

@admin.register(products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock_quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    actions = [change_price_action, change_stock_action]
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('change-price/', self.admin_site.admin_view(change_price_action), name='change_price'),
            path('change-stock/', self.admin_site.admin_view(change_stock_action), name='change_stock'),
        ]
        return custom_urls + urls

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price_at_purchase']
