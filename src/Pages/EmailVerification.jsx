import React from 'react';
import { Input, Button, Typography, Form, message, Card } from 'antd';

const { Text } = Typography;

const EmailVerification = () => {
  const onFinish = (values) => {
    message.success('Form submitted successfully');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height to center vertically
        backgroundColor: '#f0f2f5', // Optional: background color for the page
      }}
    >
      <Card
        style={{
          width: 400, // Set a fixed width for the card
          padding: '20px',
          borderRadius: '8px', // Optional: rounded corners
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: shadow effect
        }}
      >
        <Form
          name="email-verification"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ email: '', password: '', confirm_password: '' }}
        >
          <Form.Item
            label="Enter your password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmailVerification;
