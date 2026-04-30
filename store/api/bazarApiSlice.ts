import { apiSlice } from "./apiSlice";

export const bazarApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBazars: builder.query({
            query: (params) => ({
                url: "/api/bazar/all",
                params,
            }),
            providesTags: ["Bazar"],
        }),
        addBazar: builder.mutation({
            query: (data) => ({
                url: "/api/bazar/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Bazar"],
        }),
        approveBazar: builder.mutation({
            query: (id) => ({
                url: `/api/bazar/approve/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Bazar"],
        }),
        deleteBazar: builder.mutation({
            query: (id) => ({
                url: `/api/bazar/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Bazar"],
        }),
    }),
});

export const {
    useGetBazarsQuery,
    useAddBazarMutation,
    useApproveBazarMutation,
    useDeleteBazarMutation,
} = bazarApiSlice;
