/* eslint-disable no-unused-vars */
import React from 'react';
import { Input, Button, Typography, Form, message, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyUser } from '../Redux/Slices/userSlice';

const { Text } = Typography;

const EmailVerification = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();


  const onFinish = async (values) => {
    if (!token) return; // Early return if no token
  
    const data = {
      token: token,
      password: values.password
    };
  
    try {
      const response = await dispatch(verifyUser(data)).unwrap();
      // console.log(response);
      message.success(response.message || 'Email verified successfully', 8);
      navigate('/');
    } catch (err) {
      console.error(err);
      message.error(err?.message || err || 'Email verification failed', 5);
    }
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
            label="Enter new password"
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
