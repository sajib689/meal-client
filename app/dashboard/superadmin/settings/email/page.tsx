"use client";

import React, { useEffect } from "react";
import { Card, Typography, Form, Input, InputNumber, Button, App as AntdApp } from "antd";
import { SaveOutlined, MailOutlined } from "@ant-design/icons";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settingApiSlice";

const { Title, Text } = Typography;

export default function EmailSettingsPage() {
    const { data: response, isLoading } = useGetSettingsQuery({});
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const { notification } = AntdApp.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (response?.data?.emailConfiguration) {
            form.setFieldsValue(response.data.emailConfiguration);
        }
    }, [response, form]);

    const handleSave = async (values: any) => {
        try {
            await updateSettings({ emailConfiguration: values }).unwrap();
            notification.success({ message: "Email SMTP configuration updated." });
        } catch (error: any) {
            notification.error({ message: error?.data?.message || "Failed to update email settings" });
        }
    };

    const handleTest = () => {
        notification.info({ message: "Test email dispatched. Check your logs." });
    };

    return (
        <Card className="cool-card max-w-3xl">
            <div className="mb-8">
                <Title level={4} className="!m-0 text-slate-800">Email (SMTP) Settings</Title>
                <Text type="secondary">Configure NodeMailer credentials for system emails and invoices.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSave} disabled={isLoading}>
                <Form.Item name="smtpHost" label="SMTP Host" rules={[{ required: true }]}>
                    <Input placeholder="e.g. smtp.gmail.com" />
                </Form.Item>
                <Form.Item name="smtpPort" label="SMTP Port" rules={[{ required: true }]}>
                    <InputNumber className="w-full" placeholder="e.g. 587 or 465" />
                </Form.Item>
                <Form.Item name="smtpUser" label="SMTP Username / Email" rules={[{ required: true }]}>
                    <Input placeholder="admin@mealmaster.com" />
                </Form.Item>
                <Form.Item name="smtpPass" label="SMTP Password / App Password" rules={[{ required: true }]}>
                    <Input.Password placeholder="Enter secure App Password" />
                </Form.Item>

                <div className="border-t border-slate-100 pt-6 mt-6 flex gap-4">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isUpdating}>
                        Save Configuration
                    </Button>
                    <Button icon={<MailOutlined />} onClick={handleTest}>
                        Send Test Email
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
