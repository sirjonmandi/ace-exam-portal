import { clientAPI } from '@/api/client-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Mock {
  id: string;
  session_id?: number;
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
  explanation?: string;
}

export interface MockSubmitData {
  examId: string;
  sessionId?: string;
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
  data: Mock[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more_pages: boolean;
  };
}

export interface SessionMockSession {
  session_id: number;
  name: string;
  total_questions: number;
  duration_minutes: number;
  formatted_duration: string;
  total_modules_count: number;
  submission_status: string | null;
  result_id: string | null;
  is_retake: boolean;
  is_locked: boolean;
}

export interface SessionMock {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  cfa_level: string;
  sessions: SessionMockSession[];
  is_active: boolean;
  progress: number | null;
  is_unlocked: boolean;
  unlock_name: string | null;
}

interface GetSessionMocksResponse {
  success: boolean;
  message: string;
  data: SessionMock[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more_pages: boolean;
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

export interface AnswerStat {
  topic: string;
  prompt: string;
  options: { key: "A" | "B" | "C"; text: string }[];
  correctOption: "A" | "B" | "C";
  givenOption: "A" | "B" | "C" | null;
}

interface MockState {
  mocks: Mock[];
  mocksPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
  };
  sessionMocks: SessionMock[];
  sessionMocksPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
  };
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
  answerStats: {
    questions: AnswerStat[];
    pagination: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
      hasMorePages: boolean;
    };
  };
}

const initialState: MockState = {
  mocks: [],
  mocksPagination: {
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    hasMorePages: false,
  },
  sessionMocks: [],
  sessionMocksPagination: {
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    hasMorePages: false,
  },
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
  answerStats: {
    questions: [],
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,
      hasMorePages: false,
    },
  },
};

export const getMocks = createAsyncThunk<
  GetMocksResponse,
  number | undefined,
  {
    rejectValue: string;
  }
>('mock/getMocks', async (page = 1, { rejectWithValue }) => {
  try {
    const response = await clientAPI.getMocks('standard',page);
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

export const getSessionMocks = createAsyncThunk<
  GetSessionMocksResponse,
  number | undefined,
  {
    rejectValue: string;
  }
>('mock/getSessionMocks', async (page = 1, { rejectWithValue }) => {
  try {
    const response = await clientAPI.getMocks('session-based', page);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ?? 'Failed to get session mocks'
      );
    }

    return rejectWithValue('Something went wrong');
  }
});

export const getMockDetails = createAsyncThunk('mock/getMockDetails', async ({ mockId, sessionId }: { mockId: string; sessionId?: string },{ rejectWithValue }) => {
  try {
    const response = await clientAPI.getMockDetails(mockId, sessionId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message ?? 'Failed to get mocks',
        status: error.response?.status,
      });
    }

    return rejectWithValue({ message: 'Something went wrong' });
  }
});

export const getMockQuestions = createAsyncThunk('mock/getMockQuestions', async (args?: { mockId?: string; sessionId?: string },{ rejectWithValue }) => {
  try {
    const mockId = args?.mockId;
    if (!mockId) throw new Error('Mock ID is required');
    const response = await clientAPI.getMockQuestions(mockId, args?.sessionId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message ?? 'Failed to get mocks',
        status: error.response?.status,
      });
    }

    return rejectWithValue({ message: 'Something went wrong' });
  }
});

export const submitMockExam = createAsyncThunk('mock/submitMockExam', async ({ mockId, data }: { mockId: string; data: MockSubmitData}, { rejectWithValue }) => {
  try {
    if (!mockId) throw new Error('Mock ID is required');
    console.log('Submitting mock exam with data:', data);
    const response = await clientAPI.submitMockExam(mockId, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message ?? 'Failed to submit mock exam',
        status: error.response?.status,
      });
    }
    return rejectWithValue({ message: 'Something went wrong' });
  }
});

export const getMockResult = createAsyncThunk('mock/getMockResult', async (resultId: string,{ rejectWithValue }) => {
  try {
    if (!resultId) throw new Error('Result ID is required');
    const response = await clientAPI.getMockResult(resultId);
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

export const getResults = createAsyncThunk('mock/getResults', async (_,{ rejectWithValue }) => {
  try {
    const response = await clientAPI.getMockResults();
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

export const getAnswerStats = createAsyncThunk('mock/getAnswerStats', async ({mockAttemptId,pageNo}:{ mockAttemptId:string, pageNo:number },{ rejectWithValue }) => {
  try {
    const response = await clientAPI.getAnswerStats(mockAttemptId,pageNo);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ?? 'Failed to get mocks'
      );
    }

    return rejectWithValue('Something went wrong');
  }
})

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
      state.answerStats = {
        questions: [],
        pagination: {
          currentPage: 1,
          perPage: 10,
          total: 0,
          lastPage: 1,
          hasMorePages: false,
        },
      };
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
        state.mocks = (action.meta.arg ?? 1) > 1 ? [...state.mocks, ...action.payload.data] : action.payload.data;
        state.mocksPagination = {
          currentPage: action.payload.pagination.current_page,
          perPage: action.payload.pagination.per_page,
          total: action.payload.pagination.total,
          lastPage: action.payload.pagination.last_page,
          hasMorePages: action.payload.pagination.has_more_pages,
        };
        state.error = null;
      })

      .addCase(getMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to get mocks';
      });

    builder
      .addCase(getSessionMocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSessionMocks.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionMocks = (action.meta.arg ?? 1) > 1 ? [...state.sessionMocks, ...action.payload.data] : action.payload.data;
        state.sessionMocksPagination = {
          currentPage: action.payload.pagination.current_page,
          perPage: action.payload.pagination.per_page,
          total: action.payload.pagination.total,
          lastPage: action.payload.pagination.last_page,
          hasMorePages: action.payload.pagination.has_more_pages,
        };
        state.error = null;
      })

      .addCase(getSessionMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to get session mocks';
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
        state.error = (action.payload as any)?.message ?? action.error.message ?? 'Failed to get mock details';
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
        state.error = (action.payload as any)?.message ?? action.error.message ?? 'Failed to get mock questions';
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
        state.error = (action.payload as any)?.message ?? action.error.message ?? 'Failed to submit mock exam';
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
    
    builder
      .addCase(getAnswerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnswerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.answerStats.questions = action.payload.data.map((q: any) => ({
          topic: q.topic,
          prompt: q.prompt,
          options: q.options,
          correctOption: q.correct_option,
          givenOption: q.given_option,
        }));
        state.answerStats.pagination = {
          currentPage: action.payload.pagination.current_page,
          perPage: action.payload.pagination.per_page,
          total: action.payload.pagination.total,
          lastPage: action.payload.pagination.last_page,
          hasMorePages: action.payload.pagination.has_more_pages,
        };
        state.error = null;
      })
      .addCase(getAnswerStats.rejected, (state, action) => {
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