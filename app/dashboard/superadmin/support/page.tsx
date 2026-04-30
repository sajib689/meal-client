"use client";

import React, { useState } from "react";
import { Table, Card, Typography, Tag, Space, Button, Modal, Form, Input, Select, App as AntdApp } from "antd";
import { useGetTicketsQuery, useUpdateTicketMutation, useDeleteTicketMutation, useAddReplyMutation } from "@/store/api/supportApiSlice";
import dayjs from "dayjs";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SupportPage() {
    const { data: response, isLoading } = useGetTicketsQuery({});
    const [updateTicket] = useUpdateTicketMutation();
    const [deleteTicket] = useDeleteTicketMutation();
    const [addReply] = useAddReplyMutation();
    const { notification: antNotification } = AntdApp.useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [replyForm] = Form.useForm();

    const tickets = response?.data || [];

    const handleView = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this ticket?",
            onOk: async () => {
                try {
                    await deleteTicket(id).unwrap();
                    antNotification.success({ message: "Ticket deleted successfully" });
                    if (selectedTicket?._id === id) setIsModalVisible(false);
                } catch (error: any) {
                    antNotification.error({ message: error?.data?.message || "Failed to delete" });
                }
            }
        });
    };

    const handleStatusChange = async (status: string) => {
        try {
            await updateTicket({ id: selectedTicket._id, data: { status } }).unwrap();
            antNotification.success({ message: "Ticket status updated!" });
            setSelectedTicket({ ...selectedTicket, status });
        } catch (error: any) {
            antNotification.error({ message: error?.data?.message || "Failed to update status" });
        }
    };

    const handleReply = async (values: any) => {
        try {
            await addReply({ id: selectedTicket._id, data: values }).unwrap();
            antNotification.success({ message: "Reply added!" });
            replyForm.resetFields();
            setIsModalVisible(false);
        } catch (error: any) {
            antNotification.error({ message: error?.data?.message || "Failed to add reply" });
        }
    };

    const columns = [
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            render: (text: string) => <strong>{text}</strong>
        },
        {
            title: "Mess/Tenant",
            key: "messId",
            render: (_: any, record: any) => record.messId?.name || "Unknown Mess"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                if (status === "open") color = "red";
                if (status === "in_progress") color = "orange";
                if (status === "resolved") color = "green";
                if (status === "closed") color = "default";
                return <Tag color={color}>{status.replace("_", " ").toUpperCase()}</Tag>;
            }
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            render: (p: string) => <Tag color={p === "high" ? "red" : p === "medium" ? "orange" : "blue"}>{p.toUpperCase()}</Tag>
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>View</Button>
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <Card className="cool-card">
            <div className="mb-6">
                <Title level={4} className="!m-0 text-slate-800">Support Tickets</Title>
                <p className="text-slate-500 m-0">Manage and respond to tenant support requests.</p>
            </div>

            <Table
                dataSource={tickets}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Ticket: ${selectedTicket?.subject}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedTicket && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <Text strong className="text-slate-700">From: {selectedTicket.userId?.name} ({selectedTicket.messId?.name})</Text>
                                <Text type="secondary" className="text-xs">{dayjs(selectedTicket.createdAt).format("DD MMM YYYY hh:mm A")}</Text>
                            </div>
                            <p className="text-slate-600 m-0 whitespace-pre-wrap">{selectedTicket.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Text strong>Update Status:</Text>
                            <Select
                                value={selectedTicket.status}
                                onChange={handleStatusChange}
                                style={{ width: 150 }}
                                options={[
                                    { value: 'open', label: 'Open' },
                                    { value: 'in_progress', label: 'In Progress' },
                                    { value: 'resolved', label: 'Resolved' },
                                    { value: 'closed', label: 'Closed' }
                                ]}
                            />
                        </div>

                        {selectedTicket.replies?.length > 0 && (
                            <div>
                                <Title level={5}>Replies</Title>
                                <div className="space-y-3">
                                    {selectedTicket.replies.map((reply: any, idx: number) => (
                                        <div key={idx} className={`p-3 rounded-xl ${reply.isStaffReply ? 'bg-indigo-50 border border-indigo-100 ml-8' : 'bg-slate-50 border border-slate-100 mr-8'}`}>
                                            <div className="text-xs text-slate-500 mb-1">
                                                {reply.user?.name || "Staff"} • {dayjs(reply.createdAt).format("DD MMM YYYY hh:mm A")}
                                            </div>
                                            <div className="text-slate-800">{reply.message}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <Title level={5}>Add a Reply</Title>
                            <Form form={replyForm} layout="vertical" onFinish={handleReply}>
                                <Form.Item name="message" rules={[{ required: true, message: 'Message cannot be empty' }]}>
                                    <Input.TextArea rows={3} placeholder="Type your response here..." />
                                </Form.Item>
                                <Form.Item className="mb-0 text-right">
                                    <Button type="primary" htmlType="submit">Send Reply</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
}
