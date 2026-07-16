import { clientAPI } from '@/api/client-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Mock {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  cfa_level: string;
  total_questions: string;
  duration_minutes: number;
  formatted_duration: string;
  mock_modules_count: number;
  progress:number | null;
  submission_status:string | null;
  result_id:string | null;
  is_active: boolean;
  is_retake:boolean;
  is_unlocked:boolean;
  unlock_name:string;
}

interface MockQuestion {
  id: string;
  question_id: string;
  topic: string;
  prompt: string;
  options: { key: "A" | "B" | "C"; text: string }[];
  answer?: "A" | "B" | "C";
}

export interface MockSubmitData {
  examId: string;
  questionMetrics:{
    questionId: string;
    givenAnswer: "A" | "B" | "C";
    isAttempted: boolean;
    isReopened: boolean;
    timesViewed: number;
    totalTimeSpent: number;
    timeSpentAfterAttempt: number;
  }[];
  totalQuestions: number;
  attempted: number;
  notAttempted: number;
  totalTimeSpent: number;
}

interface GetMocksResponse {
  success: boolean;
  message: string;
  data: {
    mocks: Mock[];
  };
}

export interface Results {
  id:string;
  resultId:string;
  name:string;
  cfaLevel:string;
  score:number;
  status:string;
  result: 'pass' | 'fail',
  submittedAt:string,
}

interface MockState {
  mocks: Mock[];
  mock: Mock | null;
  mockQuestions: MockQuestion[];
  loading: boolean;
  error: string | null;
  mockResult: {
    summary: {
      mockName: string;
      cfaLevel: string;
      totalTime: number;
      correctCount: number;
      wrongCount: number;
      attempted: number;
      notAttempted: number;
      totalQuestions: number;
      totalTimeSpent: number;
      overallTimeLeft: number;
      percentage: number;
      passed: 'pass' | 'fail' | 'in_progress';
      scaledScore: number,
      mps: number,
      maxScore: number,
    };
    subjectStats: {
      subject: string;
      score: number;
      total: number;
      weight:number;
    }[];
  } | null;
  results: Results [];
}

const initialState: MockState = {
  mocks: [],
  mock: null,
  mockQuestions: [],
  loading: false,
  error: null,
  mockResult: {
    summary: {
      mockName: "",
      cfaLevel: "",
      totalTime: 0,
      correctCount: 0,
      wrongCount: 0,
      attempted: 0,
      notAttempted: 0,
      totalQuestions: 0,
      totalTimeSpent: 0,
      overallTimeLeft: 0,
      percentage: 0,
      passed: false,
    },
    subjectStats: []
  },
  results: [],
};

export const getMocks = createAsyncThunk<
  GetMocksResponse,
  number | undefined,
  {
    rejectValue: string;
  }
>('mock/getMocks', async (page = 1, { rejectWithValue }) => {
  try {
    const response = await clientAPI.getMocks(page);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ?? 'Failed to get mocks'
      );
    }

    return rejectWithValue('Something went wrong');
  }
});

export const getMockDetails = createAsyncThunk('mock/getMockDetails', async (mockId: string) => {
  try {
    const response = await clientAPI.getMockDetails(mockId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to get mock details'
      );
    }
    throw new Error('Something went wrong');
  }
});

export const getMockQuestions = createAsyncThunk('mock/getMockQuestions', async (mockId?: string) => {
  try {
    if (!mockId) throw new Error('Mock ID is required');
    const response = await clientAPI.getMockQuestions(mockId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to get mock questions'
      );
    }
    throw new Error('Something went wrong');
  }
});

export const submitMockExam = createAsyncThunk('mock/submitMockExam', async ({ mockId, data }: { mockId: string; data: MockSubmitData}) => {
  try {
    if (!mockId) throw new Error('Mock ID is required');
    console.log('Submitting mock exam with data:', data);
    const response = await clientAPI.submitMockExam(mockId, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to submit mock exam'
      );
    }
    throw new Error('Something went wrong');
  }
});

export const getMockResult = createAsyncThunk('mock/getMockResult', async (resultId: string) => {
  try {
    if (!resultId) throw new Error('Result ID is required');
    const response = await clientAPI.getMockResult(resultId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to get mock result'
      );
    }
    throw new Error('Something went wrong');
  }
});

