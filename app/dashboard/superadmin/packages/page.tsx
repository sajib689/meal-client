"use client";

import React, { useState } from "react";
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, App as AntdApp, Card, Row, Col, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetPackagesQuery, useCreatePackageMutation, useUpdatePackageMutation, useDeletePackageMutation } from "@/store/api/packageApiSlice";

const { Title } = Typography;

export default function PackagesPage() {
    const { data: response, isLoading } = useGetPackagesQuery({});
    const [createPackage] = useCreatePackageMutation();
    const [updatePackage] = useUpdatePackageMutation();
    const [deletePackage] = useDeletePackageMutation();
    const { notification: antNotification } = AntdApp.useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPackage, setEditingPackage] = useState<any>(null);
    const [form] = Form.useForm();

    const packages = response?.data || [];

    const handleCreateOrUpdate = async (values: any) => {
        try {
            if (editingPackage) {
                await updatePackage({ id: editingPackage._id, data: values }).unwrap();
                antNotification.success({ message: "Package updated successfully" });
            } else {
                await createPackage(values).unwrap();
                antNotification.success({ message: "Package created successfully" });
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingPackage(null);
        } catch (error: any) {
            antNotification.error({ message: error?.data?.message || "Something went wrong" });
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this package?",
            onOk: async () => {
                try {
                    await deletePackage(id).unwrap();
                    antNotification.success({ message: "Package deleted successfully" });
                } catch (error: any) {
                    antNotification.error({ message: error?.data?.message || "Failed to delete" });
                }
            }
        });
    };

    const openEditModal = (pkg: any) => {
        setEditingPackage(pkg);
        form.setFieldsValue(pkg);
        setIsModalVisible(true);
    };

    const openCreateModal = () => {
        setEditingPackage(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const columns = [
        { title: "Name", dataIndex: "name", key: "name", render: (text: string) => <strong>{text}</strong> },
        { title: "Price", dataIndex: "price", key: "price", render: (price: number) => `৳${price}` },
        { title: "Duration (Days)", dataIndex: "durationDays", key: "durationDays" },
        { title: "Max Members", dataIndex: "maxMembers", key: "maxMembers" },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isActive ? "ACTIVE" : "INACTIVE"}
                </span>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openEditModal(record)} size="small">Edit</Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} size="small">Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <Card className="cool-card">
            <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                    <Title level={4} className="!m-0 text-slate-800">SaaS Packages</Title>
                    <p className="text-slate-500 m-0">Manage pricing tiers, limits, and availability.</p>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} size="large" className="bg-indigo-600">
                        Create Package
                    </Button>
                </Col>
            </Row>

            <Table
                dataSource={packages}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingPackage ? "Edit Package" : "Create Package"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} initialValues={{ isActive: true }}>
                    <Form.Item name="name" label="Package Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Standard Plan" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Describe the plan..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="price" label="Price (৳)" rules={[{ required: true }]}>
                                <InputNumber className="w-full" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="durationDays" label="Duration (Days)" rules={[{ required: true }]}>
                                <InputNumber className="w-full" min={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="maxMembers" label="Max Members" rules={[{ required: true }]}>
                                <InputNumber className="w-full" min={1} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isActive" label="Active Status" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name={['features', 'smsNotification']} label="Features: SMS Notifications" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name={['features', 'advancedReports']} label="Features: Advanced Reports" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item className="mb-0 text-right mt-6">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-3">Cancel</Button>
                        <Button type="primary" htmlType="submit" className="bg-indigo-600">
                            {editingPackage ? "Update Package" : "Create Package"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
