import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  import.meta.env.VITE_APP_BACKEND_LOCAL_BASE_URL ||
  "http://localhost:5050/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  withCredentials: true,
 
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data; // simplify data access
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
