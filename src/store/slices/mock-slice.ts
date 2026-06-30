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
  loading: boolean;
  error: string | null;
}

const initialState: MockState = {
  mocks: [],
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

const mockSlice = createSlice({
  name: 'mock',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getMocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMocks.fulfilled, (state, action) => {
        // console.log('====================================');
        // console.log(JSON.stringify(action.payload,null,2));
        // console.log('====================================');
        state.loading = false;
        state.mocks = action.payload.data;
        state.error = null;
      })

      .addCase(getMocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to get mocks';
      });
  },
});

export default mockSlice.reducer;