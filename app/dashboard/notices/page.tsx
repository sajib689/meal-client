"use client";

import React, { useEffect, useState } from "react";
import { List, Button, Space, Card, Typography, App as AntdApp, Modal, Form, Input, Tag, Popconfirm, Divider } from "antd";
import { NotificationOutlined, PlusOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { io } from "socket.io-client";

import {
    useGetNoticesQuery,
    useCreateNoticeMutation,
    useDeleteNoticeMutation
} from "@/store/api/noticeApiSlice";

const { Title, Text, Paragraph } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const NoticeBoard = () => {
    const { notification: antNotification } = AntdApp.useApp();
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: initialNotices, isLoading: loading } = useGetNoticesQuery(undefined);
    const [createNotice] = useCreateNoticeMutation();
    const [deleteNotice] = useDeleteNoticeMutation();

    const [notices, setNotices] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialNotices) {
            setNotices(initialNotices);
        }
    }, [initialNotices]);

    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const socket = io(API_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        });
        socket.on("newNotice", (notice: any) => {
            setNotices(prev => [notice, ...prev] as any);
            antNotification.info({
                message: "New Notice Posted",
                description: notice.title,
                placement: "topRight"
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCreateNotice = async (values: any) => {
        try {
            await createNotice(values).unwrap();
            antNotification.success({ message: "Notice posted successfully" });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to post notice" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotice(id).unwrap();
            antNotification.success({ message: "Notice deleted" });
        } catch (error: any) {
            antNotification.error({ message: "Deletion failed" });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <Text className="text-slate-500 font-medium uppercase tracking-wider text-xs">Communication</Text>
                    <Title level={2} className="m-0 font-outfit font-bold text-slate-800">Notice Board</Title>
                </div>
                {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="h-12 !rounded-xl font-bold bg-indigo-600 shadow-lg shadow-indigo-500/20">
                        Post New Notice
                    </Button>
                )}
            </div>

            <Card className="cool-card border-none shadow-xl shadow-slate-200/50 p-2">
                <List
                    itemLayout="vertical"
                    size="large"
                    loading={loading}
                    dataSource={notices}
                    renderItem={(item: any) => (
                        <List.Item
                            key={item._id}
                            className="px-4 hover:bg-slate-50/50 transition-colors rounded-2xl"
                            extra={
                                (user?.role === "admin" || user?.role === "superadmin") && (
                                    <Popconfirm title="Delete this notice?" okText="Yes, Delete" cancelText="No" onConfirm={() => handleDelete(item._id)}>
                                        <Button danger type="text" icon={<DeleteOutlined />} className="hover:bg-rose-50 rounded-lg" />
                                    </Popconfirm>
                                )
                            }
                        >
                            <List.Item.Meta
                                avatar={
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                        <NotificationOutlined className="text-indigo-600 text-xl" />
                                    </div>
                                }
                                title={<Text strong className="text-xl text-slate-800">{item.title}</Text>}
                                description={
                                    <Space className="text-xs text-slate-400 font-medium">
                                        <CalendarOutlined />
                                        {dayjs(item.createdAt).format("MMM DD, YYYY • hh:mm A")}
                                        <Divider type="vertical" />
                                        <Tag color="blue" bordered={false} className="rounded-full px-3 text-[10px] font-bold uppercase">Admin Post</Tag>
                                    </Space>
                                }
                            />
                            <Paragraph className="mt-4 text-slate-600 text-base leading-relaxed">
                                {item.content}
                            </Paragraph>
                        </List.Item>
                    )}
                    locale={{ emptyText: <div className="py-12 text-slate-400 font-medium italic text-center">No active notices at the moment.</div> }}
                />
            </Card>

            <Modal
                title="Post New Notice"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateNotice}>
                    <Form.Item name="title" label="Notice Title" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Monthly Meeting, Bazar Update" className="rounded-xl h-12" />
                    </Form.Item>
                    <Form.Item name="content" label="Notice Content" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="Type your announcement here..." className="rounded-xl" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NoticeBoard;
