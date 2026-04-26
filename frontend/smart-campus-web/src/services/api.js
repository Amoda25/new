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
        const url = error.config?.url || '';
        // Only redirect to login if it's NOT a booking or profile API call
        // (those can fail for business reasons and shouldn't log the user out)
        const isBookingEndpoint = url.includes('/api/user/bookings');
        const isProfileEndpoint = url.includes('/api/user/profile');
        const isLoginEndpoint = url.includes('/api/auth/login');
        
        if (!isLoginEndpoint && !isBookingEndpoint && !isProfileEndpoint) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        // For booking/profile failures, just let the error bubble up to show to user
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
