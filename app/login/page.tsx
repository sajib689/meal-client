"use client";

import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography, App as AntdApp } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";

import { useLoginMutation } from "@/store/api/authApiSlice";

const { Title, Text } = Typography;

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { notification: antNotification } = AntdApp.useApp();
    const [login, { isLoading }] = useLoginMutation();
    const { token } = useSelector((state: RootState) => state.auth);

    // If already authenticated in Redux (real session), redirect to dashboard
    useEffect(() => {
        if (token) {
            router.replace("/dashboard");
        }
    }, [token, router]);

    const onFinish = async (values: any) => {
        try {
            const data = await login(values).unwrap();
            const { token, user } = data;
            dispatch(setCredentials({ token, user }));

            // Store in cookie for Next.js middleware routing
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

            antNotification.success({
                message: "Login Successful",
                description: `Welcome back, ${user.name}!`,
            });

            window.location.href = "/dashboard";
        } catch (error: any) {
            antNotification.error({
                message: "Login Failed",
                description: error.data?.message || "Something went wrong",
            });
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans selection:bg-indigo-100">
            {/* Left: Hero Section */}
            <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4338ca, #6d28d9, #7e22ce)' }}>
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-400 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="relative z-10 w-full max-w-lg text-center">
                    <div className="mb-10 animate-in zoom-in duration-1000">
                        <img
                            src="/hero.png"
                            alt="Meal Master Hero"
                            className="rounded-[3rem] shadow-2xl hover:scale-[1.05] transition-transform duration-700 w-full"
                        />
                    </div>
                    <Title level={4} className="!text-white !m-0 !text-4xl !font-outfit !font-black !tracking-tighter !leading-tight">
                        Mess Management <br /><span className="text-pink-300">Simplified.</span>
                    </Title>
                    <div className="!text-indigo-100/90 !text-xl mt-6 font-medium leading-relaxed max-w-sm mx-auto">
                        Precision tracking for your meals, expenses, and finances.
                    </div>
                </div>
            </div>

            {/* Right: Login Form Section */}
            <div className="flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-600 rounded-2xl shadow-lg ring-4 ring-indigo-50">
                            <LoginOutlined className="text-white! text-2xl" />
                        </div>
                        <Title level={2} className="!m-0 !text-4xl !font-extrabold tracking-tight text-gray-900">
                            Welcome Back
                        </Title>
                        <Text type="secondary" className="text-lg font-medium text-gray-500 mt-2 block">
                            Please enter your credentials to access your dashboard.
                        </Text>
                    </div>

                    <Card className="cool-card border-none bg-white/70 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-2">
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                            className="mt-4"
                        >
                            <Form.Item
                                name="email"
                                label={<span className="text-gray-600 font-semibold px-1">Email Address</span>}
                                rules={[{ required: true, message: "Email is required!", type: "email" }]}
                                className="mb-8"
                            >
                                <Input
                                    prefix={<UserOutlined className="text-indigo-500 mr-2" />}
                                    placeholder="name@example.com"
                                    className="rounded-2xl h-14 border-gray-100! bg-slate-50/50 hover:bg-white focus:bg-white transition-all shadow-sm"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={<span className="text-gray-600 font-semibold px-1">Password</span>}
                                rules={[{ required: true, message: "Password is required!" }]}
                                className="mb-10"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-indigo-500 mr-2" />}
                                    placeholder="••••••••"
                                    className="rounded-2xl h-14 border-gray-100! bg-slate-50/50 hover:bg-white focus:bg-white transition-all shadow-sm"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    block
                                    className="h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:translate-y-[-1px]"
                                >
                                    Log in to Account
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>

                    <div className="mt-12 text-center text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} Meal Master. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
