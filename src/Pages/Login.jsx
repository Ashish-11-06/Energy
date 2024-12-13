import React, { useState } from 'react';
import { Form, Input, Button, message, Radio } from 'antd'; // Import Radio component
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import 'antd/dist/reset.css'; // Make sure to include Ant Design styles
import './Login.css';
import RegisterModal from '../Modals/RegisterModal';
import useLogin from '../hook/useLogin'; // Import the custom hook

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { login, loading, error: loginError } = useLogin(); // Using the custom hook
  const navigate = useNavigate(); // Initialize navigation
  const [role, setRole] = useState('consumer'); // State to store selected role

  const onFinish = async (values) => {
    const { email, password } = values;

    const credentials = { 
      email: values.email,
      password: values.password,
      role: role, // Include the selected role
    }

    try {
      const response = await login(credentials);
      const data = response.payload.data;
      console.log(data);

      if (data.role === 'consumer') {
        message.success('Login successful!');
        navigate('/what-we-offer');  // Redirect to consumer's dashboard or specific route
      }
      if (data.role === 'generator') {
        message.success('Login successful!');
        navigate('/generator/what-we-offer');  // Redirect to generator's dashboard or specific route
      }
    } catch (err) {
      message.error(loginError || 'Login failed');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update selected role
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
          {/* Radio buttons for selecting role */}
          <Form.Item
            // label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Radio.Group onChange={handleRoleChange} value={role}>
              <Radio value="consumer">Consumer</Radio>
              <Radio value="generator">Generator</Radio>
            </Radio.Group>
          </Form.Item>
          
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

        {/* Registration link */}
        <div className="register-link">
          <p>Don't have an account? <a onClick={showModal}>Create account</a></p>
        </div>
      </div>

      {/* Modal for registration */}
      <RegisterModal open={isModalVisible} onCancel={handleCancel} />
    </div>
  );
};

export default Login;
