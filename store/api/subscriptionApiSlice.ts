import { apiSlice } from "./apiSlice";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubscriptions: builder.query({
            query: () => "/api/subscriptions/all",
            providesTags: ["Subscription"],
        }),
        getTenantSubscription: builder.query({
            query: () => "/api/subscriptions/my-subscription",
            providesTags: ["Subscription"],
        }),
        assignSubscription: builder.mutation({
            query: (data) => ({
                url: "/api/subscriptions/assign",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),
    }),
});

export const {
    useGetAllSubscriptionsQuery,
    useGetTenantSubscriptionQuery,
    useAssignSubscriptionMutation,
} = subscriptionApiSlice;
