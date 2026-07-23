import axios from "axios";

// Automatically points to local server in development and main api endpoint in production
const api = axios.create({
  baseURL: (import.meta as any).env?.PROD ? "/api" : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT token in Request Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gcv_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
