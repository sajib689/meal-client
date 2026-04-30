"use client";

import React, { useState } from "react";
import { Table, Card, Typography, Button, Space, Modal, Form, Input, InputNumber, Switch, App as AntdApp, Row, Col, Tag, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { useGetRoomsQuery, useCreateRoomMutation, useUpdateRoomMutation, useDeleteRoomMutation, useAddSeatInfoMutation, useRemoveSeatInfoMutation } from "@/store/api/roomApiSlice";

const { Title, Text } = Typography;

export default function RoomsManagementPage() {
    const { data: response, isLoading } = useGetRoomsQuery({});
    const [createRoom] = useCreateRoomMutation();
    const [updateRoom] = useUpdateRoomMutation();
    const [deleteRoom] = useDeleteRoomMutation();
    const [addSeat] = useAddSeatInfoMutation();
    const [removeSeat] = useRemoveSeatInfoMutation();

    const { notification } = AntdApp.useApp();

    const [isMdlVisible, setIsMdlVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const [form] = Form.useForm();

    const [isSeatMdlVisible, setIsSeatMdlVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [seatForm] = Form.useForm();

    const rooms = response?.data || [];

    const handleCreateOrUpdateRoom = async (values: any) => {
        try {
            if (editingRoom) {
                await updateRoom({ id: editingRoom._id, data: values }).unwrap();
                notification.success({ message: "Room updated successfully" });
            } else {
                await createRoom(values).unwrap();
                notification.success({ message: "Room created successfully" });
            }
            setIsMdlVisible(false);
            form.resetFields();
            setEditingRoom(null);
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to save room" });
        }
    };

    const handleDeleteRoom = (id: string) => {
        Modal.confirm({
            title: "Delete Room?",
            content: "Deleting a room will remove all associated seats.",
            onOk: async () => {
                try {
                    await deleteRoom(id).unwrap();
                    notification.success({ message: "Room deleted" });
                } catch (error: any) {
                    notification.error({ message: error?.data?.message || "Failed to delete room" });
                }
            }
        });
    };

    const handleAddSeat = async (values: any) => {
        if (!selectedRoomId) return;
        try {
            await addSeat({ roomId: selectedRoomId, data: values }).unwrap();
            notification.success({ message: "Seat added to room" });
            setIsSeatMdlVisible(false);
            seatForm.resetFields();
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to add seat" });
        }
    };

    const handleRemoveSeat = (roomId: string, seatId: string) => {
        Modal.confirm({
            title: "Remove Seat?",
            onOk: async () => {
                try {
                    await removeSeat({ roomId, seatId }).unwrap();
                    notification.success({ message: "Seat removed" });
                } catch (error: any) {
                    notification.error({ message: error?.data?.message || "Failed to remove seat" });
                }
            }
        });
    };

    const columns = [
        { title: "Room Number/Name", dataIndex: "roomNumber", key: "roomNumber", render: (text: string) => <strong className="text-indigo-600">{text}</strong> },
        { title: "Type", dataIndex: "roomType", key: "roomType" },
        { title: "Capacity", dataIndex: "capacity", key: "capacity", render: (num: number) => <Tag color="blue">{num} persons</Tag> },
        { title: "Rent (৳)", dataIndex: "rentAmount", key: "rentAmount" },
        {
            title: "Seats",
            key: "seats",
            render: (_: any, record: any) => (
                <div className="flex flex-wrap gap-2 max-w-xs">
                    {(record.seats || []).map((seat: any) => (
                        <Tooltip key={seat._id} title={seat.isOccupied ? "Occupied" : "Available"}>
                            <Tag
                                color={seat.isOccupied ? "red" : "green"}
                                closable
                                onClose={(e) => { e.preventDefault(); handleRemoveSeat(record._id, seat._id); }}
                            >
                                {seat.seatNumber}
                            </Tag>
                        </Tooltip>
                    ))}
                    <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => { setSelectedRoomId(record._id); setIsSeatMdlVisible(true); }}>Add</Button>
                </div>
            )
        },
        {
            title: "Status",
            key: "isAvailable",
            render: (_: any, record: any) => (
                <Tag color={record.isAvailable ? "success" : "default"}>{record.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}</Tag>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" size="small" ghost icon={<EditOutlined />} onClick={() => { setEditingRoom(record); form.setFieldsValue(record); setIsMdlVisible(true); }}>Edit</Button>
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteRoom(record._id)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <Card className="cool-card">
            <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                    <Title level={4} className="!m-0 text-slate-800">Room & Seat Management</Title>
                    <p className="text-slate-500 m-0">Manage rooms, capacities, and track seat allocations in your mess.</p>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingRoom(null); form.resetFields(); setIsMdlVisible(true); }} className="bg-indigo-600">
                        Add New Room
                    </Button>
                </Col>
            </Row>

            <Table
                dataSource={rooms}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />

            {/* Room Modal */}
            <Modal
                title={editingRoom ? "Edit Room" : "Add New Room"}
                open={isMdlVisible}
                onCancel={() => setIsMdlVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateRoom} initialValues={{ isAvailable: true, capacity: 1 }}>
                    <Form.Item name="roomNumber" label="Room Number / Identifier" rules={[{ required: true }]}>
                        <Input placeholder="e.g. 101-A, Standard-1" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="roomType" label="Room Type" rules={[{ required: true }]}>
                                <Input placeholder="e.g. AC, Non-AC, Deluxe" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="capacity" label="Seat Capacity" rules={[{ required: true }]}>
                                <InputNumber className="w-full" min={1} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="rentAmount" label="Monthly Rent (৳)">
                                <InputNumber className="w-full" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isAvailable" label="Available Status" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="features" label="Features">
                        <Input.TextArea placeholder="e.g. Wi-Fi, Attached Bath..." />
                    </Form.Item>
                    <div className="text-right">
                        <Button onClick={() => setIsMdlVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit">Save Room</Button>
                    </div>
                </Form>
            </Modal>

            {/* Add Seat Modal */}
            <Modal
                title="Add Seat to Room"
                open={isSeatMdlVisible}
                onCancel={() => setIsSeatMdlVisible(false)}
                footer={null}
            >
                <Form form={seatForm} layout="vertical" onFinish={handleAddSeat}>
                    <Form.Item name="seatNumber" label="Seat Number / Identifier" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Seat-A, Bed-1" />
                    </Form.Item>
                    <div className="text-right">
                        <Button onClick={() => setIsSeatMdlVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit">Add Seat</Button>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
}
