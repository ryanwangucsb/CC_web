// Ensure we always use HTTPS for the API URL
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'https://wedofarm.com';
export const API_BASE_URL = rawApiUrl.startsWith('http://') 
  ? rawApiUrl.replace('http://', 'https://') 
  : rawApiUrl;

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products/`,
  ORDERS: `${API_BASE_URL}/api/orders/`,
  ORDERS_CREATE: `${API_BASE_URL}/api/orders/create-with-items/`,
  LOGIN: `${API_BASE_URL}/api/login/`,
  REGISTER: `${API_BASE_URL}/api/register/`,
  USERS: `${API_BASE_URL}/api/users/`,
};
