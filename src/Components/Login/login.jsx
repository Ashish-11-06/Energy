import React, { useState } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'antd/dist/reset.css';
import './Login.css';
import RegisterForm from '../Modals/Registration/RegisterForm';
import { loginUser } from "../../Redux/Slices/loginSlice";
import ForgotPassword from '../Modals/ForgotPassword';  // Import the ForgotPassword component

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('consumer');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const loginData = { ...values };
      console.log(values);

      const resultAction = await dispatch(loginUser(loginData));

      if (loginUser.fulfilled.match(resultAction)) {
        message.success('Login successful!');
        const user = resultAction.payload.user;
        
        if (user.user_category === 'Generator') {
          if (user.is_new_user) {
            navigate('/generator/portfolio', { state: { isNewUser: user.is_new_user } });
          } else {
            navigate('/generator/dashboard');
          }
        } else if (user.user_category === 'Consumer') {
          if (user.is_new_user) {
            console.log('New user:', user.is_new_user);
            navigate('/consumer/requirement', { state: { isNewUser: user.is_new_user } });
          } else {
            
            console.log('New user:', user.is_new_user);
            navigate('/consumer/dashboard');
          }
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

  // Forgot Password Modal logic
  const handleForgotPassword = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(false);
  };

  const handlePasswordReset = (email) => {
    // Send password reset logic (you should handle the request in the backend)
    console.log(`Password reset link sent to ${email}`);
    message.success('Password reset link has been sent to your email!');
    closeForgotPasswordModal();  // Close the modal after the action
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
            rules={[{ required: true, message: 'Please provide your email address!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please provide your password! ' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="User Type"
            name="user_type"
            rules={[{ required: true, message: 'Please select your user type!' }]}
          >
            <Radio.Group onChange={(e) => setUserType(e.target.value)} value={userType}>
              <Radio value="Consumer">Consumer</Radio>
              <Radio value="Generator">Generator</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link">
          <p>
            <a
              onClick={handleForgotPassword}
              style={{
                cursor: "pointer",
              }}
            >
              Forgot Password?
            </a>
          </p>
        </div>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a
              onClick={showModal}
              style={{
                cursor: "pointer",
              }}
            >
              Create account
            </a>
          </p>
        </div>
      </div>

      {/* Registration Modal */}
      <RegisterForm
        type={userType}
        open={isModalVisible}
        onCancel={closeModal}
        onCreate={handleCreate}
      />

      {/* Forgot Password Modal */}
      <ForgotPassword
        visible={isForgotPasswordModalVisible}
        onCancel={closeForgotPasswordModal}
        onResetPassword={handlePasswordReset}
      />
    </div>
  );
};

export default Login;
