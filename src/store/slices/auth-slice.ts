import { AuthAPI } from '@/api/auth-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { log } from 'node:console';

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
      return response.data;
    } catch (error) {
        return rejectWithValue(
            error?.response?.data?.message || error?.message || 'Login failed'
        );
    }
  }
);

export const register = createAsyncThunk<LoginResponse, { name: string; email: string; password: string; confirmPassword: string }, { rejectValue: string }>(
  'auth/register',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    if (password !== confirmPassword) {
      return rejectWithValue('Passwords do not match');
    }
    try {
      const response = await AuthAPI.register({ name, email, password, password_confirmation: confirmPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Signup failed'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await AuthAPI.logout();
  return response.data;
});

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
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
            console.log('Login failed:', action.payload);
            state.loading = false;
            state.error = action.payload ?? 'Login failed';
            state.isAuthenticated = false;
        });

        builder
        // REGISTER PENDING
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        // REGISTER SUCCESS
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            // state.refreshToken = action.payload.refreshToken;
            state.error = null;
            state.isInitialized = true;
        })

        // REGISTER FAILED
        .addCase(register.rejected, (state, action) => {
            console.log('Register failed:', action.payload);
            state.loading = false;
            state.error = action.payload ?? 'Register failed';
            state.isAuthenticated = false;
        });

        // LOGOUT PENDING
        builder
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            // state.refreshToken = null;
            state.error = null;
            state.isInitialized = true;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? 'Logout failed';
        });

    },
});

export default authSlice.reducer; 