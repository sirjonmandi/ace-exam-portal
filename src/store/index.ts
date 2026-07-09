import { configureStore } from "@reduxjs/toolkit";
import authSlice from '@/store/slices/auth-slice';
import mockSlice from '@/store/slices/mock-slice';
import performanceSlice from '@/store/slices/performance-slice';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    mocks: mockSlice,
    performance: performanceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
