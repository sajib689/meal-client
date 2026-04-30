import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        getUsers: builder.query({
            query: () => "/api/auth/users",
            providesTags: ["User"],
        }),
        createMember: builder.mutation({
            query: (data) => ({
                url: "/api/auth/create-member",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/auth/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/auth/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        resetPassword: builder.mutation({
            query: ({ id, newPassword }) => ({
                url: `/api/auth/users/${id}/reset-password`,
                method: "POST",
                body: { newPassword },
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/api/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),
        deposit: builder.mutation({
            query: (data) => ({
                url: "/api/auth/deposit",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User", "Report"],
        }),
        createAdminMess: builder.mutation({
            query: (data) => ({
                url: "/api/auth/create-admin-mess",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
    useGetUsersQuery,
    useCreateMemberMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useDepositMutation,
    useCreateAdminMessMutation,
} = authApiSlice;
