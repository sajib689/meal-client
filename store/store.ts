import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import mealReducer from "./slices/mealSlice";
import noticeReducer from "./slices/noticeSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        meal: mealReducer,
        notice: noticeReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
