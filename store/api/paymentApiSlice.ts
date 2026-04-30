import { apiSlice } from "./apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPayments: builder.query({
            query: () => "/api/payments",
            providesTags: ["Payment"],
        }),
        initiatePayment: builder.mutation({
            query: (data) => ({
                url: "/api/payments/init",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Payment"],
        }),
    }),
});

export const {
    useGetAllPaymentsQuery,
    useInitiatePaymentMutation,
} = paymentApiSlice;
