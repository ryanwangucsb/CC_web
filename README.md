# 🌱 C&C Farm - E-commerce Website

A modern, full-stack e-commerce website for C&C Farm, featuring locally grown produce with React frontend, Django backend, and Google Sheets integration.

## 🚀 Live Demo

- **Website**: [https://www.wedofarm.com](https://www.wedofarm.com)
- **API**: [https://api.wedofarm.com](https://api.wedofarm.com)
- **Admin Panel**: [https://api.wedofarm.com/admin](https://api.wedofarm.com/admin)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)

## ✨ Features

### 🛒 E-commerce Functionality
- **Product Catalog**: Browse locally grown produce with images and descriptions
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Order Processing**: Complete checkout flow with customer information
- **Inventory Management**: Real-time stock updates when orders are placed
- **Search & Filter**: Find products by name, description, or category

### 🔐 Authentication & User Management
- **Supabase Authentication**: Secure user registration and login
- **User Profiles**: Personalized shopping experience
- **Order History**: Track past purchases and order status
- **Cart Persistence**: Shopping cart saved across sessions

### 📊 Admin Features
- **Django Admin Panel**: Manage products, orders, and users
- **Product Management**: Add, edit, delete products with images
- **Order Tracking**: View and manage customer orders
- **Inventory Control**: Monitor stock levels and update quantities

### 🔗 Integrations
- **Google Sheets**: Automatic order data export to spreadsheets
- **Supabase**: User authentication and cart management
- **Image Upload**: Product image management with Django

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase Client** - Authentication and real-time features

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **Gunicorn** - WSGI server (production)

### Infrastructure
- **Vercel** - Frontend hosting
- **AWS EC2** - Backend hosting
- **Nginx** - Reverse proxy and static file serving
- **Let's Encrypt** - SSL certificates

### External Services
- **Supabase** - Authentication and database
- **Google Sheets API** - Order data export

## 📁 Project Structure

```
ccwebsite/
├── react_frontend/          # React frontend application
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── config.js       # API configuration
│   │   ├── supabaseClient.js
│   │   └── googleSheetsService.js
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── django_backend/          # Django backend application
│   ├── api/                # Main API app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serialization
│   │   ├── urls.py         # URL routing
│   │   └── admin.py        # Admin interface
│   ├── django_backend/     # Django project settings
│   │   ├── settings.py     # Configuration
│   │   └── urls.py         # Main URL routing
│   ├── media/              # Uploaded files
│   └── manage.py
│
├── .gitignore              # Git ignore rules
└── README.md              # This file
```

## 👥 Team

- **Ryan Wang** - Full Stack Developer
  - GitHub: [@ryanwangucsb](https://github.com/ryanwangucsb)
  - Email: ryanwang@ucsb.edu

**Built with ❤️ for C&C Farm** 🌱
