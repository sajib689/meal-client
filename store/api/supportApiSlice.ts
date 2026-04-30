import { apiSlice } from "./apiSlice";

export const supportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: () => "/api/support",
            providesTags: ["Support"],
        }),
        getTicketMetrics: builder.query({
            query: () => "/api/support/metrics",
            providesTags: ["Support"],
        }),
        createTicket: builder.mutation({
            query: (data) => ({
                url: "/api/support",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Support"],
        }),
        updateTicket: builder.mutation({
            query: ({ id, data }) => ({
                url: `/support/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Support"],
        }),
        addReply: builder.mutation({
            query: ({ id, data }) => ({
                url: `/support/${id}/reply`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Support"],
        }),
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/support/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Support"],
        }),
    }),
});

export const {
    useGetTicketsQuery,
    useGetTicketMetricsQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
    useAddReplyMutation,
    useDeleteTicketMutation,
} = supportApiSlice;
