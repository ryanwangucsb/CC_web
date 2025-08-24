# GreenHarvest Frontend

A modern React frontend for the GreenHarvest farm-to-table e-commerce platform.

## Features

- **Product Catalog**: Browse and search through fresh farm products
- **Shopping Cart**: Add, remove, and manage items in your cart
- **User Authentication**: Login and registration system
- **Order Management**: View order history and track orders
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic cart and inventory management

## Tech Stack

- React 18
- Vite (Build tool)
- Tailwind CSS (Styling)
- Context API (State management)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
└── index.css        # Global styles and Tailwind imports
```

## API Integration

The frontend is designed to work with a backend API that provides:

- `/api/products/` - Product catalog
- `/api/orders/` - Order management
- `/api/login/` - User authentication
- `/api/register/` - User registration

## Development

- **ESLint**: Code linting and formatting
- **Hot Reload**: Automatic browser refresh during development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## License

This project is private and proprietary.
