import apiClient from "@/lib/api-client";

interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
export const AuthAPI = {
    login:(data: LoginRequest) => apiClient.post('/auth/client/login',data),
    register:(data: RegisterRequest) =>apiClient.post('/auth/client/register',data),
    logout: () => apiClient.post('/auth/client/logout'),
}