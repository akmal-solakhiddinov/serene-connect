import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

// Queue for failed requests during token refresh
interface QueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

// Base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: sends cookies with requests
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err: unknown) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        processQueue();
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError);
        isRefreshing = false;

        window.dispatchEvent(new CustomEvent("auth:logout"));
        if (!window.location.pathname.includes("/auth")) {
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string; error?: string };

      switch (status) {
        case 403:
          console.error("Access forbidden:", data.message);
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error:", data.message);
          break;
        default:
          console.error("Error:", data.message || data.error);
      }
    } else if (error.request) {
      console.error("Network error: No response received");
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// API methods with TypeScript types
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get(url, config);
  },

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return axiosInstance.post(url, data, config);
  },

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return axiosInstance.put(url, data, config);
  },

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return axiosInstance.patch(url, data, config);
  },

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return axiosInstance.delete(url, config);
  },

  uploadFile: <T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<T> => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });
  },
};

export default axiosInstance;
