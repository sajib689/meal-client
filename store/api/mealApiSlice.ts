import { apiSlice } from "./apiSlice";

export const mealApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyMeals: builder.query({
            query: (params) => ({
                url: "/api/meal/my-meals",
                params,
            }),
            providesTags: ["Meal"],
        }),
        getAllMeals: builder.query({
            query: (params) => ({
                url: "/api/meal/all",
                params,
            }),
            providesTags: ["Meal"],
        }),
        getMonthlySummary: builder.query({
            query: (month) => `/api/meal/summary/${month}`,
            providesTags: ["Meal"],
        }),
        addMeal: builder.mutation({
            query: (data) => ({
                url: "/api/meal/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Meal"],
        }),
        deleteMeal: builder.mutation({
            query: (id) => ({
                url: `/api/meal/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Meal"],
        }),
    }),
});

export const {
    useGetMyMealsQuery,
    useGetAllMealsQuery,
    useGetMonthlySummaryQuery,
    useAddMealMutation,
    useDeleteMealMutation,
} = mealApiSlice;
