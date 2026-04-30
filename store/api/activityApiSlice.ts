import { apiSlice } from "./apiSlice";

export const activityApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGlobalActivity: builder.query({
            query: () => "/api/activity/global",
            providesTags: ["Activity"],
        }),
        getTenantActivity: builder.query({
            query: () => "/api/activity/tenant",
            providesTags: ["Activity"],
        }),
    }),
});

export const {
    useGetGlobalActivityQuery,
    useGetTenantActivityQuery,
} = activityApiSlice;
