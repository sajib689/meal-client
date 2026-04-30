import { apiSlice } from "./apiSlice";

export const roomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query({
            query: () => "/api/rooms",
            providesTags: ["Room"],
        }),
        createRoom: builder.mutation({
            query: (data) => ({
                url: "/api/rooms",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Room"],
        }),
        updateRoom: builder.mutation({
            query: ({ id, data }) => ({
                url: `/rooms/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Room"],
        }),
        deleteRoom: builder.mutation({
            query: (id) => ({
                url: `/rooms/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Room"],
        }),
        addSeatInfo: builder.mutation({
            query: ({ roomId, data }) => ({
                url: `/rooms/${roomId}/seats`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Room"],
        }),
        removeSeatInfo: builder.mutation({
            query: ({ roomId, seatId }) => ({
                url: `/rooms/${roomId}/seats/${seatId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Room"],
        }),
    }),
});

export const {
    useGetRoomsQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation,
    useAddSeatInfoMutation,
    useRemoveSeatInfoMutation,
} = roomApiSlice;
