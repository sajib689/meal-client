"use client";

import React from "react";
import { Table, Card, Typography, Tag } from "antd";
import { useGetAllPaymentsQuery } from "@/store/api/paymentApiSlice";
import dayjs from "dayjs";

const { Title } = Typography;

export default function PaymentsPage() {
    const { data: response, isLoading } = useGetAllPaymentsQuery({});
    const payments = response?.data || [];

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            key: "transactionId",
            render: (text: string) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{text}</span>
        },
        {
            title: "Mess/Tenant",
            key: "messId",
            render: (_: any, record: any) => <strong>{record.messId?.name || "Unknown Mess"}</strong>
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `৳${amount}`
        },
        {
            title: "Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method: string) => <span className="uppercase font-bold text-xs text-indigo-600">{method}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "success") color = "green";
                if (status === "failed") color = "red";
                if (status === "pending") color = "orange";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => dayjs(date).format("DD MMM YYYY hh:mm A")
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6">
                <Title level={4} className="!m-0 text-slate-800">Payment History</Title>
                <p className="text-slate-500 m-0">Global list of all subscription payments and transactions.</p>
            </div>

            <Table
                dataSource={payments}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}
