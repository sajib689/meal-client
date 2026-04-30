import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Notice {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

interface NoticeState {
    notices: Notice[];
    loading: boolean;
    error: string | null;
}

const initialState: NoticeState = {
    notices: [],
    loading: false,
    error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchNotices = createAsyncThunk("notice/fetchAll", async () => {
    const response = await axios.get(`${API_URL}/api/notice/all`);
    return response.data;
});

const noticeSlice = createSlice({
    name: "notice",
    initialState,
    reducers: {
        addNotice: (state, action: PayloadAction<Notice>) => {
            state.notices.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotices.fulfilled, (state, action) => {
                state.loading = false;
                state.notices = action.payload;
            })
            .addCase(fetchNotices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch notices";
            });
    },
});

export const { addNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
