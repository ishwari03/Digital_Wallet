import axios from "axios";

// Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // 🔗 Backend URL
});

// Automatically attach token to every request (if available)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 Signup Function
export const signup = async (name, email, password) => {
  try {
    const response = await API.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// 🔐 Login Function
export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export default API;
