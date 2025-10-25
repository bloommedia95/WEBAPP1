import axios from "axios";

// // Backend base URL
// const BASE_URL = "http://localhost:5000/api";




// // ✅ Products API
// export const getProducts = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/products`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     return [];
//   }
// };

// // ✅ Get single product
// export const getProductById = async (id) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/products/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching product:", err);
//     return null;
//   }
// };

// // ✅ Orders API
// export const getOrders = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/orders`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     return [];
//   }
// };

// // ✅ Customers API
// export const getCustomers = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching customers:", err);
//     return [];
//   }
// };

// // ✅ Login API
// export const loginUser = async (email, password) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/login`, { email, password });
//     return res.data;
//   } catch (err) {
//     console.error("Login error:", err.response?.data);
//     throw err.response?.data;
//   }
// };
// api.js
const API_BASE = "http://localhost:5000";
const API = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

export const getProductsByCategory = async (category) => {
  const res = await fetch(`${API_BASE}/api/products/${category}`);
  return await res.json();
};

export default api;
export { API };
  
