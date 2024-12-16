import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';  
import 'antd/dist/reset.css';
import '../Login.css';
import RegisterModal from '../../Components/Modals/Registration/RegisterModal';  // Import RegisterModal
import useLogin from '../../hook/useLogin';

const LoginC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const { login, loading, error: loginError } = useLogin(); 
  const navigate = useNavigate();

  const role = 'consumer'; // You can dynamically set this role based on your needs

  const onFinish = async (values) => {
    const { email, password } = values;
    const credentials = { 
      email: values.email,
      password: values.password,
      role: role, // Include the role directly
    };

    try {
      const response = await login(credentials);
      const data = response.payload.data;
      console.log(data);

      if (data.role === 'consumer') {
        message.success('Login successful!');
        navigate('/what-we-offer');
      }
      if (data.role === 'generator') {
        message.success('Login successful!');
        navigate('/generator/what-we-offer');
      }
    } catch (err) {
      message.error(loginError || 'Login failed');
    }
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

      {/* Pass the type prop as 'consumer' to RegisterModal */}
      <RegisterModal open={isModalVisible} onCancel={closeModal} type="consumer" />
    </div>
  );
};

export default LoginC;
