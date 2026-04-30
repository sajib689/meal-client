"use client";

import React, { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined, WalletOutlined, KeyOutlined, CoffeeOutlined, LoadingOutlined, StopOutlined, PlayCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Table, Button, Space, Modal, Form, Input, App as AntdApp, Card, Typography, Tag, InputNumber, DatePicker, Row, Col, Select } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    useGetUsersQuery,
    useUpdateUserMutation,
    useCreateMemberMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
    useDepositMutation
} from "@/store/api/authApiSlice";
import { useAddMealMutation } from "@/store/api/mealApiSlice";
import { useGetStatsQuery } from "@/store/api/reportApiSlice";


const { Title, Text } = Typography;

const ManageUsers = () => {
    const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery(undefined);
    const { data: stats } = useGetStatsQuery(undefined);
    const [updateUser] = useUpdateUserMutation();
    const [createMember] = useCreateMemberMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [resetPassword] = useResetPasswordMutation();
    const [deposit] = useDepositMutation();
    const [addMeal] = useAddMealMutation();

    // Helper: find stats for a member
    const getMemberStat = (userId: string) =>
        (stats?.memberSummary || []).find((s: any) => s._id?.toString() === userId?.toString());

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isMealModalVisible, setIsMealModalVisible] = useState(false);
    const [selectedUserForMeals, setSelectedUserForMeals] = useState<any>(null);
    const [mealForm] = Form.useForm();
    const { notification: antNotification } = AntdApp.useApp();
    const { token, user: currentUser } = useSelector((state: RootState) => state.auth);

    const [loading, setLoading] = useState(false); // Keep for local form loading if needed

    const handleAddOrEdit = async (values: any) => {
        setLoading(true);
        try {
            if (editingUser) {
                await updateUser({ id: editingUser._id, ...values }).unwrap();
                antNotification.success({ message: "Member updated successfully" });
            } else {
                await createMember(values).unwrap();
                antNotification.success({ message: "Member created successfully" });
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Operation failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this member?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await deleteUser(id).unwrap();
                    antNotification.success({ message: "Member deleted successfully" });
                } catch (error: any) {
                    antNotification.error({ message: error.data?.message || "Delete failed" });
                }
            }
        });
    };

    const handleToggleMealStop = async (record: any) => {
        try {
            await updateUser({ id: record._id, isMealStopped: !record.isMealStopped }).unwrap();
            antNotification.success({ message: `Meals ${record.isMealStopped ? 'resumed' : 'stopped'} for ${record.name}` });
            refetchUsers(); // Refetch to show the latest status
        } catch (error: any) {
            antNotification.error({ message: "Failed to update meal status" });
        }
    };

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        {
            title: "Role & Status",
            dataIndex: "role",
            key: "role",
            render: (role: string, record: any) => {
                let color = "blue";
                if (role === "superadmin") color = "purple";
                else if (role === "admin") color = "gold";
                return (
                    <div className="flex flex-col gap-1 items-start">
                        <Tag color={color}>{role.toUpperCase()}</Tag>
                        {record.isMealStopped && <Tag color="error" className="m-0">MEAL STOPPED</Tag>}
                    </div>
                );
            }
        },
        {
            title: "Meals",
            key: "meals",
            render: (_: any, record: any) => {
                const stat = getMemberStat(record._id);
                return <Text>{stat?.totalMeals ?? 0}</Text>;
            }
        },
        {
            title: "Cost",
            key: "mealCost",
            render: (_: any, record: any) => {
                const stat = getMemberStat(record._id);
                const cost = stat?.totalCost ?? 0;
                return <Text>৳{cost.toFixed(2)}</Text>;
            }
        },
        {
            title: "Bazar Spent",
            key: "bazarCost",
            render: (_: any, record: any) => {
                const stat = getMemberStat(record._id);
                const bazar = stat?.totalBazar ?? 0;
                return <Text>৳{bazar.toFixed(2)}</Text>;
            }
        },
        {
            title: "Payable",
            key: "payable",
            render: (_: any, record: any) => {
                const stat = getMemberStat(record._id);
                const payable = Math.max(0, (stat?.totalCost || 0) - (stat?.totalBazar ?? 0));
                
                if (payable > 0) {
                    return <Tag color="warning" bordered={false} className="font-bold rounded-md px-2 py-0.5">৳{payable.toFixed(2)}</Tag>;
                }
                return <Text type="secondary">৳0.00</Text>;
            }
        },
        {
            title: "Balance",
            key: "balance",
            render: (_: any, record: any) => {
                const stat = getMemberStat(record._id);
                const balance = stat?.balance ?? 0;
                return (
                    <Tag color={(balance || 0) >= 0 ? "success" : "error"} bordered={false} className="font-bold rounded-md px-2 py-0.5">
                        ৳{(balance || 0).toFixed(2)}
                    </Tag>
                );
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => { setEditingUser(record); form.setFieldsValue(record); setIsModalVisible(true); }} title="Edit Member" />
                    <Button icon={<CoffeeOutlined />} onClick={() => { setSelectedUserForMeals(record); setIsMealModalVisible(true); }} disabled={record.isMealStopped} title={record.isMealStopped ? "Meals Stopped" : "Meal Tracking"} />
                    <Button icon={<WalletOutlined />} onClick={() => handleDeposit(record)} title="Deposit" />
                    <Button icon={<KeyOutlined />} onClick={() => handleResetPassword(record)} title="Reset Password" />

                    {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                        <Button
                            danger={!record.isMealStopped}
                            type={record.isMealStopped ? "primary" : "default"}
                            icon={record.isMealStopped ? <PlayCircleOutlined /> : <StopOutlined />}
                            onClick={() => handleToggleMealStop(record)}
                            title={record.isMealStopped ? "Resume Meals" : "Stop Meals"}
                        />
                    )}

                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} title="Delete Member" />
                </Space>
            ),
        },
    ];

    const handleResetPassword = (user: any) => {
        let newPassword = "";
        Modal.confirm({
            title: `Reset Password for ${user.name}`,
            content: (
                <div className="mt-4">
                    <Text type="secondary">Enter a new temporary password for this member.</Text>
                    <Input.Password
                        className="mt-2"
                        placeholder="New Password"
                        onChange={(e) => newPassword = e.target.value}
                    />
                </div>
            ),
            onOk: async () => {
                if (!newPassword || newPassword.length < 6) {
                    antNotification.error({ message: "Password must be at least 6 characters" });
                    return;
                }
                try {
                    await resetPassword({ id: user._id, newPassword }).unwrap();
                    antNotification.success({ message: "Password reset successfully" });
                } catch (error: any) {
                    antNotification.error({ message: "Reset failed" });
                }
            }
        });
    };

    const handleDeposit = (user: any) => {
        let depositAmount = 0;
        let depositDescription = "";

        Modal.confirm({
            title: `Add Deposit for ${user.name}`,
            content: (
                <div className="mt-4">
                    <Form layout="vertical">
                        <Form.Item label="Amount" required>
                            <InputNumber
                                className="w-full"
                                prefix="৳"
                                min={1}
                                onChange={(val) => depositAmount = val || 0}
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input
                                placeholder="e.g. Monthly Fee"
                                onChange={(e) => depositDescription = e.target.value}
                            />
                        </Form.Item>
                    </Form>
                </div>
            ),
            onOk: async () => {
                if (depositAmount <= 0) {
                    antNotification.error({ message: "Invalid amount" });
                    return;
                }
                try {
                    await deposit({
                        userId: user._id,
                        amount: depositAmount,
                        description: depositDescription
                    }).unwrap();
                    antNotification.success({ message: "Deposit successful" });
                } catch (error: any) {
                    antNotification.error({ message: "Deposit failed" });
                }
            }
        });
    };

    const fetchUserMeals = async (userId: string, date: any) => {
        try {
            const dateStr = date.format("YYYY-MM-DD");
            // We need an endpoint to get meals for a specific user and date
            // For now, we can filter from all-meals or use a custom query
            // Let's assume there's a way or we'll just handle it by logging (it will update existing)
            // Ideally we'd fetch first. Let's just keep it simple for now as per plan.
        } catch (error) { }
    };

    const downloadMemberPDF = () => {
        const doc = new jsPDF();
        
        // Add Header
        doc.setFillColor(79, 70, 229); // Indigo-600
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MEAL MASTER", 14, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Premium Mess Management System", 14, 32);
        
        doc.setFontSize(14);
        doc.text("MEMBER LIST", 196, 25, { align: 'right' });
        doc.setFontSize(10);
        doc.text(dayjs().format("MMMM DD, YYYY"), 196, 32, { align: 'right' });

        // Summary Section
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Financial Summary", 14, 55);
        
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.line(14, 58, 196, 58);

        autoTable(doc, {
            startY: 62,
            head: [["Total Bazar Spent", "Total Meals", "Mess Name"]],
            body: [[
                `৳${(stats?.totalBazarCost || 0).toFixed(2)}`,
                stats?.totalMeals || 0,
                (currentUser as any)?.messId?.name || "Global"
            ]],
            theme: 'plain',
            headStyles: { fontSize: 10, textColor: [100, 116, 139], fontStyle: 'bold' },
            bodyStyles: { fontSize: 12, textColor: [79, 70, 229], fontStyle: 'bold' },
        });

        // Members Table
        autoTable(doc, {
            startY: 85,
            head: [["#", "Name", "Phone", "Meals", "Bazar", "Cost", "Balance"]],
            body: (users || []).map((u: any, i: number) => {
                const stat = getMemberStat(u._id);
                const balance = stat?.balance ?? 0;
                return [
                    i + 1,
                    u.name,
                    u.phone || "—",
                    stat?.totalMeals ?? 0,
                    `৳${(stat?.totalBazar ?? 0).toFixed(0)}`,
                    `৳${(stat?.totalCost ?? 0).toFixed(0)}`,
                    { content: `৳${balance.toFixed(0)}`, styles: { textColor: balance >= 0 ? [16, 185, 129] : [239, 68, 68], fontStyle: 'bold' } }
                ];
            }),
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { top: 40 },
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            doc.text("Generated by Meal Master Premium • mealmaster.app", 196, 285, { align: 'right' });
        }

        doc.save(`Member_List_${dayjs().format("YYYY-MM-DD")}.pdf`);
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <Title level={4} className="m-0">Manage Mess Members</Title>
                    <div className="mt-2 flex gap-4">
                        <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                            <Text type="secondary" className="text-[10px] font-bold uppercase tracking-wider block">Total Bazar Spent</Text>
                            <Text strong className="text-amber-700 text-lg">৳{(stats?.totalBazarCost || 0).toFixed(2)}</Text>
                        </div>
                        <div className="bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                            <Text type="secondary" className="text-[10px] font-bold uppercase tracking-wider block">Total Mess Meals</Text>
                            <Text strong className="text-indigo-700 text-lg">{stats?.totalMeals || 0}</Text>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                        <Button icon={<FilePdfOutlined />} onClick={downloadMemberPDF} className="!rounded-xl border-red-400 text-red-500 hover:!bg-red-50">
                            Download PDF
                        </Button>
                    )}
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); form.resetFields(); setIsModalVisible(true); }} block className="sm:w-auto">
                        Add New Member
                    </Button>
                </div>
            </div>

            <Table columns={columns} dataSource={users} rowKey="_id" loading={loading} scroll={{ x: 800 }} />

            <Modal
                title={editingUser ? "Edit Member" : "Add New Member"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText={editingUser ? "Update" : "Create"}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    {!editingUser && (
                        <Form.Item name="password" label="Initial Password" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                    )}
                    {currentUser?.role === "superadmin" && (
                        <>
                            <Form.Item name="role" label="Role" rules={[{ required: true }]} initialValue="member">
                                <Select options={[
                                    { label: "Member", value: "member" },
                                    { label: "Admin", value: "admin" },
                                    { label: "Super Admin", value: "superadmin" },
                                ]} />
                            </Form.Item>
                            <Form.Item name="status" label="Account Status" rules={[{ required: true }]} initialValue="active">
                                <Select options={[
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                ]} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
            <Modal
                title={`Meal Tracking: ${selectedUserForMeals?.name}`}
                open={isMealModalVisible}
                onCancel={() => { setIsMealModalVisible(false); mealForm.resetFields(); }}
                onOk={() => mealForm.submit()}
                okText="Log Meal"
            >
                <Form form={mealForm} layout="vertical" onFinish={async (values) => {
                    try {
                        const dateStr = values.date.format("YYYY-MM-DD");
                        await addMeal({
                            ...values,
                            date: dateStr,
                            userId: selectedUserForMeals._id
                        }).unwrap();
                        antNotification.success({ message: "Meal updated successfully" });
                        setIsMealModalVisible(false);
                        mealForm.resetFields();
                    } catch (error: any) {
                        antNotification.error({ message: "Failed to update meal" });
                    }
                }} initialValues={{ date: dayjs(), breakfast: 0, lunch: 0, dinner: 0 }}>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="breakfast" label="Breakfast">
                                <InputNumber min={0} max={10} className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="lunch" label="Lunch">
                                <InputNumber min={0} max={10} className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="dinner" label="Dinner">
                                <InputNumber min={0} max={10} className="w-full" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
};

export default ManageUsers;
