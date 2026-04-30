"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Typography, DatePicker, InputNumber, App as AntdApp, Tabs, Form, Modal, Tag, Calendar, Badge, Select, Row, Col, Divider } from "antd";
import { CoffeeOutlined, SaveOutlined, HistoryOutlined, TeamOutlined, LockOutlined, DeleteOutlined, CalculatorOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";

const { Title, Text } = Typography;

import { useGetUsersQuery } from "@/store/api/authApiSlice";
import { useGetStatsQuery } from "@/store/api/reportApiSlice";
import {
    useGetMyMealsQuery,
    useGetAllMealsQuery,
    useGetMonthlySummaryQuery,
    useAddMealMutation,
    useDeleteMealMutation
} from "@/store/api/mealApiSlice";

const LogMeal = () => {
    const { notification: antNotification } = AntdApp.useApp();
    const { user } = useSelector((state: RootState) => state.auth);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);
    const [viewingMeals, setViewingMeals] = useState<any[]>([]);

    const queryParams = dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : undefined;

    // RTK Query Hooks
    const { data: myMeals, isLoading: myMealsLoading } = useGetMyMealsQuery(queryParams);
    const { data: allMeals, isLoading: allMealsLoading } = useGetAllMealsQuery(queryParams, { skip: user?.role !== "admin" && user?.role !== "superadmin" });
    const { data: stats, isLoading: statsLoading } = useGetStatsQuery(queryParams);
    const { data: allUsers } = useGetUsersQuery(undefined, { skip: user?.role !== "admin" && user?.role !== "superadmin" });
    const { data: summaryData, isLoading: summaryLoading } = useGetMonthlySummaryQuery(selectedMonth.format("YYYY-MM"), { skip: user?.role !== "admin" && user?.role !== "superadmin" });

    const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dateStrings);
        } else {
            setDateRange(undefined);
        }
    };

    const [addMeal] = useAddMealMutation();
    const [deleteMeal] = useDeleteMealMutation();

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingMeal, setEditingMeal] = useState<any>(null);

    useEffect(() => {
        if (myMeals && viewingMeals.length === 0) {
            setViewingMeals(myMeals);
        }
    }, [myMeals]);

    const handleDeleteMeal = async (id: string) => {
        Modal.confirm({
            title: "Delete this meal record?",
            content: "This action cannot be undone.",
            okType: "danger",
            onOk: async () => {
                try {
                    await deleteMeal(id).unwrap();
                    antNotification.success({ message: "Meal record deleted" });
                } catch (error) {
                    antNotification.error({ message: "Delete failed" });
                }
            }
        });
    };

    const handleUpdateMeal = async (values: any) => {
        try {
            await addMeal({
                ...values,
                date: selectedDate.format("YYYY-MM-DD"),
                userId: values.userId || user?.id
            }).unwrap();
            antNotification.success({ message: "Meal count updated successfully" });
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to update meal" });
        }
    };

    const handleEditClick = (record: any) => {
        setEditingMeal(record);
        // Map the fields for the edit form
        editForm.setFieldsValue({
            userId: record.userId?._id || record.userId,
            date: dayjs(record.date),
            breakfast: record.breakfast,
            lunch: record.lunch,
            dinner: record.dinner,
        });
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async (values: any) => {
        try {
            await addMeal({
                ...values,
                date: values.date.format("YYYY-MM-DD"),
                userId: values.userId || editingMeal?.userId?._id || editingMeal?.userId || user?.id,
            }).unwrap();
            antNotification.success({ message: "Meal record updated successfully" });
            setIsEditModalVisible(false);
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to update meal" });
        }
    };

    const monthlySummary = summaryData?.summary || {};
    const currentMealRate = summaryData?.mealRate || 0;

    const myMealsColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => dayjs(date).format("MMM DD, YYYY")
        },
        { title: "Breakfast", dataIndex: "breakfast", key: "breakfast" },
        { title: "Lunch", dataIndex: "lunch", key: "lunch" },
        { title: "Dinner", dataIndex: "dinner", key: "dinner" },
        {
            title: "Summary",
            key: "summary",
            render: (_: any, record: any) => {
                const total = record.breakfast + record.lunch + record.dinner;
                if (total === 0) return <Tag color="red" className="font-bold">MEAL OFF</Tag>;
                return <Text>{total} Meals</Text>;
            }
        },
        {
            title: "Status",
            key: "isLocked",
            dataIndex: "isLocked",
            render: (locked: boolean) => (
                locked ? <Tag color="error" icon={<LockOutlined />}>LOCKED</Tag> : <Tag color="success">EDITABLE</Tag>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="small">
                    {!record.isLocked && <Button type="text" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />}
                    {/* <Button danger type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteMeal(record._id)} /> */}
                </Space>
            )
        }
    ];

    const allMealsColumns = [
        { title: "Member", dataIndex: ["userId", "name"], key: "name", render: (name: string, record: any) => name || <Text type="secondary">Deleted Member</Text> },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => dayjs(date).format("MMM DD, YYYY")
        },
        { title: "B", dataIndex: "breakfast", key: "b" },
        { title: "L", dataIndex: "lunch", key: "l" },
        { title: "D", dataIndex: "dinner", key: "d" },
        {
            title: "Total",
            key: "total",
            render: (_: any, record: any) => {
                const total = record.breakfast + record.lunch + record.dinner;
                if (total === 0) return <Tag color="red" className="font-bold m-0 text-[10px]">MEAL OFF</Tag>;
                return <Text strong>{total}</Text>;
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
                    <Button danger type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteMeal(record._id)} />
                </Space>
            )
        }
    ];

    const summaryColumns = [
        { title: "Member", dataIndex: "name", key: "name" },
        { title: "B", key: "b", render: (record: any) => monthlySummary[record._id]?.totalBreakfast || 0 },
        { title: "L", key: "l", render: (record: any) => monthlySummary[record._id]?.totalLunch || 0 },
        { title: "D", key: "d", render: (record: any) => monthlySummary[record._id]?.totalDinner || 0 },
        {
            title: "Total Meals",
            key: "total",
            render: (record: any) => <Text strong>{monthlySummary[record._id]?.totalMeals || 0}</Text>
        },
        {
            title: "Estimated Cost",
            key: "cost",
            render: (record: any) => {
                const totalMeals = monthlySummary[record._id]?.totalMeals || 0;
                const cost = totalMeals * currentMealRate;
                return <Text strong className="text-indigo-600">৳{cost.toFixed(2)}</Text>;
            }
        }
    ];

    const fetchUserMeals = async (userId: string) => {
        try {
            const filtered = (allMeals || []).filter((m: any) => m.userId?._id === userId || m.userId === userId);
            setViewingMeals(filtered);
        } catch (err) {
            console.error(err);
        }
    };

    const dateCellRender = (value: dayjs.Dayjs) => {
        const dateStr = value.format("YYYY-MM-DD");
        const meal = viewingMeals.find(m => dayjs(m.date).format("YYYY-MM-DD") === dateStr);

        if (!meal) {
            // Check if date is in the past to mark red
            if (value.isBefore(dayjs(), 'day')) {
                return (
                    <div className="p-1 bg-red-50 h-full border-t-2 border-red-200">
                        <Badge status="error" text="Dropped" />
                    </div>
                );
            }
            return null;
        }

        const total = meal.breakfast + meal.lunch + meal.dinner;

        if (total === 0) {
            return (
                <div className="p-1 bg-red-50 h-full border-t-2 border-red-300">
                    <Badge color="red" text={<span className="font-bold text-red-600 text-[10px]">MEAL OFF</span>} />
                </div>
            );
        }

        return (
            <div className="p-1 bg-green-50 h-full border-t-2 border-green-200">
                <Badge status="success" text={`${total} Meals`} />
                <div className="text-[10px] text-gray-400 mt-1">
                    B:{meal.breakfast} L:{meal.lunch} D:{meal.dinner}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <Text className="text-slate-500 font-medium uppercase tracking-wider text-xs">Tracking</Text>
                <Title level={2} className="m-0 font-outfit font-bold text-slate-800">Meal History & Log</Title>
            </div>

            <Card className="cool-card border-none bg-slate-50 shadow-xl shadow-slate-200/50 p-2">
                <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                                <CoffeeOutlined className="text-indigo-600 text-xl" />
                            </div>
                            <div>
                                <Text strong className="text-slate-800 text-lg block">Log New Meals</Text>
                                <Text type="secondary" className="text-xs">Update your counts for any date</Text>
                            </div>
                        </div>
                        {(user?.role === "admin" || user?.role === "superadmin") && (
                            <Button
                                danger
                                type="dashed"
                                onClick={() => form.setFieldsValue({ breakfast: 0, lunch: 0, dinner: 0 })}
                                className="font-bold"
                            >
                                <LockOutlined /> Set Meal Off (Zero All)
                            </Button>
                        )}
                    </div>

                    <Form form={form} layout="vertical" onFinish={handleUpdateMeal} initialValues={{ breakfast: 0, lunch: 0, dinner: 0, userId: user?.id }}>
                        <Row gutter={24} align="bottom">
                            {(user?.role === "admin" || user?.role === "superadmin") && (
                                <Col xs={24} sm={12} lg={5}>
                                    <Form.Item name="userId" label={<span className="font-medium text-slate-600">Member</span>}>
                                        <Select
                                            className="w-full h-12"
                                            placeholder="Select Member"
                                            showSearch
                                            filterOption={(input, option) =>
                                                (String(option?.label) || "").toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={(allUsers || []).map((u: any) => ({ label: u.name, value: u._id }))}
                                        />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col xs={24} sm={12} lg={(user?.role === "admin" || user?.role === "superadmin") ? 5 : 6}>
                                <Form.Item name="date" label={<span className="font-medium text-slate-600">Select Date</span>}>
                                    <DatePicker className="w-full h-12 rounded-xl" value={selectedDate} onChange={(date) => setSelectedDate(date || dayjs())} allowClear={false} />
                                </Form.Item>
                            </Col>
                            <Col xs={8} sm={4} lg={(user?.role === "admin" || user?.role === "superadmin") ? 3 : 4}>
                                <Form.Item name="breakfast" label={<span className="font-medium text-slate-600">Breakfast</span>}>
                                    <InputNumber min={0} max={5} className="w-full h-12 rounded-xl flex items-center" />
                                </Form.Item>
                            </Col>
                            <Col xs={8} sm={4} lg={(user?.role === "admin" || user?.role === "superadmin") ? 3 : 4}>
                                <Form.Item name="lunch" label={<span className="font-medium text-slate-600">Lunch</span>}>
                                    <InputNumber min={0} max={5} className="w-full h-12 rounded-xl flex items-center" />
                                </Form.Item>
                            </Col>
                            <Col xs={8} sm={4} lg={(user?.role === "admin" || user?.role === "superadmin") ? 3 : 4}>
                                <Form.Item name="dinner" label={<span className="font-medium text-slate-600">Dinner</span>}>
                                    <InputNumber min={0} max={5} className="w-full h-12 rounded-xl flex items-center" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={(user?.role === "admin" || user?.role === "superadmin") ? 5 : 6}>
                                <Form.Item className="mb-0">
                                    <Button type="primary" icon={<SaveOutlined />} htmlType="submit" size="large" block className="h-12 !rounded-xl font-bold bg-indigo-600 w-full whitespace-normal leading-tight text-sm px-2">
                                        Update Record
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-1 h-1 bg-amber-500 rounded-full" />
                            <Text className="text-slate-400 text-[11px] font-medium">* Meals are locked for editing after 24 hours.</Text>
                        </div>
                    </Form>
                </div>
            </Card>

            <div className="flex justify-between items-center mb-4">
                <Title level={4} className="m-0 font-outfit font-bold">History & Analytics</Title>
                <div className="bg-white/50 border border-slate-200 p-1 rounded-xl glass flex items-center gap-2 px-3 py-1.5 transition-all hover:bg-white/80">
                    <DatePicker.RangePicker
                        onChange={handleRangeChange}
                        bordered={false}
                        className="w-64"
                        placeholder={["Start Date", "End Date"]}
                    />
                </div>
            </div>

            <Tabs defaultActiveKey="my">
                <Tabs.TabPane tab={<span><HistoryOutlined /> My Meal History</span>} key="my">
                    <Table columns={myMealsColumns} dataSource={myMeals} rowKey="_id" />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><CalculatorOutlined /> Daily Analysis</span>} key="daily">
                    <Card className="border-none shadow-sm bg-slate-50/50">
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
                                    title: 'Bazar',
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
                                    title: 'Daily Rate',
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
                    </Card>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><CalculatorOutlined /> Visual Calendar</span>} key="calendar">
                    <Card bordered={false} className="shadow-sm">
                        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex gap-4">
                                <Tag color="success">Green: Ate Meal</Tag>
                                <Tag color="error">Red: Skipped/No Entry</Tag>
                            </div>
                            {(user?.role === "admin" || user?.role === "superadmin") && (
                                <Space>
                                    <Text>View Member:</Text>
                                    <Select
                                        placeholder="Select Member"
                                        className="w-48"
                                        onChange={fetchUserMeals}
                                        allowClear
                                        onClear={() => setViewingMeals(myMeals)}
                                        options={(allUsers || []).map((u: any) => ({ label: u.name, value: u._id }))}
                                    />
                                </Space>
                            )}
                        </div>
                        <Calendar fullscreen={true} cellRender={dateCellRender} />
                    </Card>
                </Tabs.TabPane>
                {(user?.role === "admin" || user?.role === "superadmin") && (
                    <>
                        <Tabs.TabPane tab={<span><TeamOutlined /> All Members Stats</span>} key="all">
                            <Table columns={allMealsColumns} dataSource={allMeals} rowKey="_id" />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span><CalculatorOutlined /> Monthly Summary</span>} key="summary">
                            <Card className="mb-4 bg-slate-50 border-none shadow-sm">
                                <Row gutter={24} align="middle">
                                    <Col>
                                        <Space>
                                            <Text className="font-medium">Select Month:</Text>
                                            <DatePicker
                                                picker="month"
                                                value={selectedMonth}
                                                onChange={(date) => {
                                                    if (date) {
                                                        setSelectedMonth(date);
                                                    }
                                                }}
                                                allowClear={false}
                                                className="rounded-lg"
                                            />
                                        </Space>
                                    </Col>
                                    <Col>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200">
                                            <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Live Rate:</Text>
                                            <Text strong className="text-indigo-600">৳{currentMealRate.toFixed(4)}</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Table columns={summaryColumns} dataSource={allUsers} rowKey="_id" loading={summaryLoading} pagination={false} />
                        </Tabs.TabPane>
                    </>
                )}
            </Tabs>

            <Modal
                title="Edit Meal Record"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={() => editForm.submit()}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <Form.Item name="userId" label="Member">
                            <Select
                                disabled
                                options={(allUsers || []).map((u: any) => ({ label: u.name, value: u._id }))}
                            />
                        </Form.Item>
                    )}
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker disabled className="w-full" />
                    </Form.Item>
                    <Form.Item name="breakfast" label="Breakfast" rules={[{ required: true }]}>
                        <InputNumber min={0} max={5} className="w-full" />
                    </Form.Item>
                    <Form.Item name="lunch" label="Lunch" rules={[{ required: true }]}>
                        <InputNumber min={0} max={5} className="w-full" />
                    </Form.Item>
                    <Form.Item name="dinner" label="Dinner" rules={[{ required: true }]}>
                        <InputNumber min={0} max={5} className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LogMeal;
