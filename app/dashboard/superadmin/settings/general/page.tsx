"use client";

import React, { useEffect } from "react";
import { Card, Typography, Form, Input, Button, Switch, App as AntdApp } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settingApiSlice";

const { Title, Text } = Typography;

export default function GeneralSettingsPage() {
    const { data: response, isLoading } = useGetSettingsQuery({});
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const { notification } = AntdApp.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (response?.data?.sslCommerzConfiguration) {
            form.setFieldsValue(response.data.sslCommerzConfiguration);
        }
    }, [response, form]);

    const handleSave = async (values: any) => {
        try {
            await updateSettings({ sslCommerzConfiguration: values }).unwrap();
            notification.success({ message: "Payment gateway settings updated securely." });
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to update settings" });
        }
    };

    return (
        <Card className="cool-card max-w-3xl">
            <div className="mb-8">
                <Title level={4} className="!m-0 text-slate-800">Payment Gateway Settings</Title>
                <Text type="secondary">Configure SSLCommerz credentials for the SaaS platform.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSave} disabled={isLoading}>
                <Form.Item name="storeId" label="Store ID" rules={[{ required: true }]}>
                    <Input placeholder="Enter SSLCommerz Store ID" />
                </Form.Item>
                <Form.Item name="storePassword" label="Store Password" rules={[{ required: true }]}>
                    <Input.Password placeholder="Enter Store Password / API Key" />
                </Form.Item>
                <Form.Item name="isLive" label="Live Mode" valuePropName="checked" extra="Toggle off to use sandbox/test environment.">
                    <Switch />
                </Form.Item>

                <div className="border-t border-slate-100 pt-6 mt-6">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isUpdating}>
                        Save Configuration
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
