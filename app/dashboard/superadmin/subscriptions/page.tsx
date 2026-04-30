"use client";

import React from "react";
import { Table, Card, Typography, Tag } from "antd";
import { useGetAllSubscriptionsQuery } from "@/store/api/subscriptionApiSlice";
import dayjs from "dayjs";

const { Title } = Typography;

export default function SubscriptionsPage() {
    const { data: response, isLoading } = useGetAllSubscriptionsQuery({});
    const subscriptions = response?.data || [];

    const columns = [
        {
            title: "Tenant/Mess",
            key: "messId",
            render: (_: any, record: any) => <strong>{record.messId?.name || "Unknown Mess"}</strong>
        },
        {
            title: "Package",
            key: "packageId",
            render: (_: any, record: any) => record.packageId?.name || "Unknown Package"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "active") color = "green";
                if (status === "expired") color = "red";
                if (status === "cancelled") color = "volcano";
                if (status === "pending") color = "orange";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: string) => dayjs(date).format("DD MMM YYYY")
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (date: string) => dayjs(date).format("DD MMM YYYY")
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6">
                <Title level={4} className="!m-0 text-slate-800">All Subscriptions</Title>
                <p className="text-slate-500 m-0">View all active and historical subscriptions across all messes.</p>
            </div>

            <Table
                dataSource={subscriptions}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}
