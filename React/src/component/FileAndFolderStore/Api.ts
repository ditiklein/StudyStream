import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
// הוספת Interceptor לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // אפשר לשנות ל-sessionStorage אם צריך
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
