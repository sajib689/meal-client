"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Typography, DatePicker, App as AntdApp, Modal, Form, Tag, Row, Col, Statistic, Popconfirm, Tooltip, Radio, Divider } from "antd";
import { FileProtectOutlined, DownloadOutlined, ReloadOutlined, CalculatorOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    useGetReportsQuery,
    useGenerateReportMutation,
    useNotifyReportMutation,
    useDeleteReportMutation
} from "@/store/api/reportApiSlice";
import { InfoCircleOutlined, SendOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ReportsBoard = () => {
    const { notification: antNotification } = AntdApp.useApp();
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: reports, isLoading: loading, refetch: fetchReports } = useGetReportsQuery(undefined);
    const [generateReport, { isLoading: genLoading }] = useGenerateReportMutation();
    const [notifyReport] = useNotifyReportMutation();
    const [deleteReport] = useDeleteReportMutation();
    const [notifLoading, setNotifLoading] = useState<Record<string, boolean>>({});

    const [generationMode, setGenerationMode] = useState<"month" | "range">("month");

    const handleGenerateReport = async (values: any) => {
        try {
            let payload: any = {};
            if (generationMode === "month") {
                payload.month = values.month.format("YYYY-MM");
            } else {
                payload.startDate = values.range[0].format("YYYY-MM-DD");
                payload.endDate = values.range[1].format("YYYY-MM-DD");
            }
            await generateReport(payload).unwrap();
            antNotification.success({ message: "Report generated successfully" });
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Generation failed" });
        }
    };

    const handleSendNotifications = async (month: string) => {
        setNotifLoading({ ...notifLoading, [month]: true });
        try {
            await notifyReport({ month }).unwrap();
            antNotification.success({ message: `Notifications sent for ${month}` });
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to send notifications" });
        } finally {
            setNotifLoading({ ...notifLoading, [month]: false });
        }
    };

    const handleDeleteReport = async (id: string) => {
        try {
            await deleteReport(id).unwrap();
            antNotification.success({ message: "Report deleted successfully" });
        } catch (error: any) {
            antNotification.error({ message: error.data?.message || "Failed to delete report" });
        }
    };

    const downloadPDF = (report: any) => {
        const doc = new jsPDF();
        
        // Add Header
        doc.setFillColor(79, 70, 229); // Indigo-600
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MEAL MASTER", 14, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Premium Mess Management Summary", 14, 32);
        
        doc.setFontSize(14);
        doc.text("MONTHLY REPORT", 196, 25, { align: 'right' });
        doc.setFontSize(10);
        doc.text(`Period: ${report.month}`, 196, 32, { align: 'right' });

        // Statistics Grid
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Performance Overview", 14, 60);
        
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.line(14, 63, 196, 63);

        autoTable(doc, {
            startY: 68,
            head: [["Total Meals", "Bazar Cost", "Meal Rate"]],
            body: [[
                report.totalMeals,
                `৳${(report.totalBazarCost || 0).toFixed(2)}`,
                `৳${(report.mealRate || 0).toFixed(4)}`
            ]],
            theme: 'plain',
            headStyles: { fontSize: 10, textColor: [100, 116, 139], fontStyle: 'bold' },
            bodyStyles: { fontSize: 14, textColor: [79, 70, 229], fontStyle: 'bold' },
        });

        const tableData = report.memberStats.map((stat: any) => {
            const due = Math.max(0, stat.totalCost - (stat.bazarTotal || 0));
            const balance = stat.balance || 0;
            return [
                stat.userId?.name || "Deleted Member",
                stat.totalMeals,
                `৳${(stat.totalCost || 0).toFixed(0)}`,
                `৳${(stat.bazarTotal || 0).toFixed(0)}`,
                `৳${due.toFixed(0)}`,
                { content: `৳${balance.toFixed(0)}`, styles: { textColor: balance >= 0 ? [16, 185, 129] : [239, 68, 68], fontStyle: 'bold' } }
            ];
        });

        autoTable(doc, {
            startY: 95,
            head: [["Member Name", "Meals", "Cost", "Bazar", "Payable", "Net Balance"]],
            body: tableData,
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
            doc.text(`Generated: ${dayjs().format("DD MMM YYYY HH:mm")}`, 196, 285, { align: 'right' });
        }

        doc.save(`Meal_Report_${report.month}.pdf`);
    };

    const columns = [
        { title: "Month", dataIndex: "month", key: "month", render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: "Meals", dataIndex: "totalMeals", key: "totalMeals" },
        { title: "Rate", dataIndex: "mealRate", key: "rate", render: (rate: number) => <Text strong>৳{rate.toFixed(4)}</Text> },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="small" direction="vertical" className="w-full">
                    <Button size="small" block icon={<DownloadOutlined />} onClick={() => downloadPDF(record)}>PDF</Button>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <>
                            <Button
                                size="small"
                                block
                                type="dashed"
                                icon={<SendOutlined />}
                                loading={notifLoading[record.month]}
                                onClick={() => handleSendNotifications(record.month)}
                            >
                                Notify All
                            </Button>
                            <Popconfirm title="Delete this report?" onConfirm={() => handleDeleteReport(record._id)}>
                                <Button danger size="small" block icon={<DeleteOutlined />}>Delete</Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record: any) => {
        const memberCols = [
            { title: "Member", dataIndex: ["userId", "name"], key: "name", render: (name: string, record: any) => name || record.userId?.name || <Text type="secondary">Deleted Member</Text> },
            { title: "Meals", dataIndex: "totalMeals", key: "meals" },
            { title: "Cost", dataIndex: "totalCost", key: "cost", render: (cost: number) => <Text>৳{(cost || 0).toFixed(2)}</Text> },
            { title: "Bazar Spent", dataIndex: "bazarTotal", key: "bazar", render: (val: number) => <Text>৳{(val || 0).toFixed(2)}</Text> },
            {
                title: "Payable",
                key: "payable",
                render: (_: any, record: any) => {
                    const due = Math.max(0, (record.totalCost || 0) - (record.bazarTotal || 0));
                    if (due > 0) {
                        return <Tag color="warning" bordered={false} className="font-bold rounded-md px-2 py-0.5">৳{due.toFixed(2)}</Tag>;
                    }
                    return <Text type="secondary">৳0.00</Text>;
                }
            },
            {
                title: "Balance",
                dataIndex: "balance",
                key: "balance",
                render: (bal: number) => (
                    <Tag color={(bal || 0) >= 0 ? "success" : "error"} bordered={false} className="font-bold rounded-md px-2 py-0.5">
                        ৳{(bal || 0).toFixed(2)}
                    </Tag>
                )
            },
        ];
        return <Table columns={memberCols} dataSource={record.memberStats} pagination={false} size="small" scroll={{ x: 400 }} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <Text className="text-slate-500 font-medium uppercase tracking-wider text-xs">Analytics</Text>
                    <Title level={2} className="m-0 font-outfit font-bold text-slate-800">Financial Reports</Title>
                </div>
                <Button variant="outlined" color="primary" icon={<ReloadOutlined />} onClick={() => fetchReports()} className="h-12 !rounded-xl font-bold">
                    Refresh Data
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <Card className="cool-card border-none shadow-xl shadow-slate-200/50" title={<div className="flex items-center gap-2"><CalculatorOutlined className="text-indigo-600" /> <span className="font-bold text-slate-800">Generate Report</span></div>}>
                            <Form layout="vertical" onFinish={handleGenerateReport}>
                                <div className="mb-4">
                                    <Space direction="vertical" className="w-full">
                                        <Text type="secondary" className="text-xs uppercase font-bold tracking-widest">Generation Mode</Text>
                                        <div className="bg-slate-100 p-1 rounded-xl inline-flex w-full">
                                            <Button
                                                type={generationMode === "month" ? "primary" : "text"}
                                                className={`flex-1 !rounded-lg font-bold ${generationMode === "month" ? "bg-indigo-600" : "text-slate-500"}`}
                                                onClick={() => setGenerationMode("month")}
                                            >
                                                Monthly
                                            </Button>
                                            <Button
                                                type={generationMode === "range" ? "primary" : "text"}
                                                className={`flex-1 !rounded-lg font-bold ${generationMode === "range" ? "bg-indigo-600" : "text-slate-500"}`}
                                                onClick={() => setGenerationMode("range")}
                                            >
                                                Custom Range
                                            </Button>
                                        </div>
                                    </Space>
                                </div>

                                {generationMode === "month" ? (
                                    <Form.Item name="month" label={<span className="font-medium text-slate-600">Select Month</span>} rules={[{ required: true }]}>
                                        <DatePicker picker="month" className="w-full h-12 rounded-xl" />
                                    </Form.Item>
                                ) : (
                                    <Form.Item name="range" label={<span className="font-medium text-slate-600">Select Period</span>} rules={[{ required: true }]}>
                                        <DatePicker.RangePicker className="w-full h-12 rounded-xl" />
                                    </Form.Item>
                                )}

                                <Button type="primary" htmlType="submit" size="large" block loading={genLoading} className="h-12 !rounded-xl font-bold bg-indigo-600 shadow-md shadow-indigo-200/40">
                                    Process & Finalize
                                </Button>
                                <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                    <InfoCircleOutlined className="text-amber-500 mt-1 flex-shrink-0" />
                                    <Text type="secondary" className="text-xs text-amber-700 leading-normal">
                                        This will calculate the meal rate for the selected period and automatically deduct costs from every member's balance.
                                    </Text>
                                </div>
                            </Form>
                        </Card>
                    )}
                </Col>
                <Col xs={24} lg={16}>
                    <Card className="cool-card border-none shadow-xl shadow-slate-200/50" title={<div className="flex items-center gap-2"><FileProtectOutlined className="text-indigo-600" /> <span className="font-bold text-slate-800">Historical Archive</span></div>}>
                        <Table
                            columns={columns}
                            dataSource={reports}
                            rowKey="_id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                            expandable={{ expandedRowRender }}
                            scroll={{ x: 600 }}
                            className="premium-table"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportsBoard;
