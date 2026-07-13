import { clientAPI } from '@/api/client-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
interface PerformanceSlice {
    loading:boolean;
    summary:{
        averageScore:number;
        bestScore:number;
        improvement:number;
        studyStreakScore:number;
    };
    mockProgress: {
        name:string;
        percentage:number;
        createdAt:string;
    }[];
    topicAccuracy: {
        name:string;
        accuracy:string;
    }[] | null;
    studyStreak:{
        date:string;
        intensity:number;
        mocksCompleted:number;
    }[] | null;
    error:string | null;
    
}

const initialState :PerformanceSlice = {
    loading:false,
    summary:{
        averageScore:0,
        bestScore:0,
        improvement:0,
        studyStreakScore:0,
    },
    mockProgress:[{
        name:'',
        percentage:0,
        createdAt:'',
    }],
    topicAccuracy:null,
    studyStreak:null,
    error:null,
}

export const getPerformance = createAsyncThunk('performance/getPerformance', async(_,{rejectWithValue})=>{
    try{
        const result = await clientAPI.getPerformance();
        return result.data;
    } catch (error){
        if (axios.isAxiosError(error)) {
        throw new Error(
            error.response?.data?.message ?? 'Failed to get performance details'
        );
        }
        throw new Error('Something went wrong');
    }
})

const performanceSlice = createSlice({
    name:'performance',
    initialState,
    reducers:{
        resetPerformanceSlice:(state)=>{
            state.loading = false;
            state.error = null;
            state.summary = {
                averageScore:0,
                bestScore:0,
                improvement:0,
                studyStreakScore:0,
            };
            state.mockProgress = [
                {
                    name:'',
                    percentage:0,
                    createdAt:'',
                }
            ];
            state.topicAccuracy = null;
            state.studyStreak = null;
        }
    },
    extraReducers:(builder) => {
        builder
            .addCase(getPerformance.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getPerformance.fulfilled,(state, action)=>{
                // console.log('====================================');
                // console.log(JSON.stringify(action.payload));
                // console.log('====================================');
                state.loading = true;
                state.summary.averageScore = action.payload.data.summary.average_score;
                state.summary.bestScore = action.payload.data.summary.best_score;
                state.summary.improvement = action.payload.data.summary.improvement;
                state.summary.studyStreakScore = action.payload.data.summary.study_streak_score;
                state.mockProgress = action.payload.data.mock_progress.map((s: any)=>({
                    name:s.mock_name,
                    percentage:s.percentage,
                    createdAt:s.created_at,
                }));
                state.studyStreak = action.payload.data.study_streak.map((s:{date:string; intensity:number; mocks_completed:number})=>({
                    date:s.date,
                    intensity:s.intensity,
                    mocksCompleted:s.mocks_completed,
                }));
                state.topicAccuracy = action.payload.data.topic_accuracy;
                state.error = null;
            })
            .addCase(getPerformance.rejected,(state)=>{
                state.loading = true;
                state.error = null;
            })
        
    }
});

export const { resetPerformanceSlice } = performanceSlice.actions;

export default performanceSlice.reducer;