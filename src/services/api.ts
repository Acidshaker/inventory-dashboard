import axios from "axios";
import { clearToken } from "../store/sessionsSlice";
import { toast } from "react-toastify";
import { store } from "../store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use((config) => {
  const token = store.getState().session.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message !== "Usuario y/o contraseña incorrectos"
    ) {
      toast.error("Tu sesión ha expirado.");
      store.dispatch(clearToken());
      window.location.href = "/login";
    } else {
      toast.error(
        error.response?.data?.message || "No se pudo completar la solicitud."
      );
    }
    return Promise.reject(error);
  }
);

export default api;
