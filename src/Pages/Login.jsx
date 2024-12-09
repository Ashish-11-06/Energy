import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';  // If you're using React Router
import 'antd/dist/reset.css'; // Make sure to include Ant Design styles
import './Login.css';
import RegisterModal from '../Modals/RegisterModal'; // Import the ModalForm component

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        
        {/* Registration link */}
        <div className="register-link">
          <p>Don't have an account? <a href="#" onClick={showModal}>Create account</a></p>
        </div>
      </div>

      {/* Modal for registration */}
      <RegisterModal open={isModalVisible} onCancel={handleCancel} />
    </div>
  );
};

export default Login;
