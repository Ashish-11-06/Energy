import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'antd/dist/reset.css';
import '../../Login.css';
import RegisterForm from '../../../Components/Modals/Registration/RegisterForm';
import { loginUser } from "../../../Redux/Slices/loginSlice"; // Import your slice's async thunk

const LoginG = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Dispatch the loginUser async thunk and wait for its result
      const resultAction = await dispatch(loginUser(values));
     
      // Check if the login was successful
      if (loginUser.fulfilled.match(resultAction)) {
        message.success('Login successful!');
        const user = resultAction.payload.user ;
        // console.log(result.is_new_user);
        if (user.is_new_user) {
          navigate('/generator/portfolio', { state: { isNewUser: user.is_new_user } });
        }else{
              navigate('/generator/dashboard'); // Navigate to the dashboard
            }   
      } else {
        message.error(resultAction.payload || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check your inputs and try again.');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
          <p>
            Don't have an account? <a onClick={showModal}>Create account</a>
          </p>
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
