import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { API_ENDPOINTS } from './config.js';
import { supabase } from './supabaseClient.js';
import { submitOrderToSheets } from './googleSheetsService.js';

// Context and Reducer
const AppContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
};

// Components
const Navigation = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' }); // Clear cart when logging out
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800">C&C Farm</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => { window.location.hash = 'home'; }}
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => { window.location.hash = 'products'; }}
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => { window.location.hash = 'cart'; }}
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors relative"
            >
              Cart
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            {state.user ? (
              <>
                <a href="#orders" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">Orders</a>
                <button 
                  onClick={handleLogout}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="#login" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                Login
              </a>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => { window.location.hash = 'home'; setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600"
            >
              Home
            </button>
            <button 
              onClick={() => { window.location.hash = 'products'; setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600"
            >
              Products
            </button>
            <button 
              onClick={() => { window.location.hash = 'cart'; setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 relative"
            >
              Cart
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            {state.user ? (
              <>
                <a href="#orders" className="block px-3 py-2 text-gray-700 hover:text-green-600">Orders</a>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="#login" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            C&C Farm
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Locally grown, sustainably harvested
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </a>
            <a href="#about" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const { state } = useContext(AppContext);
  const isInCart = state.cart.some(item => item.id === product.id);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
          ${product.price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            product.stock_quantity > 20 ? 'bg-green-100 text-green-800' : 
            product.stock_quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {product.stock_quantity} in stock
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0 || isInCart}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              product.stock_quantity === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : isInCart 
                  ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ onAddToCart }) => {
  const { state, dispatch } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from products
  const categories = ['All', ...new Set(state.products.map(p => p.category))];

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  return (
    <div id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our fresh, locally grown produce delivered straight from our farm to your table.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Cart = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [loading, setLoading] = useState(false);

  // Load cart from Supabase when component mounts (only if user is logged in)
  useEffect(() => {
    if (state.user && state.cart.length === 0) {
      const loadCart = async () => {
        setLoading(true);
        try {
          // First get cart items from Supabase
          const { data: cartData, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', state.user.id);

          if (cartError) {
            console.error('Error loading cart:', cartError);
            return;
          }

          if (cartData && cartData.length > 0) {
            // Get product details from Django backend for each cart item
            const cartItems = await Promise.all(
              cartData.map(async (cartItem) => {
                try {
                  const response = await fetch(`${API_ENDPOINTS.PRODUCTS}${cartItem.product_id}/`);
                  if (response.ok) {
                    const product = await response.json();
                    return {
                      id: product.id,
                      title: product.name,
                      description: product.description,
                      price: parseFloat(product.price),
                      image: product.image,
                      stock_quantity: product.stock_quantity,
                      quantity: cartItem.quantity
                    };
                  }
                } catch (err) {
                  console.error('Error fetching product:', err);
                  return null;
                }
              })
            );

            // Filter out any failed product fetches and remove duplicates
            const validItems = cartItems.filter(item => item !== null);
            const uniqueItems = validItems.filter((item, index, self) => 
              index === self.findIndex(t => t.id === item.id)
            );
            
            if (uniqueItems.length > 0) {
              dispatch({ type: 'SET_CART', payload: uniqueItems });
            }
          }
        } catch (err) {
          console.error('Error loading cart:', err);
        } finally {
          setLoading(false);
        }
      };

      loadCart();
    }
  }, [state.user, dispatch, state.cart.length]);

  // Redirect to login if user is not authenticated
  if (!state.user) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h3>
            <p className="text-gray-600 mb-8">Please log in to view your cart and make purchases.</p>
            <a href="#login" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Login Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveFromCart = async (id) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', state.user.id)
        .eq('product_id', id);
      
      if (error) {
        console.error('Error removing from cart:', error);
        return;
      }
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity >= 1) {
      // Find the product to check stock availability
      const cartItem = state.cart.find(item => item.id === id);
      if (cartItem && quantity > cartItem.stock_quantity) {
        // Automatically limit to stock quantity instead of showing alert
        quantity = cartItem.stock_quantity;
      }
      
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', state.user.id)
          .eq('product_id', id);
        
        if (error) {
          console.error('Error updating quantity:', error);
          return;
        }
        
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        // Update the input value to match the actual quantity
        setQuantityInputs(prev => ({ ...prev, [id]: quantity.toString() }));
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    }
  };

  const handleQuantityInputChange = (id, value) => {
    // Allow empty string for clearing the input
    setQuantityInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleQuantityInputBlur = (id, value) => {
    const cartItem = state.cart.find(item => item.id === id);
    if (!cartItem) return;

    let newQuantity;
    if (value === '' || value === '0') {
      // If empty or 0, set to 1
      newQuantity = 1;
    } else {
      newQuantity = parseInt(value) || 1;
      // Limit to stock quantity
      newQuantity = Math.min(Math.max(newQuantity, 1), cartItem.stock_quantity);
    }
    
    handleUpdateQuantity(id, newQuantity);
  };

  const getQuantityInputValue = (id) => {
    return quantityInputs[id] !== undefined ? quantityInputs[id] : state.cart.find(item => item.id === id)?.quantity?.toString() || '1';
  };

  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleCheckout = () => {
    setIsCheckout(true);
};

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!checkoutData.name || !checkoutData.email || !checkoutData.phone || !checkoutData.address) {
      alert('Please fill in all required fields (name, email, phone, and address)');
      return;
    }

    try {
      // Calculate total
      const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Prepare order data for Google Sheets
      const orderData = {
        name: checkoutData.name,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        items: state.cart,
        total: total
      };

      // Submit order to Google Sheets
      const result = await submitOrderToSheets(orderData);
      
      // Always proceed with order (Google Sheets is optional)
      // Update inventory in Django backend (always, regardless of login status)
      try {
        // Debug: Updating inventory in Django backend...
        const response = await fetch(API_ENDPOINTS.ORDERS_CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            items: state.cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Debug: Inventory updated successfully
      } catch (inventoryError) {
        console.error('Inventory update failed:', inventoryError);
        alert('Order placed but inventory update failed. Please contact support.');
      }
      
      alert('Order placed successfully! Thank you for your purchase.');
      
      // Clear cart from Supabase (if user is logged in)
      if (state.user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', state.user.id);
        
        if (error) {
          console.error('Error clearing cart:', error);
        }
      }
      
      // Clear local cart state
      dispatch({ type: 'CLEAR_CART' });
      setIsCheckout(false);
      
      // Reset checkout form
      setCheckoutData({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      console.error('Order failed:', err);
      alert('Order failed: Network error');
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading your cart...</h3>
            <p className="text-gray-600">Please wait while we fetch your cart items.</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <a href="#products" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckout) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Customer Information</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <textarea 
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      rows="3"
                      required
                    />
                  </div>
                </form>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  {state.cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-green-700 transition-colors"
                  >
                    Submit Order Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.cart.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img className="h-16 w-16 rounded-lg object-cover" src={item.image} alt={item.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.stock_quantity} in stock</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 rounded-l-lg px-3 py-1 text-gray-700"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.stock_quantity}
                          value={getQuantityInputValue(item.id)}
                          onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                          onBlur={(e) => handleQuantityInputBlur(item.id, e.target.value)}
                          className="px-2 py-1 border-t border-b text-center w-16 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          className={`rounded-r-lg px-3 py-1 ${
                            item.quantity >= item.stock_quantity 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
              Total: <span className="text-2xl">${total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-4">
              <a href="#products" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Continue Shopping
              </a>
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (loginError) {
          setError(loginError.message);
        } else {
          dispatch({ type: 'SET_USER', payload: data.user });
          setSuccess('Successfully logged in!');
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
        if (signUpError) {
          setError(signUpError.message);
        } else {
          dispatch({ type: 'SET_USER', payload: data.user });
          setSuccess('Account created! Please check your email to confirm.');
        }
      }
    } catch (err) {
      setError('Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to access your account' : 'Join our community of fresh food lovers'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-700 font-medium"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  
  // Ensure orders is always an array
  const orders = Array.isArray(state.orders) ? state.orders : [];

  // Load orders when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      if (!state.user) return;
      
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const response = await fetch(API_ENDPOINTS.ORDERS, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          
          if (response.ok) {
            const ordersData = await response.json();
            dispatch({ type: 'SET_ORDERS', payload: ordersData });
          } else {
            console.error('Failed to fetch orders:', response.status);
          }
        }
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [state.user, dispatch]);

  if (!state.user) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 00-2-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h3>
            <p className="text-gray-600 mb-8">Please log in to view your order history.</p>
            <a href="#login" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Login Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Orders...</h3>
            <p className="text-gray-600">Please wait while we fetch your order history.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Order History</h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">When you place orders, they will appear here.</p>
            <a href="#products" className="inline-block mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-800 mb-3">Items:</h4>
                  <div className="space-y-2 mb-4">
                    {order.order_items && Array.isArray(order.order_items) ? order.order_items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span>${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</span>
                      </div>
                    )) : (
                      <p className="text-gray-500">Order items not available</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-3 flex justify-end">
                    <div className="text-right">
                      <p className="text-lg font-semibold">Total: ${order.total_amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="font-bold text-xl">C&C Farm</span>
            </div>
            <p className="text-gray-300 mb-4">
              Locally grown, sustainably harvested
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
              <li><a href="#cart" className="text-gray-300 hover:text-white transition-colors">Cart</a></li>
              <li><a href="#orders" className="text-gray-300 hover:text-white transition-colors">Orders</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@ccfarm.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 C&C Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(cartReducer, {
    products: [],
    cart: [],
    user: null,
    orders: []
  });

  // Ensure orders is always an array
  const safeOrders = Array.isArray(state.orders) ? state.orders : [];

  const handleAddToCart = async (product) => {
    if (product.stock_quantity === 0) {
      return; // Don't allow adding out of stock items
    }
    
    if (!state.user) {
      // Redirect to login if not authenticated
      setCurrentPage('login');
      return;
    }
    
    try {
      // Check if item already exists in cart
      const existingItem = state.cart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity in Supabase
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', state.user.id)
          .eq('product_id', product.id);
        
        if (error) {
          console.error('Error updating cart:', error);
          return;
        }
        
        // Update local state
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: product.id, quantity: existingItem.quantity + 1 } });
      } else {
        // Add new item to Supabase
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: state.user.id,
            product_id: product.id,
            quantity: 1
          });
        
        if (error) {
          console.error('Error adding to cart:', error);
          return;
        }
        
        // Add to local state
        dispatch({ type: 'ADD_TO_CART', payload: product });
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Check for existing Supabase session on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          dispatch({ type: 'SET_USER', payload: session.user });
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          dispatch({ type: 'SET_USER', payload: session.user });
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'CLEAR_CART' });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Replace useEffect for products and orders with real API calls
  useEffect(() => {
    // Debug: Fetching products from API
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => {
        // Debug: Products response status
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Debug: Products data received
        dispatch({ type: 'SET_PRODUCTS', payload: data });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      });
    // Temporarily disable orders fetch to avoid 404 errors
    // fetch(API_ENDPOINTS.ORDERS, {
    //   credentials: 'include',
    //   headers: { 'Accept': 'application/json' }
    // })
    //   .then(res => res.json())
    //   .then(data => dispatch({ type: 'SET_ORDERS', payload: data }))
    //   .catch(() => dispatch({ type: 'SET_ORDERS', payload: [] }));
  }, []);

  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || 'home';
      setCurrentPage(hash);
    };

    // Set initial page
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    // Debug: Current page
    switch (currentPage) {
      case 'products':
        return <ProductGrid onAddToCart={handleAddToCart} />;
      case 'cart':
        return <Cart />;
      case 'login':
        return <Login />;
      case 'orders':
        return <Orders />;
      default:
        return (
          <>
            <Hero />
            <ProductGrid onAddToCart={handleAddToCart} />
          </>
        );
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
};

export default App;