export const getResults = createAsyncThunk('mock/getResults', async () => {
  try {
    const response = await clientAPI.getMockResults();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to get mock result'
      );
    }
    throw new Error('Something went wrong');
  }
});

const mockSlice = createSlice({
  name: 'mock',
  initialState,
  reducers: {
    resetMockSlice: (state) => {
      state.mocks= [];
      state.mock= null;
      state.mockQuestions= [];
      state.loading= false;
      state.error= null;
      state.mockResult= {
        summary: {
          mockName: "",
          cfaLevel: "",
          totalTime: 0,
          correctCount: 0,
          wrongCount: 0,
          attempted: 0,
          notAttempted: 0,
          totalQuestions: 0,
          totalTimeSpent: 0,
          overallTimeLeft: 0,
          percentage: 0,
          passed: false
        },
        subjectStats: []
      };
      state.results = [];
    },
    setMock: (state, action) => {
      state.mock = action.payload;
    },
    resetMockResult: (state) => {
      state.mockResult = {
        summary: {
          mockName: "",
          cfaLevel: "",
          totalTime: 0,
          correctCount: 0,
          wrongCount: 0,
          attempted: 0,
          notAttempted: 0,
          totalQuestions: 0,
          totalTimeSpent: 0,
          overallTimeLeft: 0,
          percentage: 0,
          passed: false
        },
        subjectStats: []
      };
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMocks.fulfilled, (state, action) => {
        state.loading = false;
        state.mocks = action.payload.data;
        state.error = null;
      })

      .addCase(getMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to get mocks';
      });
    
    builder
      .addCase(getMockDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.mock = action.payload.data;
        state.error = null;
      })

      .addCase(getMockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to get mock details';
      });
    
    builder
      .addCase(getMockQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMockQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.mockQuestions = action.payload.data;
        state.error = null;
      })
      .addCase(getMockQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to get mock questions';
      });
    
    builder
      .addCase(submitMockExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMockExam.fulfilled, (state, action) => {
        console.log('Mock exam submitted successfully:', action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(submitMockExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to submit mock exam';
      });
    
    builder
      .addCase(getMockResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMockResult.fulfilled, (state, action) => {
        // console.log('Mock result retrieved successfully:', action.payload.data.summary.wrong_count);
        state.loading = false;

        state.mockResult.summary.mockName = action.payload.data.summary.mock_name;
        state.mockResult.summary.cfaLevel = action.payload.data.summary.cfa_level;
        state.mockResult.summary.totalTime = action.payload.data.summary.total_time;
        state.mockResult.summary.correctCount = action.payload.data.summary.correct_count;
        state.mockResult.summary.wrongCount = action.payload.data.summary.wrong_count;
        state.mockResult.summary.attempted = action.payload.data.summary.attempted;
        state.mockResult.summary.totalQuestions = action.payload.data.summary.total_questions;
        state.mockResult.summary.totalTimeSpent = action.payload.data.summary.total_time_spent;
        state.mockResult.summary.percentage = action.payload.data.summary.percentage;
        state.mockResult.summary.passed = action.payload.data.summary.result;
        state.mockResult.summary.scaledScore = action.payload.data.summary.scaled_score;
        state.mockResult.summary.mps = action.payload.data.summary.mps;
        state.mockResult.summary.maxScore = action.payload.data.summary.max_score;
        state.mockResult.subjectStats = action.payload.data.subjects.map((s: any) => ({
          subject: s.subject,
          score: s.score,
          total: s.total,
          weight: s.weight,
        }));

        state.error = null;
      })
      .addCase(getMockResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to get mock result';
      });

    builder
      .addCase(getResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResults.fulfilled, (state, action) => {
        // console.log('Mock result retrieved successfully:', action.payload.data.summary.wrong_count);
        state.loading = false;
        state.results = action.payload.data.map((res:any) => ({
          ...res,
          resultId:res.result_id,
          cfaLevel:res.cfa_level,
          submittedAt:res.submitted_at,
        }))
        state.error = null;
      })
      .addCase(getResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to get mock result';
      });
  },
});

export const { 
  setMock,
  resetMockSlice,
  resetMockResult,
 } = mockSlice.actions;

export default mockSlice.reducer;