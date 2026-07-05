import { ClientAPI } from '@/api/client-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Mock {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  cfa_level: string;
  total_questions: string;
  formatted_duration: string;
  mock_modules_count: number;
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
  loading: boolean;
  error: string | null;
}

const initialState: MockState = {
  mocks: [],
  mock: null,
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
    const response = await ClientAPI.getMocks(page);
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

export const getMockQuestions = createAsyncThunk('mock/getMockQuestions', async (mockId: string) => {
  try {
    const response = await ClientAPI.getMockQuestions(mockId);
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
      .addCase(getMockQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMockQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getMockQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to get mock questions';
      })
  },
});

export const { setMock } = mockSlice.actions;

export default mockSlice.reducer;