import { AuthAPI } from '@/api/auth-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVarified: boolean;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
//   refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
//   refreshToken: null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const login = createAsyncThunk<
  LoginResponse,
  {
    email:string;
    password:string;
  },
  {
    rejectValue:string;
  }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await AuthAPI.login({
            email,
            password,
        });

        // response.data should contain:
        // {
        //   token,
        //   refreshToken,
        //   user
        // }

      return response.data;
    } catch (error) {
        return rejectWithValue(
            error?.response?.data?.message || 'Login failed'
        );
    }
  }
);

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginStart: (state) => {
        state.loading = true;
        state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
        },
        logout: (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        // state.refreshToken = null;
        state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

        // LOGIN PENDING
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        // LOGIN SUCCESS
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            // state.refreshToken = action.payload.refreshToken;
            state.error = null;
            state.isInitialized = true;
        })

        // LOGIN FAILED
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? 'Login failed';
            state.isAuthenticated = false;
        });
    },
});

export default authSlice.reducer; 