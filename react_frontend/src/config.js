// Force the API URL to use wedofarm.com domain
export const API_BASE_URL = 'https://wedofarm.com';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products/`,
  ORDERS: `${API_BASE_URL}/api/orders/`,
  ORDERS_CREATE: `${API_BASE_URL}/api/orders/create-with-items/`,
  LOGIN: `${API_BASE_URL}/api/login/`,
  REGISTER: `${API_BASE_URL}/api/register/`,
  USERS: `${API_BASE_URL}/api/users/`,
};
