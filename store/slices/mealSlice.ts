import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Meal {
    _id: string;
    userId: string;
    date: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    isLocked: boolean;
}

interface MealState {
    myMeals: Meal[];
    allMeals: Meal[];
    loading: boolean;
    error: string | null;
}

const initialState: MealState = {
    myMeals: [],
    allMeals: [],
    loading: false,
    error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchMyMeals = createAsyncThunk("meal/fetchMy", async () => {
    const response = await axios.get(`${API_URL}/api/meal/my-meals`);
    return response.data;
});

const mealSlice = createSlice({
    name: "meal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyMeals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyMeals.fulfilled, (state, action) => {
                state.loading = false;
                state.myMeals = action.payload;
            })
            .addCase(fetchMyMeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch your meals";
            });
    },
});

export default mealSlice.reducer;
