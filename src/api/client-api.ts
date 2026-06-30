import apiClient from "@/lib/api-client"

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Mock {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    cfa_level: string;
    total_questions: string;
    formated_duration: string;
}

export const ClientAPI = {
    getMocks:(page:number):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mocks?page=${page}`),
}