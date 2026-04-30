"use client";

import React from "react";
import { Card, Result, Space, Typography } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ReportsPage() {
    return (
        <Space direction="vertical" size="large" className="w-full">
            <div>
                <Title level={2}>Reports & Analytics</Title>
                <Text type="secondary">Platform-wide statistics</Text>
            </div>

            <Card>
                <Result
                    icon={<FileProtectOutlined />}
                    title="Analytics Dashboard Coming Soon"
                    subTitle="View revenue, user growth, and payment reports."
                />
            </Card>
        </Space>
    );
}
