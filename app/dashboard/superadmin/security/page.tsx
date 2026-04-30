"use client";

import React from "react";
import { Card, Typography, Button, Switch, Divider } from "antd";
import { SafetyOutlined, LockOutlined, CloudDownloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SecurityManagementPage() {
    return (
        <Card className="cool-card max-w-4xl">
            <div className="mb-8">
                <Title level={4} className="!m-0 text-slate-800">System Security & Backups</Title>
                <Text type="secondary">Platform-wide safety protocols, 2FA enforcements, and database snapshots.</Text>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <SafetyOutlined className="text-2xl text-indigo-600" />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-800">Force 2FA for Super Admins</div>
                        <div className="text-slate-500 text-sm">Require two-factor authentication for all platform master accounts.</div>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <LockOutlined className="text-2xl text-red-600" />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-800">Strict Rate Limiting</div>
                        <div className="text-slate-500 text-sm">Block IP addresses automatically after 5 failed login attempts.</div>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>

            <Divider />

            <div>
                <Title level={5}>Database Backups</Title>
                <p className="text-slate-500 mb-4">Generate and download an encrypted snapshot of the entire MongoDB database (Collections: Users, Meals, Bazars, Subscriptions).</p>
                <Button type="primary" icon={<CloudDownloadOutlined />} className="bg-slate-800 hover:bg-slate-700">
                    Generate MongoDB Snapshot
                </Button>
            </div>
        </Card>
    );
}
