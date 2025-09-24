// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${token}` // Descomentar si usas autenticación
  },
});

// Interceptor para manejar errores de forma global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores de red, de autenticación, etc.
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
