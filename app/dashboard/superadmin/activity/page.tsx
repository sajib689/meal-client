"use client";

import React from "react";
import { Table, Card, Typography, Tag } from "antd";
import { useGetGlobalActivityQuery } from "@/store/api/activityApiSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const CodeBadge = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{children}</span>
);

export default function GlobalActivityPage() {
    const { data: response, isLoading } = useGetGlobalActivityQuery({});
    const activities = response?.data || [];

    const columns = [
        {
            title: "Time",
            key: "createdAt",
            render: (_: any, record: any) => (
                <Text type="secondary" className="text-xs">
                    {dayjs(record.createdAt).format("MMM DD, YYYY hh:mm A")}
                </Text>
            )
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (action: string) => {
                let color = "blue";
                if (["CREATE", "LOGIN", "APPROVE"].includes(action)) color = "green";
                if (["DELETE", "REMOVE", "BLOCK"].includes(action)) color = "red";
                if (["UPDATE", "EDIT", "MODIFY"].includes(action)) color = "orange";
                return <Tag color={color}>{action}</Tag>;
            }
        },
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            render: (mod: string) => <span className="font-semibold text-slate-700">{mod}</span>
        },
        {
            title: "User",
            key: "userId",
            render: (_: any, record: any) => record.userId?.name || "System"
        },
        {
            title: "Tenant/Mess",
            key: "messId",
            render: (_: any, record: any) => record.messId?.name || "Global"
        },
        {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (details: string) => <span className="text-slate-500 text-sm truncate max-w-[200px] block">{details}</span>
        },
        {
            title: "IP Address",
            dataIndex: "ipAddress",
            key: "ipAddress",
            render: (ip: string) => <CodeBadge>{ip || "N/A"}</CodeBadge>
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6">
                <Title level={4} className="!m-0 text-slate-800">System Activity Logs</Title>
                <p className="text-slate-500 m-0">Detailed audit trail of all actions performed across the entire SaaS platform.</p>
            </div>

            <Table
                dataSource={activities}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 15 }}
                size="middle"
            />
        </Card>
    );
}
