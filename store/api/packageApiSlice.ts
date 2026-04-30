import { apiSlice } from "./apiSlice";

export const packageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPackages: builder.query({
            query: () => "/api/packages",
            providesTags: ["Package"],
        }),
        createPackage: builder.mutation({
            query: (data) => ({
                url: "/api/packages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Package"],
        }),
        updatePackage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/packages/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Package"],
        }),
        deletePackage: builder.mutation({
            query: (id) => ({
                url: `/packages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Package"],
        }),
    }),
});

export const {
    useGetPackagesQuery,
    useCreatePackageMutation,
    useUpdatePackageMutation,
    useDeletePackageMutation,
} = packageApiSlice;
