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
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

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

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ and pip
- **Git**

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/ryanwangucsb/CC_web.git
cd CC_web/react_frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd ../django_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=https://api.wedofarm.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_SHEETS_WEB_APP_URL=your_google_apps_script_url
VITE_GOOGLE_SHEETS_SHEET_ID=your_google_sheet_id
```

#### Backend (.env)
```bash
DEBUG=False
SECRET_KEY=your_django_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Required Services Setup

1. **Supabase**:
   - Create a new project
   - Enable authentication
   - Create `cart_items` table
   - Get URL and anon key

2. **Google Sheets**:
   - Create a Google Sheet for orders
   - Set up Google Apps Script webhook
   - Configure API permissions

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect Repository**:
   - Link GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Environment Variables**:
   - Add all `VITE_*` variables in Vercel dashboard
   - Redeploy after adding variables

3. **Custom Domain**:
   - Add domain in Vercel settings
   - Update DNS records

### Backend (AWS EC2)

1. **Server Setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install dependencies
   sudo apt install nginx python3-pip python3-venv
   
   # Clone repository
   git clone https://github.com/ryanwangucsb/CC_web.git
   cd CC_web/django_backend
   ```

2. **Application Setup**:
   ```bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Run migrations
   python manage.py migrate
   
   # Collect static files
   python manage.py collectstatic --noinput
   ```

3. **Production Server**:
   ```bash
   # Install Gunicorn
   pip install gunicorn
   
   # Start Gunicorn
   gunicorn django_backend.wsgi:application --bind 127.0.0.1:8000 --workers 3
   ```

4. **Nginx Configuration**:
   ```nginx
   server {
       listen 443 ssl;
       server_name api.wedofarm.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       location /static/ {
           alias /path/to/staticfiles/;
       }
       
       location /media/ {
           alias /path/to/media/;
       }
   }
   ```

5. **SSL Certificate**:
   ```bash
   sudo certbot --nginx -d api.wedofarm.com
   ```

## 📚 API Documentation

### Endpoints

#### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get specific product
- `POST /api/products/` - Create product (admin only)
- `PUT /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)

#### Orders
- `GET /api/orders/` - List user orders (authenticated)
- `POST /api/orders/create-with-items/` - Create order with items
- `GET /api/orders/{id}/` - Get specific order (authenticated)

#### Authentication
- Uses Supabase JWT tokens
- Include `Authorization: Bearer <token>` header

### Example API Usage

```javascript
// Get products
const response = await fetch('https://api.wedofarm.com/api/products/');
const products = await response.json();

// Create order
const orderData = {
  items: [
    { product_id: 1, quantity: 2 },
    { product_id: 2, quantity: 1 }
  ]
};

const orderResponse = await fetch('https://api.wedofarm.com/api/orders/create-with-items/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData)
});
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Website loads at `https://www.wedofarm.com`
- [ ] Products display correctly
- [ ] Search functionality works
- [ ] User registration/login works
- [ ] Add to cart functionality
- [ ] Cart calculations are correct
- [ ] Order placement works
- [ ] Google Sheet integration
- [ ] Inventory updates correctly
- [ ] Mobile responsiveness
- [ ] SSL certificates valid

### API Testing

```bash
# Test products endpoint
curl -i https://api.wedofarm.com/api/products/

# Test orders endpoint (should return 401)
curl -i https://api.wedofarm.com/api/orders/

# Test order creation
curl -i -X POST https://api.wedofarm.com/api/orders/create-with-items/ \
  -H "Content-Type: application/json" \
  -d '{"items": [{"product_id": 1, "quantity": 1}]}'
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -am 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a Pull Request**

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Test on multiple devices/browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ryan Wang** - Full Stack Developer
  - GitHub: [@ryanwangucsb](https://github.com/ryanwangucsb)
  - Email: ryan@wedofarm.com

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed description
4. **Contact**: ryan@wedofarm.com

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Full e-commerce functionality
- ✅ User authentication
- ✅ Admin panel
- ✅ Google Sheets integration
- ✅ Mobile responsive design
- ✅ Production deployment

---

**Built with ❤️ for C&C Farm** 🌱
