import { clientAPI } from '@/api/client-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { log } from 'console';

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

interface MockState {
  mocks: Mock[];
  mock: Mock | null;
  mockQuestions: MockQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: MockState = {
  mocks: [],
  mock: null,
  mockQuestions: [],
  loading: false,
  error: null,
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

const mockSlice = createSlice({
  name: 'mock',
  initialState,
  reducers: {
    setMock: (state, action) => {
      state.mock = action.payload;
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
  },
});

export const { setMock } = mockSlice.actions;

export default mockSlice.reducer;