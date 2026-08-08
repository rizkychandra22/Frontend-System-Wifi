import axios, { type AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { getToken } from "./auth-utils";

function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    
    // Jika kita sedang membuka web dari localhost (development),
    // selalu paksa panggil backend localhost agar tidak terjadi IP Lock di Cloud
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080/api";
    }

    // Jika web dibuka dari internet (misal Vercel), gunakan URL Endpoint Deploy
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    return `${window.location.origin}`;
  }
  return "http://localhost:8080/api";
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk menyisipkan Token JWT ke setiap Request API
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosRetry(apiClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED"
    );
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const data = error.response.data as { message?: string; msg?: string; error?: string };
      const serverMessage = data.message || data.msg || data.error;
      if (serverMessage) {
        error.message = serverMessage;
      }
    }

    const classified = error as AxiosError & { _classified?: string };
    const status = error.response?.status;

    if (!error.response && error.message === "Network Error") {
      classified._classified = "network";
    } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      classified._classified = "timeout";
    } else if (status && status >= 500) {
      classified._classified = "server_error";
    }

    return Promise.reject(classified);
  },
);

export default apiClient;
