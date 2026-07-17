import { clientAPI } from "@/api/client-api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
interface DashboardState {
    loading:boolean,
    error:string | null,
    performance:{
        mock:string,
        totalQuestionsSolved:number;
        averageScore:number;
        streakScore:number;
    };
}
const initialState:DashboardState = {
    loading:false,
    error:null,
    performance:{
        mock:'',
        totalQuestionsSolved:0,
        averageScore:0,
        streakScore:0,
    }   
};

export const dashboard = createAsyncThunk('mock/dashboard', async () => {
  try {
    const response = await clientAPI.dashboard();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to dashboard details'
      );
    }
    throw new Error('Something went wrong');
  }
})


const dashboardSlice = createSlice({
    name:'dashboard',
    initialState,
    reducers:{
        resetDashboardSlice:(state) => {
        state.performance = {
            mock:'',
            totalQuestionsSolved:0,
            averageScore:0,
            streakScore:0,
        }
        state.loading = false;
        state.error = null;
      }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(dashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
    
            .addCase(dashboard.fulfilled, (state, action) => {
                state.loading = false;
                 state.performance = {
                    mock: action.payload.data.mock,
                    averageScore: action.payload.data.average_score,
                    streakScore: action.payload.data.streak_score,
                    totalQuestionsSolved: action.payload.data.total_questions_solved,
                };
                state.error = null;
            })
    
            .addCase(dashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to get mocks';
            });
                
    }
});
export const { 
  resetDashboardSlice
 } = dashboardSlice.actions;
export default dashboardSlice.reducer;