"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Typography, DatePicker, InputNumber, App as AntdApp, Modal, Form, Input, Tag, Popconfirm, Select, Tabs } from "antd";
import { ShoppingOutlined, PlusOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, FilePdfOutlined, CalculatorOutlined, TeamOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

import {
    useGetBazarsQuery,
    useAddBazarMutation,
    useApproveBazarMutation,
    useDeleteBazarMutation
} from "@/store/api/bazarApiSlice";
import { useGetUsersQuery } from "@/store/api/authApiSlice";
import { useGetStatsQuery } from "@/store/api/reportApiSlice";

const BazarPage = () => {
    const { notification: antNotification } = AntdApp.useApp();
    const { user } = useSelector((state: RootState) => state.auth);
    const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);
    const { data: bazars, isLoading: loading } = useGetBazarsQuery(
        dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : undefined
    );
    const { data: stats, isLoading: statsLoading } = useGetStatsQuery(
        dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : undefined
    );
    const { data: allUsers } = useGetUsersQuery(undefined, { skip: user?.role !== "admin" && user?.role !== "superadmin" });
    const [addBazar] = useAddBazarMutation();
    const [approveBazar] = useApproveBazarMutation();
    const [deleteBazar] = useDeleteBazarMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            setDateRange([dateStrings[0], dateStrings[1]]);
        } else {
            setDateRange(undefined);
        }
    };

    const handleAddBazar = async (values: any) => {
        try {
            await addBazar({
                ...values,
                items: values.items.split(",").map((s: string) => s.trim()),
                date: values.date.format("YYYY-MM-DD"),
                userId: values.userId || user?.id,
            }).unwrap();
            antNotification.success({ message: "Bazar entry submitted successfully" });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to add bazar" });
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveBazar(id).unwrap();
            antNotification.success({ message: "Bazar entry approved" });
        } catch (error: any) {
            antNotification.error({ message: "Approval failed" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBazar(id).unwrap();
            antNotification.success({ message: "Bazar entry deleted" });
        } catch (error: any) {
            antNotification.error({ message: "Deletion failed" });
        }
    };

    const downloadBazarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Bazar Entry List", 14, 18);
        doc.setFontSize(10);
        doc.text(`Generated: ${dayjs().format("MMM DD, YYYY HH:mm")}`, 14, 26);

        const rows = (bazars || []).map((b: any, i: number) => [
            i + 1,
            dayjs(b.date).format("MMM DD, YYYY"),
            b.userId?.name || "—",
            (b.items || []).join(", "),
            `৳${b.totalCost.toFixed(2)}`,
            b.isApproved ? "Approved" : "Pending",
        ]);

        const totalCost = (bazars || []).reduce((s: number, b: any) => s + (b.totalCost || 0), 0);
        const approvedCost = (bazars || []).filter((b: any) => b.isApproved).reduce((s: number, b: any) => s + (b.totalCost || 0), 0);

        autoTable(doc, {
            startY: 32,
            head: [["#", "Date", "Member", "Items", "Cost", "Status"]],
            body: rows,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [79, 70, 229] },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 8;
        doc.setFontSize(10);
        doc.text(`Total Cost: ৳${totalCost.toFixed(2)}`, 14, finalY);
        doc.text(`Approved Cost: ৳${approvedCost.toFixed(2)}`, 14, finalY + 7);

        doc.save(`bazar-list-${dayjs().format("YYYY-MM-DD")}.pdf`);
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => dayjs(date).format("MMM DD, YYYY")
        },
        { title: "Member", dataIndex: ["userId", "name"], key: "member" },
        {
            title: "Items",
            dataIndex: "items",
            key: "items",
            render: (items: string[]) => items.join(", ")
        },
        {
            title: "Cost",
            dataIndex: "totalCost",
            key: "cost",
            render: (cost: number) => <Text strong>৳{cost.toFixed(2)}</Text>
        },
        {
            title: "Status",
            dataIndex: "isApproved",
            key: "status",
            render: (approved: boolean) => (
                approved ? <Tag color="success" icon={<CheckCircleOutlined />}>APPROVED</Tag> : <Tag color="warning" icon={<ClockCircleOutlined />}>PENDING</Tag>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="middle">
                    {(user?.role === "admin" || user?.role === "superadmin") && !record.isApproved && (
                        <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record._id)}>Approve</Button>
                    )}
                    <Popconfirm title="Delete this entry?" onConfirm={() => handleDelete(record._id)}>
                        <Button danger size="small" icon={<DeleteOutlined />} disabled={user?.role !== "admin" && user?.role !== "superadmin" && user?.id !== record.userId?._id} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <Text className="text-slate-500 font-medium uppercase tracking-wider text-xs">Finances</Text>
                    <Title level={2} className="m-0 font-outfit font-bold text-slate-800">Bazar History</Title>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <div className="bg-white/50 border border-slate-200 p-1 rounded-xl glass flex items-center gap-2 px-3 py-1.5 transition-all hover:bg-white/80">
                        <DatePicker.RangePicker
                            onChange={handleRangeChange}
                            format="YYYY-MM-DD"
                            bordered={false}
                            className="w-64"
                            placeholder={["Start Date", "End Date"]}
                        />
                    </div>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <Button icon={<FilePdfOutlined />} onClick={downloadBazarPDF} className="h-12 !rounded-xl border-red-400 text-red-500 hover:!bg-red-50 font-bold">
                            Download PDF
                        </Button>
                    )}
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="h-12 !rounded-xl font-bold shadow-lg shadow-indigo-500/20 bg-indigo-600">
                        Add Bazar Entry
                    </Button>
                </div>
            </div>

            <Card className="cool-card border-none shadow-xl shadow-slate-200/50">
                <Tabs defaultActiveKey="history">
                    <Tabs.TabPane tab={<span><ShoppingOutlined /> Bazar History</span>} key="history">
                        <Table columns={columns} dataSource={bazars} rowKey="_id" loading={loading} scroll={{ x: 700 }} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><CalculatorOutlined /> Daily Analysis</span>} key="daily">
                        <div className="pt-4">
                            <Table
                                dataSource={stats?.dailyBreakdown || []}
                                loading={statsLoading}
                                rowKey="date"
                                pagination={{ pageSize: 10 }}
                                className="premium-table"
                                columns={[
                                    {
                                        title: 'Date',
                                        dataIndex: 'date',
                                        key: 'date',
                                        render: (date) => <Text strong className="text-slate-600">{dayjs(date).format("MMM DD, YYYY")}</Text>
                                    },
                                    {
                                        title: 'Total Bazar',
                                        dataIndex: 'bazar',
                                        key: 'bazar',
                                        render: (val) => <Text className={val > 0 ? "text-amber-600 font-bold" : "text-slate-400"}>৳{val}</Text>
                                    },
                                    {
                                        title: 'Mess Meals',
                                        dataIndex: 'totalMeals',
                                        key: 'totalMeals',
                                        render: (val) => <Tag bordered={false} color="blue">{val}</Tag>
                                    },
                                    {
                                        title: 'Meal Rate',
                                        key: 'rate',
                                        render: () => <Text type="secondary">৳{(stats?.mealRate || 0).toFixed(2)}</Text>
                                    },
                                    {
                                        title: 'My Daily Spend',
                                        dataIndex: 'spend',
                                        key: 'spend',
                                        render: (val) => <Text strong className="text-indigo-600">৳{val.toFixed(2)}</Text>
                                    },
                                ]}
                            />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><TeamOutlined /> Member Summary</span>} key="members">
                        <div className="pt-4">
                            <Table
                                dataSource={stats?.memberSummary || []}
                                loading={statsLoading}
                                rowKey="_id"
                                pagination={false}
                                className="premium-table"
                                columns={[
                                    {
                                        title: 'Member',
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (name) => <Text strong className="text-slate-700">{name}</Text>
                                    },
                                    {
                                        title: 'Bazar Spent',
                                        dataIndex: 'totalBazar',
                                        key: 'totalBazar',
                                        render: (val) => <Text strong className="text-amber-600">৳{val.toFixed(2)}</Text>
                                    },
                                    {
                                        title: 'Meals',
                                        dataIndex: 'totalMeals',
                                        key: 'totalMeals',
                                        render: (val) => <Tag bordered={false} color="blue" className="font-bold">{val}</Tag>
                                    },
                                    {
                                        title: 'Meal Cost',
                                        dataIndex: 'totalCost',
                                        key: 'totalCost',
                                        render: (val) => <Text type="secondary">৳{val.toFixed(2)}</Text>
                                    },
                                    {
                                        title: 'Net (B-C)',
                                        dataIndex: 'balance',
                                        key: 'balance',
                                        render: (val) => (
                                            <Tag color={val >= 0 ? "success" : "error"} className="font-bold">
                                                ৳{val.toFixed(2)}
                                            </Tag>
                                        )
                                    },
                                ]}
                            />
                        </div>
                    </Tabs.TabPane>
                </Tabs>

                <Modal
                    title="Add New Bazar Entry"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={() => form.submit()}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddBazar} initialValues={{ date: dayjs(), userId: user?.id }}>
                        {(user?.role === "admin" || user?.role === "superadmin") && (
                            <Form.Item name="userId" label="Member">
                                <Select
                                    placeholder="Select Member"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (String(option?.label) || "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={(allUsers || []).map((u: any) => ({ label: u.name, value: u._id }))}
                                />
                            </Form.Item>
                        )}
                        <Form.Item name="date" label="Bazar Date" rules={[{ required: true }]}>
                            <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item name="items" label="Items (Comma separated)" rules={[{ required: true }]}>
                            <Input placeholder="Rice, Egg, Chicken, etc." />
                        </Form.Item>
                        <Form.Item name="totalCost" label="Total Cost (৳)" rules={[{ required: true }]}>
                            <InputNumber className="w-full" min={1} />
                        </Form.Item>
                        <Form.Item name="description" label="Extra Note">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default BazarPage;
