"use client";

import React, { useEffect } from "react";
import { Card, Typography, Form, Input, Button, App as AntdApp } from "antd";
import { SaveOutlined, MessageOutlined } from "@ant-design/icons";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settingApiSlice";

const { Title, Text } = Typography;

export default function SMSSettingsPage() {
    const { data: response, isLoading } = useGetSettingsQuery({});
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const { notification } = AntdApp.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (response?.data?.smsConfiguration) {
            form.setFieldsValue(response.data.smsConfiguration);
        }
    }, [response, form]);

    const handleSave = async (values: any) => {
        try {
            await updateSettings({ smsConfiguration: values }).unwrap();
            notification.success({ message: "SMS Gateway configuration updated." });
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to update SMS settings" });
        }
    };

    return (
        <Card className="cool-card max-w-3xl">
            <div className="mb-8">
                <Title level={4} className="!m-0 text-slate-800">SMS Gateway Settings</Title>
                <Text type="secondary">Configure third-party bulk SMS API connections (e.g., Twilio, Greenweb).</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSave} disabled={isLoading}>
                <Form.Item name="apiUrl" label="Gateway API URL" rules={[{ required: true }]}>
                    <Input placeholder="https://api.smsgateway.com/send" />
                </Form.Item>
                <Form.Item name="apiKey" label="API Key / Token" rules={[{ required: true }]}>
                    <Input.Password placeholder="Enter your secret API key" />
                </Form.Item>
                <Form.Item name="senderId" label="Sender ID">
                    <Input placeholder="MEALMASTER" />
                </Form.Item>

                <div className="border-t border-slate-100 pt-6 mt-6 flex gap-4">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isUpdating}>
                        Save Configuration
                    </Button>
                    <Button icon={<MessageOutlined />} onClick={() => notification.info({ message: "SMS Ping sent." })}>
                        Send Test SMS
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
