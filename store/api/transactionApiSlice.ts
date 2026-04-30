import { apiSlice } from "./apiSlice";

export const transactionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyTransactions: builder.query({
            query: () => "/api/transaction/my-transactions",
            providesTags: ["Report"], // Re-using Report tag for simplicity as they are related
        }),
        getAllTransactions: builder.query({
            query: () => "/api/transaction/all",
            providesTags: ["Report", "User"],
        }),
        addDeposit: builder.mutation({
            query: (data) => ({
                url: "/api/transaction/deposit",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Report", "User"],
        }),
    }),
});

export const {
    useGetMyTransactionsQuery,
    useGetAllTransactionsQuery,
    useAddDepositMutation,
} = transactionApiSlice;
