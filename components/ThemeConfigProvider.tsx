"use client";

import React from "react";
import { ConfigProvider, theme, App } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setThemeMode } from "@/store/slices/themeSlice";
import { setCredentials } from "@/store/slices/authSlice";

export default function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
    const { mode } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        
        // Initialize Theme
        const savedTheme = localStorage.getItem("themeMode") as "light" | "dark";
        if (savedTheme && savedTheme !== mode) {
            dispatch(setThemeMode(savedTheme));
        }

        // Initialize Auth
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            try {
                dispatch(setCredentials({ 
                    token: savedToken, 
                    user: JSON.parse(savedUser) 
                }));
                // Set axios default header for client-side requests
                import("axios").then((axios) => {
                    axios.default.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
                });
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
    }, []);

    React.useEffect(() => {
        if (!mounted) return;
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode, mounted]);

    return (
        <ConfigProvider
            theme={{
                algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#0d9488", // Teal 600
                    colorSuccess: "#10b981",
                    colorError: "#ef4444",
                    colorWarning: "#f59e0b",
                    borderRadius: 12,
                    fontFamily: "var(--font-outfit), var(--font-inter), sans-serif",
                },
                components: {
                    Button: {
                        borderRadius: 10,
                        controlHeight: 44,
                        fontWeight: 600,
                    },
                    Card: {
                        borderRadiusLG: 20,
                        colorBgContainer: "#ffffff",
                    },
                    Input: {
                        borderRadius: 10,
                        controlHeight: 44,
                    },
                    Layout: {
                        bodyBg: mode === "dark" ? "#0f172a" : "#f8fafc",
                        headerBg: mode === "dark" ? "#111827" : "#ffffff", // Slightly darker header in dark mode
                        siderBg: mode === "dark" ? "#111827" : "#ffffff",
                    }
                },
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
}
