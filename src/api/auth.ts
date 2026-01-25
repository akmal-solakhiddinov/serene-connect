import { api } from "@/api/axios";
import type { UserDTO } from "@/types/dtos";

export const authApi = {
  register: (payload: {
    email: string;
    password: string;
    fullName?: string;
    username?: string;
  }) => api.post<unknown>("/auth/register", payload),

  login: (payload: { email: string; password: string }) =>
    api.post<unknown>("/auth/login", payload),

  logout: () => api.post<unknown>("/auth/logout"),

  me: () => api.get<UserDTO>("/user/me"),
};
