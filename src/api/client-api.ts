import apiClient from "@/lib/api-client"
import { MockSubmitData, Results } from "@/store/slices/mock-slice";

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

export interface Performance {
    summary : {
        average_score:number;
        best_score:number;
        improvement:number;
        study_streak_score:number;
    };
    mock_progress: {
        name:string;
        percentage:number;
        created_at:string;
    }[];
    topic_accuracy: any;
    study_streak: any;
}

export const clientAPI = {
    dashboard:():Promise<ApiResponse<Performance>>=>apiClient.get(`/dashboard`),
    getMocks:(page:number):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mocks?page=${page}`),
    getMockDetails:(mockId:string):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mock/${mockId}`),
    getMockQuestions:(mockId:string):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mock/${mockId}/questions`),
    submitMockExam:(mockId:string, data: MockSubmitData):Promise<ApiResponse<Mock[]>> => apiClient.post(`/mock/${mockId}/submit`,data),
    getMockResults:():Promise<ApiResponse<Results[]>> => apiClient.get(`/mock/results`),
    getMockResult:(resultId:string):Promise<ApiResponse<Mock[]>> => apiClient.get(`/mock/${resultId}/result`),
    getPerformance:():Promise<ApiResponse<Performance>>=>apiClient.get(`/performance`),
}