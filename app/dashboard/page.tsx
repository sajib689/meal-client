"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, Divider, List, Tag, DatePicker, Table } from "antd";
import dayjs from "dayjs";

import {
    UserOutlined,
    CoffeeOutlined,
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    NotificationOutlined,
    HistoryOutlined,
    CalendarOutlined,
    ShoppingOutlined,
    LineChartOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { Button } from "antd";
import { useGetStatsQuery } from "@/store/api/reportApiSlice";
import { useGetNoticesQuery } from "@/store/api/noticeApiSlice";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const NEXT_PUBLIC_API_URL = "https://server-seven-orpin.vercel.app"
const API_URL = NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Dashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { mode } = useSelector((state: RootState) => state.theme);
    const router = useRouter();
    const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);

    const { data: stats, isLoading: statsLoading } = useGetStatsQuery(
        dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : undefined,
        {
            pollingInterval: 30000, // Refresh every 30s
        }
    );
    const { data: initialNotices, isLoading: noticesLoading } = useGetNoticesQuery(undefined);
    const [notices, setNotices] = useState<any[]>([]);

    const { token } = useSelector((state: RootState) => state.auth);
    const [liveUsersCount, setLiveUsersCount] = useState(0);

    useEffect(() => {
        if (initialNotices) {
            setNotices(initialNotices);
        }
    }, [initialNotices]);

    useEffect(() => {
        const socket = io(API_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socket.on("newNotice", (notice) => {
            setNotices(prev => [notice, ...prev]);
        });

        socket.on("live-activity", (data) => {
            setLiveUsersCount(data.onlineCount);
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dateStrings);
        } else {
            setDateRange(undefined);
        }
    };

    const isAdmin = user?.role === "admin" || user?.role === "superadmin";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="m-0 font-outfit font-black text-3xl md:text-4xl tracking-tight text-slate-900 dark:text-white">
                        Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">{user?.name.split(' ')[0]}</span>. ✨
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium italic">Here's what's happening in your mess today.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className={`p-1 rounded-2xl flex items-center gap-2 px-3 py-2 transition-all w-full md:w-auto border ${
                        mode === 'dark' ? 'bg-white border-slate-200' : 'bg-white border-slate-200'
                    }`}>
                        <CalendarOutlined className="text-indigo-500" />
                        <RangePicker
                            onChange={handleRangeChange}
                            bordered={false}
                            className="flex-grow md:w-64"
                            placeholder={["Start Date", "End Date"]}
                        />
                    </div>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {[
                    { title: "Total Members", value: stats?.totalMembers || 0, icon: <UserOutlined />, color: "teal" },
                    { title: "Total Meals", value: stats?.totalMeals || 0, icon: <CoffeeOutlined />, color: "rose", sub: `My Share: ${stats?.myMeals || 0}` },
                    ...(isAdmin ? [{ title: "Bazar Total", value: stats?.totalBazarCost || 0, icon: <ShoppingOutlined />, color: "amber", isPrice: true }] : []),
                    { title: "Meal Rate", value: stats?.mealRate || 0, icon: <LineChartOutlined />, color: "emerald", isPrice: true, precision: 2 },
                    { title: "Month Spend", value: (stats?.myMeals || 0) * (stats?.mealRate || 0), icon: <DollarOutlined />, color: "purple", isPrice: true },
                    { title: "Balance", value: stats?.myBalance ?? user?.balance ?? 0, icon: <HistoryOutlined />, color: "primary", isPrice: true, isMain: true }
                ].map((item: any, i) => (
                    <Col xs={12} sm={8} lg={4} key={i}>
                        <Card 
                            bordered={false} 
                            className={`p-4 rounded-2xl h-full transition-all duration-300 hover:shadow-lg border ${
                                item.isMain 
                                    ? 'bg-gradient-to-br from-teal-600 to-teal-800 border-teal-500 shadow-teal-200/50' 
                                    : 'bg-white border-slate-200 shadow-sm'
                            }`}
                        >
                            <div className="flex flex-col gap-1">
                                <div className={`flex items-center justify-between`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.isMain ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{item.title}</span>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.isMain ? 'bg-white/20 text-white' : `bg-${item.color}-500/10 text-${item.color}-500`}`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className={`text-xl md:text-2xl font-black ${item.isMain ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                                        {item.isPrice && <span className="text-xs font-normal opacity-70 mr-0.5">৳</span>}
                                        {item.value.toLocaleString(undefined, { minimumFractionDigits: item.precision || 0 })}
                                    </div>
                                    {item.sub && <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{item.sub}</span>}
                                    {item.isMain && (
                                        <div className="mt-2">
                                            <Tag bordered={false} className={`rounded-full px-2 text-[10px] font-black uppercase ${item.value >= 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                                                {item.value >= 0 ? 'Credit' : 'Debit'}
                                            </Tag>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card
                title={<div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-indigo-600 rounded-full" /><span className="font-outfit text-lg font-bold">Daily Statistics Breakdown</span></div>}
                className={`border border-slate-200 shadow-2xl transition-all duration-300 bg-white`}
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    dataSource={stats?.dailyBreakdown || []}
                    pagination={{ pageSize: 7, showSizeChanger: false, className: "px-6" }}
                    rowKey="date"
                    size="large"
                    className="dashboard-table"
                    columns={[
                        {
                            title: 'Date',
                            dataIndex: 'date',
                            key: 'date',
                            render: (date) => <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-white">{dayjs(date).format('DD MMM')}</span>
                                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{dayjs(date).format('dddd')}</span>
                            </div>
                        },
                        {
                            title: 'Bazar Expenses',
                            dataIndex: 'bazar',
                            key: 'bazar',
                            render: (val) => <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${val > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>৳</div>
                                <span className={val > 0 ? "font-bold text-slate-700 dark:text-slate-200" : "text-slate-400"}>{val > 0 ? val : '-'}</span>
                            </div>
                        },
                        {
                            title: 'Total Meals',
                            dataIndex: 'totalMeals',
                            key: 'totalMeals',
                            render: (val) => <Tag bordered={false} className="rounded-lg px-3 py-1 font-black bg-blue-500/10 text-blue-500">{val} Meals</Tag>
                        },
                        {
                            title: 'Daily Meal Rate',
                            key: 'rate',
                            render: (_, record) => <span className="font-medium text-slate-500">৳{(stats?.mealRate || 0).toFixed(2)}</span>
                        },
                        {
                            title: 'My Daily Cost',
                            dataIndex: 'spend',
                            key: 'spend',
                            render: (val) => <span className="text-teal-600 dark:text-teal-400 font-extrabold text-lg">৳{val.toFixed(2)}</span>
                        },
                    ]}
                />
            </Card>

            <Row gutter={[24, 24]}>
                {user?.role === "superadmin" && (
                    <Col xs={24}>
                        <Card
                            title={<span className="font-outfit text-lg font-bold">System Activity Ledger</span>}
                            extra={<HistoryOutlined className="text-indigo-500" />}
                            className="cool-card border-none shadow-xl shadow-slate-200/50"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    { type: 'MEAL', user: 'Admin', action: 'Log All Meals', time: '2 mins ago' },
                                    { type: 'BAZAR', user: 'Sajib', action: 'Requested Approval', time: '15 mins ago' },
                                    { type: 'DEPOSIT', user: 'Admin', action: 'Verified Payment', time: '1 hour ago' },
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'MEAL' ? 'bg-amber-100 text-amber-600' : item.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}><Text strong className="text-[10px]">{item.type}</Text></div>}
                                            title={<Text strong>{item.action}</Text>}
                                            description={<Text type="secondary" className="text-xs">Identified by <span className="font-bold text-slate-700">{item.user}</span> • {item.time}</Text>}
                                        />
                                        <Tag bordered={false} color="default" className="text-[10px] font-bold">MONITORING</Tag>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                )}
                <Col xs={24} lg={16}>
                    <Card
                        title={<div className="flex items-center gap-2 text-teal-600"><NotificationOutlined /> <span className="font-outfit text-lg font-bold text-slate-900">Recent Notices</span></div>}
                        className={`border border-slate-200 shadow-2xl transition-all duration-300 bg-white`}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={notices}
                            renderItem={(item: any) => (
                                <List.Item className="px-0 border-b border-slate-100 dark:border-slate-800 last:border-none group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors rounded-xl px-4!">
                                    <List.Item.Meta
                                        title={<span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">{item.title}</span>}
                                        description={
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                                                    {dayjs(item.createdAt).format('DD MMMM, YYYY')}
                                                </span>
                                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{item.content}</p>
                                            </div>
                                        }
                                    />
                                    <Tag color="teal" bordered={false} className="rounded-full px-3 text-[10px] font-black uppercase">Official</Tag>
                                </List.Item>
                            )}
                            locale={{ emptyText: <div className="py-12 text-center text-slate-400 font-medium italic">No recent announcements found.</div> }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card 
                        title={<div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-white rounded-full" /><span className="font-outfit text-lg font-bold">Quick Actions</span></div>}
                        className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex flex-col gap-4 relative z-10">
                            {isAdmin && (
                                <>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        block 
                                        onClick={() => router.push("/dashboard/users")} 
                                        className="h-14 !rounded-2xl font-black bg-teal-600 border-none shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        MANAGE MEMBERS
                                    </Button>
                                    <Button 
                                        size="large" 
                                        block 
                                        onClick={() => router.push("/dashboard/notices")} 
                                        className="h-14 !rounded-2xl bg-white/10 border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                                    >
                                        POST ANNOUNCEMENT
                                    </Button>
                                </>
                            )}
                            <Button 
                                type="primary" 
                                ghost 
                                size="large" 
                                block 
                                onClick={() => router.push("/dashboard/meals")} 
                                className="h-14 !rounded-2xl !border-teal-400/30 font-bold text-white! hover:!bg-teal-500/10 transition-all font-outfit"
                            >
                                LOG MEALS
                            </Button>
                            <Button 
                                size="large" 
                                block 
                                onClick={() => router.push("/dashboard/bazar")} 
                                className="h-14 !rounded-2xl bg-slate-800 border-none text-slate-300 hover:text-white hover:bg-slate-700 font-bold transition-all"
                            >
                                RECORD BAZAR
                            </Button>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 text-center opacity-40">
                            <span className="text-[10px] font-black tracking-widest uppercase">Meal Master v2.0 Pro</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
