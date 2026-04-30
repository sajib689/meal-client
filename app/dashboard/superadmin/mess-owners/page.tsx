"use client";

import React, { useMemo, useState } from "react";
import { Table, Card, Typography, Tag, Avatar, Space, Button, Modal, Form, Input, App as AntdApp } from "antd";
import { useGetUsersQuery, useCreateAdminMessMutation } from "@/store/api/authApiSlice";
import { UserOutlined, EditOutlined, LockOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

export default function MessOwnersPage() {
    const { data: response, isLoading } = useGetUsersQuery({});
    const [createAdminMess, { isLoading: isCreating }] = useCreateAdminMessMutation();
    const { notification } = AntdApp.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async (values: any) => {
        try {
            await createAdminMess(values).unwrap();
            notification.success({ message: "Admin and Mess created successfully!" });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            notification.error({ message: error.data?.message || "Failed to create Admin and Mess" });
        }
    };

    // Filter only users who are "admin" (Mess Owners / Tenants)
    const owners = useMemo(() => {
        return (response?.data || []).filter((user: any) => user.role === "admin");
    }, [response]);

    const columns = [
        {
            title: "Owner Details",
            key: "user",
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar src={record.profileImage} icon={!record.profileImage && <UserOutlined />} className="bg-indigo-100 text-indigo-600" />
                    <div>
                        <div className="font-semibold text-slate-800">{record.name}</div>
                        <div className="text-xs text-slate-500">{record.email} • {record.phone || "No Phone"}</div>
                    </div>
                </div>
            )
        },
        {
            title: "Mess Name",
            key: "messId",
            render: (_: any, record: any) => (
                <div className="font-semibold text-indigo-700">
                    {record.messId?.name || <span className="text-slate-400 italic border border-dashed px-2 py-0.5 rounded border-slate-300">Unassigned</span>}
                </div>
            )
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isActive ? "ACTIVE" : "BLOCKED"}
                </span>
            )
        },
        {
            title: "Registration Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => dayjs(date).format("MMM DD, YYYY")
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="default" size="small" icon={<EditOutlined />}>Edit</Button>
                    <Button type="default" danger size="small" icon={<StopOutlined />}>{record.isActive ? "Block" : "Unblock"}</Button>
                    <Button type="primary" danger ghost size="small" icon={<LockOutlined />}>Reset Pass</Button>
                </Space>
            )
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={4} className="!m-0 text-slate-800">Tenant / Mess Owners</Title>
                    <p className="text-slate-500 m-0">Manage all registered mess administrators on the platform.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalVisible(true)}
                    className="h-10 !rounded-xl font-bold"
                >
                    Add Mess Owner
                </Button>
            </div>

            <Table
                dataSource={owners}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Create New Mess Owner"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={isCreating}
                okText="Create Owner & Mess"
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input placeholder="John Doe" />
                    </Form.Item>
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, type: "email" }]}>
                        <Input placeholder="admin@example.com" />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                        <Input placeholder="+8801700000000" />
                    </Form.Item>
                    <Form.Item name="password" label="Initial Password" rules={[{ required: true, min: 6 }]}>
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item name="messName" label="Mess/Hostel Name" rules={[{ required: true }]}>
                        <Input placeholder="Green Valley Boys Hostel" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
