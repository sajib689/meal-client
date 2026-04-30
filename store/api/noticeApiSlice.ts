import { apiSlice } from "./apiSlice";

export const noticeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotices: builder.query({
            query: () => "/api/notice/all",
            providesTags: ["Notice"],
        }),
        createNotice: builder.mutation({
            query: (data) => ({
                url: "/api/notice/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notice"],
        }),
        deleteNotice: builder.mutation({
            query: (id) => ({
                url: `/api/notice/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notice"],
        }),
    }),
});

export const {
    useGetNoticesQuery,
    useCreateNoticeMutation,
    useDeleteNoticeMutation,
} = noticeApiSlice;
