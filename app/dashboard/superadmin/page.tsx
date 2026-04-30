"use client";

import React from "react";
import { Card, Row, Col, Typography, Table, Avatar } from "antd";
import {
    TeamOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { useGetSuperAdminStatsQuery } from "@/store/api/reportApiSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const StatCard = ({
    title,
    value,
    icon,
    from,
    to,
    suffix = "",
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    from: string;
    to: string;
    suffix?: string;
}) => (
    <div
        className="rounded-2xl p-6 text-white shadow-lg flex flex-col gap-3"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
        <div className="text-white/70 font-semibold text-sm uppercase tracking-wider">{title}</div>
        <div className="flex items-center gap-3">
            <div className="text-3xl opacity-80">{icon}</div>
            <div className="text-4xl font-black">
                {value.toLocaleString()}
                {suffix && <span className="text-2xl ml-1">{suffix}</span>}
            </div>
        </div>
    </div>
);

export default function SuperAdminDashboard() {
    const { data: response, isLoading } = useGetSuperAdminStatsQuery({});
    const stats = response?.stats || { totalMessOwners: 0, totalMembers: 0, activeSubscriptions: 0, totalRevenue: 0 };
    const recentPayments = response?.recentPayments || [];
    const recentRegistrations = response?.recentRegistrations || [];

    const paymentColumns = [
        { title: "Mess", key: "mess", render: (_: any, record: any) => record.messId?.name || "Unknown" },
        { title: "Amount", dataIndex: "amount", key: "amount", render: (val: number) => `৳${val}` },
        { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (date: string) => dayjs(date).format("DD MMM") }
    ];

    const userColumns = [
        {
            title: "Name",
            key: "name",
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Avatar size="small" src={record.profileImage} icon={<UserOutlined />} />
                    <span>{record.name}</span>
                </div>
            )
        },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Joined", dataIndex: "createdAt", key: "createdAt", render: (date: string) => dayjs(date).format("DD MMM YYYY") }
    ];

    return (
        <div className="space-y-6">
            <div>
                <Title level={3} className="!m-0 text-slate-800">System Overview</Title>
                <Text type="secondary">Global platform analytics and recent platform activities.</Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard title="Total Mess Owners" value={stats.totalMessOwners} icon={<TeamOutlined />} from="#6366f1" to="#4338ca" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard title="Total Members" value={stats.totalMembers} icon={<UserOutlined />} from="#3b82f6" to="#06b6d4" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={<SafetyCertificateOutlined />} from="#10b981" to="#14b8a6" />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard title="Total Revenue" value={stats.totalRevenue} icon={<DollarOutlined />} from="#f59e0b" to="#f97316" suffix="৳" />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Recent Revenue" className="cool-card">
                        <Table
                            dataSource={recentPayments}
                            columns={paymentColumns}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            loading={isLoading}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Recent Mess Registrations" className="cool-card">
                        <Table
                            dataSource={recentRegistrations}
                            columns={userColumns}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            loading={isLoading}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
