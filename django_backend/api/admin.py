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
                # Update each product individually to ensure proper saving
                updated_count = 0
                for product in queryset:
                    product.price = price
                    product.save()
                    updated_count += 1
                modeladmin.message_user(request, f'Successfully updated price for {updated_count} products.', messages.SUCCESS)
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
                # Update each product individually to ensure proper saving
                updated_count = 0
                for product in queryset:
                    product.stock_quantity = stock
                    product.save()
                    updated_count += 1
                modeladmin.message_user(request, f'Successfully updated stock for {updated_count} products.', messages.SUCCESS)
            except ValueError:
                modeladmin.message_user(request, 'Invalid stock format. Please enter a valid number.', messages.ERROR)
        return HttpResponseRedirect(request.get_full_path())
    
    return render(request, 'admin/change_stock.html', {
        'products': queryset,
        'action_name': 'change_stock',
        'title': 'Change Stock Quantity'
    })

# Set action descriptions
change_price_action.short_description = "Change price of selected products"
change_stock_action.short_description = "Change stock quantity of selected products"

@admin.register(products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock_quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    actions = [change_price_action, change_stock_action]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price_at_purchase']
