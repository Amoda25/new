import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401: Unauthorized (Token expired or missing)
      if (error.response.status === 401) {
        // Do not redirect if the request was to the login endpoint itself
        if (error.config && !error.config.url.includes('/api/auth/login')) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }


      
      // 403: Forbidden (Role mismatch)
      if (error.response.status === 403) {
        window.location.href = "/unauthorized";
      }
    }
    return Promise.reject(error);
  }
);

export default api;