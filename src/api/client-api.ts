import apiClient from "@/lib/api-client"
import { MockSubmitData } from "@/store/slices/mock-slice";

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

export const clientAPI = {
    getMocks:(page:number):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mocks?page=${page}`),
    getMockDetails:(mockId:string):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mock/${mockId}`),
    getMockQuestions:(mockId:string):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mock/${mockId}/questions`),
    submitMockExam:(mockId:string, data: MockSubmitData):Promise<ApiResponse<Mock[]>> => apiClient.post(`/mock/${mockId}/submit`,data),
}