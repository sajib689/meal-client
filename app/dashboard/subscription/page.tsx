"use client";

import React from "react";
import { Card, Typography, Button, Tag, Row, Col, Divider, Spin, App as AntdApp } from "antd";
import { CheckCircleOutlined, SafetyCertificateOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useGetTenantSubscriptionQuery, useAssignSubscriptionMutation } from "@/store/api/subscriptionApiSlice";
import { useGetPackagesQuery } from "@/store/api/packageApiSlice";
import { useInitiatePaymentMutation } from "@/store/api/paymentApiSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function TenantSubscriptionPage() {
    const { data: subResponse, isLoading: subLoading, refetch } = useGetTenantSubscriptionQuery({});
    const { data: pkgResponse, isLoading: pkgLoading } = useGetPackagesQuery({});
    const [initiatePayment, { isLoading: isPaying }] = useInitiatePaymentMutation();
    const { notification } = AntdApp.useApp();

    const currentSub = subResponse?.data;
    const packages = pkgResponse?.data || [];

    const handleSubscribe = async (packageId: string, price: number) => {
        try {
            if (price === 0) {
                // Handle free/trial differently if bypassing payment
                notification.info({ message: "Free packages require manual SuperAdmin assignment currently." });
                return;
            }

            const res = await initiatePayment({ packageId }).unwrap();
            if (res.gatewayPageURL) {
                // Redirect user to SSLCommerz gateway
                window.location.href = res.gatewayPageURL;
            } else {
                notification.error({ message: "Failed to receive gateway URL from SSLCommerz." });
            }
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to initiate payment" });
        }
    };

    if (subLoading || pkgLoading) {
        return <div className="flex justify-center p-12"><Spin size="large" /></div>;
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Current Subscription Card */}
            <Card className="cool-card bg-indigo-50 border-indigo-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <SafetyCertificateOutlined className="text-3xl text-indigo-600" />
                            <Title level={4} className="!m-0 text-slate-800">My Subscription</Title>
                        </div>
                        {currentSub ? (
                            <div>
                                <div className="text-lg font-bold text-slate-700">
                                    {currentSub.packageId?.name} Plan
                                    <Tag color={currentSub.status === 'active' ? 'green' : 'red'} className="ml-3 uppercase">
                                        {currentSub.status}
                                    </Tag>
                                </div>
                                <div className="text-slate-500 mt-1">
                                    <ClockCircleOutlined className="mr-2" />
                                    Valid until {dayjs(currentSub.endDate).format("MMMM DD, YYYY")}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-lg font-bold text-red-600">No Active Subscription</div>
                                <div className="text-slate-500 mt-1">Please select a package below to unlock features.</div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <Title level={4} className="mt-8 mb-4">Available SaaS Packages</Title>

            <Row gutter={[16, 16]}>
                {packages.filter((p: any) => p.isActive).map((pkg: any) => (
                    <Col xs={24} md={12} lg={8} key={pkg._id}>
                        <Card className={`h-full flex flex-col ${currentSub?.packageId?._id === pkg._id ? 'border-2 border-indigo-600 shadow-md' : 'border border-slate-200'}`}>
                            {currentSub?.packageId?._id === pkg._id && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    CURRENT
                                </div>
                            )}
                            <Title level={3} className="!mb-0 text-indigo-600">৳{pkg.price}</Title>
                            <Text type="secondary" className="block mb-4">per {pkg.durationDays} days</Text>
                            <Title level={4} className="!mt-0 font-bold">{pkg.name}</Title>
                            <p className="text-slate-500 min-h-[40px]">{pkg.description || "The perfect plan for your mess management."}</p>

                            <Divider className="my-4" />

                            <ul className="space-y-3 mb-6 flex-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>Up to {pkg.maxMembers} Members</span>
                                </li>
                                {pkg.features?.smsNotification && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span>SMS Notifications</span>
                                    </li>
                                )}
                                {pkg.features?.advancedReports && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span>Advanced Analytics</span>
                                    </li>
                                )}
                                <li className="flex items-center gap-2">
                                    <CheckCircleOutlined className="text-green-500" />
                                    <span>24/7 Support</span>
                                </li>
                            </ul>

                            <Button
                                type={currentSub?.packageId?._id === pkg._id ? "default" : "primary"}
                                size="large"
                                className={`w-full ${currentSub?.packageId?._id === pkg._id ? '' : 'bg-indigo-600'}`}
                                onClick={() => handleSubscribe(pkg._id, pkg.price)}
                                loading={isPaying}
                                disabled={currentSub?.packageId?._id === pkg._id && currentSub?.status === 'active'}
                                icon={currentSub?.packageId?._id === pkg._id && currentSub?.status === 'active' ? <CheckCircleOutlined /> : <DollarOutlined />}
                            >
                                {currentSub?.packageId?._id === pkg._id
                                    ? (currentSub?.status === 'active' ? "Active Plan" : "Renew Now")
                                    : "Subscribe via SSLCommerz"}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
