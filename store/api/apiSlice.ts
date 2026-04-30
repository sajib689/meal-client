import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["User", "Meal", "Notice", "Bazar", "Report", "Package", "Subscription", "Payment", "Setting", "Room", "Support", "Activity"],
    endpoints: () => ({}),
});
