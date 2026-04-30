import { apiSlice } from "./apiSlice";

export const settingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => "/api/settings",
            providesTags: ["Setting"],
        }),
        updateSettings: builder.mutation({
            query: (data) => ({
                url: "/api/settings",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Setting"],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingApiSlice;
