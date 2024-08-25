import axios from 'axios'

const API_URL = '/api'  // This will be handled by our Next.js rewrites

export const login = (username, password) =>
  axios.post(`${API_URL}/login`, { username, password })

export const register = (username, password) =>
  axios.post(`${API_URL}/register`, { username, password })

export const getProducts = () =>
  axios.get(`${API_URL}/products`)

export const getProduct = (id) =>
  axios.get(`/api/products/${id}`);

export const addToCart = (userId, productId, quantity) =>
  axios.post(`${API_URL}/cart/add`, { userId, productId, quantity });

export const getCart = (userId) =>
  axios.get(`${API_URL}/cart/${userId}`);

export const updateCartItem = (userId, productId, quantity) =>
  axios.put(`${API_URL}/cart/update`, { userId, productId, quantity });

export const removeCartItem = (userId, productId) =>
  axios.delete(`${API_URL}/cart/remove`, { data: { userId, productId } });

export const clearCart = (userId) =>
  axios.delete(`/api/cart/${userId}`);

export const placeOrder = (userId, cart) =>
  axios.post(`${API_URL}/orders`, { userId, cart })