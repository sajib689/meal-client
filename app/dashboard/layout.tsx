"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, notification, Spin, Typography } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    CoffeeOutlined,
    ShoppingOutlined,
    NotificationOutlined,
    FileProtectOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CloseOutlined,
    LockOutlined,
    DollarOutlined,
    AppstoreOutlined,
    SettingOutlined,
    SafetyCertificateOutlined,
    MailOutlined,
    MessageOutlined,
    TeamOutlined,
    CustomerServiceOutlined,
    HistoryOutlined,
    HomeOutlined,
    SunOutlined,
    MoonOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toggleThemeMode } from "@/store/slices/themeSlice";
import { useChangePasswordMutation } from "@/store/api/authApiSlice";
import { Drawer, Modal, Form, Input, App as AntdApp, Switch } from "antd";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);
    const [isPassModalVisible, setIsPassModalVisible] = useState(false);
    const [passForm] = Form.useForm();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);
    const { notification: antNotification } = AntdApp.useApp();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { mode } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!token) {
            router.push("/login");
            return;
        }

        // Strict Role-based access control (RBAC)
        if (pathname.startsWith("/dashboard/superadmin") && user?.role !== "superadmin") {
            router.push("/dashboard");
            antNotification.error({ message: "Access Denied: Super Admin only." });
        } else if ((pathname.startsWith("/dashboard/rooms") || pathname.startsWith("/dashboard/subscription")) && user?.role !== "admin") {
            router.push("/dashboard");
            antNotification.error({ message: "Access Denied: Mess Admin only." });
        } else if (pathname.startsWith("/dashboard/users") && (user?.role !== "admin" && user?.role !== "superadmin")) {
            router.push("/dashboard");
            antNotification.error({ message: "Access Denied: Admins only." });
        }
    }, [token, user, pathname, router, mounted, antNotification]);

    const handleLogout = () => {
        dispatch(logout());
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        window.location.href = "/login";
    };

    const [changePassword] = useChangePasswordMutation();

    const handleChangePassword = async (values: any) => {
        try {
            await changePassword(values).unwrap();
            antNotification.success({ message: "Password changed successfully" });
            setIsPassModalVisible(false);
            passForm.resetFields();
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to change password" });
        }
    };

    // Common Routes
    const commonItems: any[] = user?.role !== "superadmin" ? [
        { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/dashboard/users", icon: <UserOutlined />, label: "Manage Members", disabled: user?.role !== "admin" },
        { key: "/dashboard/meals", icon: <CoffeeOutlined />, label: "Meal Tracking" },
        { key: "/dashboard/bazar", icon: <ShoppingOutlined />, label: "Bazar" },
        { key: "/dashboard/notices", icon: <NotificationOutlined />, label: "Notices" },
        { key: "/dashboard/reports", icon: <FileProtectOutlined />, label: "Reports" },
        { key: "/dashboard/transactions", icon: <DollarOutlined />, label: "Transactions", disabled: user?.role === "member" },
    ].filter(item => !item.disabled) : [];

    // Super Admin Exclusive Routes
    const superAdminItems = user?.role === "superadmin" ? [
        { key: "/dashboard/superadmin", icon: <AppstoreOutlined />, label: "System Overview" },
        { key: "/dashboard/superadmin/mess-owners", icon: <TeamOutlined />, label: "Tenant Owners" },
        { key: "/dashboard/superadmin/packages", icon: <ShoppingOutlined />, label: "Packages" },
        { key: "/dashboard/superadmin/subscriptions", icon: <SafetyCertificateOutlined />, label: "Subscriptions" },
        { key: "/dashboard/superadmin/payments", icon: <DollarOutlined />, label: "Payments" },
        { key: "/dashboard/superadmin/users", icon: <UserOutlined />, label: "Global Users" },
        { key: "/dashboard/superadmin/support", icon: <CustomerServiceOutlined />, label: "Support Tickets" },
        { key: "/dashboard/superadmin/reports", icon: <FileProtectOutlined />, label: "Analytics" },
        {
            key: "settings_sub",
            icon: <SettingOutlined />,
            label: "System Settings",
            children: [
                { key: "/dashboard/superadmin/settings/general", label: "General Settings" },
                { key: "/dashboard/superadmin/settings/email", icon: <MailOutlined />, label: "Email config" },
                { key: "/dashboard/superadmin/settings/sms", icon: <MessageOutlined />, label: "SMS Gateway" },
            ]
        },
        { key: "/dashboard/superadmin/activity", icon: <HistoryOutlined />, label: "Activity Logs" },
        { key: "/dashboard/superadmin/security", icon: <LockOutlined />, label: "Security" },
    ] : [];

    const adminItems = user?.role === "admin" ? [
        { type: "divider" },
        { key: "tenant_group", label: "Tenant Settings", type: "group" },
        { key: "/dashboard/rooms", icon: <HomeOutlined />, label: "Rooms & Seats" },
        { key: "/dashboard/subscription", icon: <SafetyCertificateOutlined />, label: "My Subscription" },
    ] : [];

    const memberItems = user?.role === "member" ? [
        { type: "divider" },
        { key: "/dashboard/support", icon: <CustomerServiceOutlined />, label: "Support" },
    ] : [];

    const menuItems = [...commonItems, ...superAdminItems, ...adminItems, ...memberItems];

    if (!mounted || !token) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" tip="Loading Dashboard..." />
            </div>
        );
    }

    return (
        <Layout className="min-h-screen relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                onBreakpoint={(broken) => {
                    if (broken) setCollapsed(true);
                }}
                width={280}
                collapsedWidth={0}
                className={`hidden lg:block h-screen fixed left-0 top-0 z-50 border-r transition-all duration-300 ${mode === 'dark'
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-100'
                    }`}
                style={{
                    boxShadow: mode === 'dark' ? '10px 0 30px rgba(0,0,0,0.5)' : '10px 0 30px rgba(0,0,0,0.02)',
                }}
            >
                <div className="flex flex-col h-full py-6">
                    <div className="px-6 mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-tr from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <CoffeeOutlined className="text-white text-xl" />
                        </div>
                        {!collapsed && (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                                <Title level={5} className="!m-0 !font-outfit !font-black !tracking-tight dark:text-white">
                                    MEAL <span className="text-teal-600 dark:text-teal-400">MASTER</span>
                                </Title>
                                <Text className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 block -mt-1">Management Pro</Text>
                            </div>
                        )}
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[pathname]}
                        onClick={({ key }) => router.push(key)}
                        items={menuItems}
                        className="border-none flex-grow !bg-transparent px-2 custom-menu"
                    />

                    {!collapsed && (
                        <div className="px-4 mt-auto">
                            <div className={`p-4 rounded-2xl border transition-all duration-300 ${mode === 'dark' ? 'bg-white border-slate-200' : 'bg-white border-slate-100'
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <Text className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">System Status</Text>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <Text className="text-[10px] font-black text-emerald-500">LIVE</Text>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar size="small" icon={<UserOutlined />} className="border-2 border-indigo-500/20" />
                                    <div className="flex flex-col overflow-hidden">
                                        <Text strong ellipsis className="text-xs leading-none text-slate-800">{user?.name}</Text>
                                        <Text ellipsis className="text-[10px] text-teal-600 font-bold">{user?.role}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Sider>

            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <CoffeeOutlined className="text-white text-sm" />
                        </div>
                        <Text strong className="font-outfit">Meal Master</Text>
                    </div>
                }
                placement="left"
                onClose={() => setMobileVisible(false)}
                open={mobileVisible}
                styles={{ body: { padding: '12px 0' } }}
                width={280}
                className="lg:hidden"
                closeIcon={<CloseOutlined />}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    onClick={({ key }) => {
                        router.push(key);
                        setMobileVisible(false);
                    }}
                    items={menuItems}
                    className="border-none px-2"
                />
            </Drawer>

            <Layout
                className={`site-layout transition-all duration-300 min-h-screen ${!collapsed ? "lg:ml-[0px]" : "lg:ml-[0px]"
                    } ${mode === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
            >
                <Header className={`sticky top-0 z-40 px-4 sm:px-8 flex justify-between items-center h-20 transition-all duration-300 ${mode === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'
                    } backdrop-blur-md border-b ${mode === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => {
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                    setMobileVisible(true);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            }}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${mode === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                                }`}
                        />

                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Theme Toggle */}
                        <div className={`flex items-center p-1 rounded-full border transition-all duration-500 ${mode === 'dark' ? 'bg-white border-slate-200' : 'bg-white border-slate-200'
                            }`}>
                            <Button
                                type={mode === 'light' ? 'primary' : 'text'}
                                shape="circle"
                                size="small"
                                icon={<SunOutlined style={{ fontSize: '12px' }} />}
                                onClick={() => mode === 'dark' && dispatch(toggleThemeMode())}
                                className={`transition-all duration-500 ${mode === 'light' ? 'shadow-md' : 'text-slate-400'}`}
                            />
                            <Button
                                type={mode === 'dark' ? 'primary' : 'text'}
                                shape="circle"
                                size="small"
                                icon={<MoonOutlined style={{ fontSize: '12px' }} />}
                                onClick={() => mode === 'light' && dispatch(toggleThemeMode())}
                                className={`transition-all duration-500 ${mode === 'dark' ? 'shadow-md' : 'text-slate-400'}`}
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                        <Dropdown
                            menu={{
                                items: [
                                    { key: "change-password", label: "Change Password", icon: <LockOutlined />, onClick: () => setIsPassModalVisible(true) },
                                    { type: 'divider' },
                                    { key: "logout", label: "Logout", icon: <LogoutOutlined />, onClick: handleLogout, danger: true },
                                ],
                            }}
                            placement="bottomRight"
                            arrow
                        >
                            <div className={`flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl cursor-pointer transition-all duration-300 border ${mode === 'dark' ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-white border-slate-100 hover:shadow-sm'
                                }`}>
                                <Text strong className="hidden lg:inline text-xs text-slate-800">{user?.name}</Text>
                                <Avatar
                                    icon={<UserOutlined />}
                                    className="bg-teal-600 shadow-lg shadow-teal-500/20"
                                />
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="p-4 sm:p-6 lg:p-8 relative">
                    <div className={`min-h-[calc(100vh-8rem)] p-4 sm:p-6 lg:p-8 rounded-3xl transition-all duration-500 border ${mode === 'dark'
                        ? 'bg-white border-slate-200 shadow-2xl'
                        : 'bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]'
                        }`}>
                        {children}
                    </div>
                </Content>
            </Layout>

            <Modal
                title={<Title level={4} className="!m-0">Change Password</Title>}
                open={isPassModalVisible}
                onCancel={() => setIsPassModalVisible(false)}
                onOk={() => passForm.submit()}
                okText="Update Password"
                centered
                className="custom-modal"
            >
                <Form form={passForm} layout="vertical" onFinish={handleChangePassword} className="mt-4">
                    <Form.Item name="oldPassword" label="Current Password" rules={[{ required: true }]}>
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Repeat New Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout >
    );
}
