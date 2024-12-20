import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import '../Login.css';
import RegisterForm from '../../Components/Modals/Registration/RegisterForm';  // Import RegisterForm

const LoginC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // Mock loading state
  const navigate = useNavigate();

  const role = 'consumer'; // You can dynamically set this role based on your needs

  const onFinish = (values) => {
    const { email, password } = values;

    // Mock login logic: Allow every email and password
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Mock user data
      const userData = {
        role: role, // Default to 'consumer' for this example
        email,
      };

      // Simulate role-based navigation
      if (userData.role === 'consumer') {
        message.success('Login successful!');
        navigate('/consumer/dashboard'); // Redirect to consumer dashboard
      } else if (userData.role === 'generator') {
        message.success('Login successful!');
        navigate('/generator/what-we-offer'); // Redirect to generator-specific page
      }
    }, 1000); // Simulate a delay for loading state
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Show modal to register a new user
  const showModal = () => {
    setIsModalVisible(true); // Open the modal
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCreate = (values) => {
    console.log('Received values of form: ', values);
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
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link">
          <p>Don't have an account? <a onClick={showModal}>Create account</a></p>
        </div>
      </div>

      {/* Use RegisterForm instead of RegisterModal */}
      <RegisterForm type="consumer" open={isModalVisible} onCancel={closeModal} onCreate={handleCreate} />
    </div>
  );
};

export default LoginC;
