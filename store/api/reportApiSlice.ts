import { apiSlice } from "./apiSlice";

export const reportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStats: builder.query({
            query: (params) => ({
                url: "/api/report/get-stats",
                params: params,
            }),
            providesTags: ["Report"],
        }),
        getReports: builder.query({
            query: () => "/api/report/all",
            providesTags: ["Report"],
        }),
        generateReport: builder.mutation({
            query: (data) => ({
                url: "/api/report/generate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Report", "User", "Meal"],
        }),
        notifyReport: builder.mutation({
            query: (data) => ({
                url: "/api/report/notify",
                method: "POST",
                body: data,
            }),
        }),
        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/api/report/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Report"],
        }),
        getSuperAdminStats: builder.query({
            query: () => "/api/report/superadmin-stats",
            providesTags: ["Report"],
        }),
    }),
});

export const {
    useGetStatsQuery,
    useGetReportsQuery,
    useGenerateReportMutation,
    useNotifyReportMutation,
    useDeleteReportMutation,
    useGetSuperAdminStatsQuery,
} = reportApiSlice;
