"use client";

import React from "react";
import { Table, Card, Typography, Tag, Avatar } from "antd";
import { useGetUsersQuery } from "@/store/api/authApiSlice";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

export default function GlobalUsersPage() {
    // Note: If you have thousands of users, server-side pagination is recommended.
    const { data: response, isLoading } = useGetUsersQuery({});
    const users = response?.data || [];

    const columns = [
        {
            title: "User",
            key: "user",
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar src={record.profileImage} icon={!record.profileImage && <UserOutlined />} />
                    <div>
                        <div className="font-semibold text-slate-800">{record.name}</div>
                        <div className="text-xs text-slate-500">{record.email}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                let color = "default";
                if (role === "superadmin") color = "purple";
                if (role === "admin") color = "blue";
                if (role === "member") color = "green";
                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            }
        },
        {
            title: "Mess/Tenant",
            key: "messId",
            render: (_: any, record: any) => record.messId?.name || <span className="text-slate-400 italic">None</span>
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <Tag color={isActive ? "success" : "error"}>{isActive ? "ACTIVE" : "DISABLED"}</Tag>
            )
        },
        {
            title: "Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => dayjs(date).format("MMM DD, YYYY")
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6">
                <Title level={4} className="!m-0 text-slate-800">All Registered Users</Title>
                <p className="text-slate-500 m-0">View every single user across all tenants in the system.</p>
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}
