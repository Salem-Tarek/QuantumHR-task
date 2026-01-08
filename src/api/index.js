// src/services/api.js
import axios from "axios";
import { useAuthStore } from "@/modules/auth/store";
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://mejoreg.online/resturant_app/public/api/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔐 Add token to each request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Handle all API errors globally
// Remove Asyc/Await
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();

    if (error.status == 401) {
      if (authStore.isLogged) {
        authStore.handleLogout()
      } else {
        router.push('/login')
      }
    }

    return Promise.reject(error);
  }
);

export default api;
