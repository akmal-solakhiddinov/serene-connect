import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

type ToastVariant = "default" | "destructive";

const emitToast = (
  title: string,
  description?: string,
  variant: ToastVariant = "destructive",
) => {
  window.dispatchEvent(
    new CustomEvent("app:toast", { detail: { title, description, variant } }),
  );
};

interface QueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

export const axiosInstance: AxiosInstance = axios.create({
  //baseURL: "https://ws.salohiddinov.tech/api",
  baseURL: "http://localhost:4000/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown = null): void => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | null;

    // 401 → attempt refresh then replay
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        processQueue();
        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError);
        window.dispatchEvent(new CustomEvent("auth:logout"));
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = (error as any)?.response?.status as number | undefined;
    const message =
      ((error as any)?.response?.data?.message as string | undefined) ||
      ((error as any)?.response?.data?.error as string | undefined) ||
      error.message ||
      "Request failed";

    if (status && status !== 401) {
      emitToast("Request failed", message, "destructive");
    } else if (!status) {
      emitToast(
        "Network error",
        "No response received from server",
        "destructive",
      );
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosInstance.post(url, data, config),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosInstance.patch(url, data, config),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config),
};
