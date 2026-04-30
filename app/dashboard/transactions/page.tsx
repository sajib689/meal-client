"use client";

import { Table, Card, Typography, Tag, Space, Button } from "antd";
import { DollarOutlined, ReloadOutlined } from "@ant-design/icons";
import { useGetAllTransactionsQuery } from "@/store/api/transactionApiSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TransactionLedger = () => {
    const { data: transactions, isLoading, refetch } = useGetAllTransactionsQuery(undefined);

    const columns = [
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "date",
            render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
        },
        {
            title: "Member",
            dataIndex: ["userId", "name"],
            key: "member",
            render: (name: string) => <Text strong>{name}</Text>
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "deposit" ? "green" : "blue"}>
                    {type.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => <Text strong className="text-green-600">৳{amount.toFixed(2)}</Text>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <Text className="text-slate-500 font-medium uppercase tracking-wider text-xs">Financial Audit</Text>
                    <Title level={2} className="m-0 font-outfit font-bold text-slate-800">System Transactions</Title>
                </div>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} className="cool-card h-12 rounded-xl">
                    Refresh
                </Button>
            </div>

            <Card className="cool-card border-none shadow-xl shadow-slate-200/50">
                <Table
                    columns={columns}
                    dataSource={transactions}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                    className="premium-table"
                />
            </Card>
        </div>
    );
};

export default TransactionLedger;
