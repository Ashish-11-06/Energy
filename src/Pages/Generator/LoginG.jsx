import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import '../Login.css';
import RegisterForm from '../../Components/Modals/Registration/RegisterForm'; // Import RegisterForm

const LoginG = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // Mock loading state
  const navigate = useNavigate();

  const role = 'generator'; // You can dynamically set this role based on your needs

  const user = { email: 'manikerisamruddhi@gmail.com', password: '123' };

  const onFinish = (values) => {
    const { email, password } = values;

    console.log("Submitted Values:", values); // Debugging
    console.log("Expected User:", user); // Debugging
    console.log("Email Comparison:", email.trim().toLowerCase() === user.email.trim().toLowerCase(), email, user.email);
    console.log("Password Comparison:", password === user.password, password, user.password);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (role === 'generator') {
        if (email.trim().toLowerCase() === user.email.trim().toLowerCase() && password === user.password) {
          message.success('Login successful!');
          // Navigate to generator portfolio with user attributes
          navigate('/generator/dashboard', { state: { user } });
        } else {
         
          navigate('/generator/what-we-offer');
        }
      } else if (role === 'consumer') {
        message.success('Login successful!');
        navigate('/consumer/dashboard'); // Redirect to consumer dashboard
      } else {
        message.error('Invalid role.');
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

      <RegisterForm
        type="generator"
        open={isModalVisible}
        onCancel={closeModal}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default LoginG;
