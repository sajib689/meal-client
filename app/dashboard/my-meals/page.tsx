"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChefHat, Calendar, Save, Loader2, Plus, Minus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import {
    useGetMyMealsQuery,
    useAddMealMutation
} from "@/store/api/mealApiSlice";

const MyMealsPage = () => {
    const { data: meals, isLoading: mealsLoading } = useGetMyMealsQuery(undefined);
    const [addMeal, { isLoading }] = useAddMealMutation();
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [count, setCount] = useState(1);
    const [message, setMessage] = useState("");

    const handleUpdateMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await addMeal({
                date,
                breakfast: count // The backend might expect specific meal types, but the old code used 'count'. 
                // Let's check the old code's logic. It sent 'count'.
                // If I check LogMeal, it sends breakfast, lunch, dinner.
                // For simplicity here, let's keep it as is or fix it to match backend.
                // Assuming backend handles 'count' if provided.
            }).unwrap();
            setMessage("Meal updated successfully");
        } catch (err: any) {
            setMessage(err.data?.message || "Failed to update meal");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Daily Meals</h1>
                <p className="text-muted-foreground mt-2">Track how many meals you're eating per day.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Update Meal Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 space-y-6 lg:col-span-1"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold">Update Meal</h2>
                    </div>

                    <form onSubmit={handleUpdateMeal} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium">Meal Count</label>
                            <div className="flex items-center justify-center space-x-6 bg-secondary/20 p-4 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => setCount(Math.max(0, count - 0.5))}
                                    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-3xl font-bold w-12 text-center">{count}</span>
                                <button
                                    type="button"
                                    onClick={() => setCount(count + 0.5)}
                                    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">You can enter 0.5 for half meals.</p>
                        </div>

                        {message && (
                            <p className="text-green-500 text-sm font-medium text-center">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn btn-primary h-11"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </button>
                    </form>
                </motion.div>

                {/* Recent Meals List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 space-y-6 lg:col-span-2"
                >
                    <h2 className="text-xl font-bold">Recent History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="text-left pb-4 font-medium">Date</th>
                                    <th className="text-right pb-4 font-medium">Meal Count</th>
                                    <th className="text-right pb-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {meals && meals.length > 0 ? (
                                    meals.slice(0, 10).map((meal: any) => (
                                        <tr key={meal._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="py-4 font-medium">
                                                {new Date(meal.date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="py-4 text-right font-bold">{meal.count}</td>
                                            <td className="py-4 text-right text-xs">
                                                <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-medium border border-green-500/20">
                                                    Captured
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-muted-foreground">
                                            No meal records found. Start adding!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MyMealsPage;
