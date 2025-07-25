import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, Radio, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginSlice } from '../../Redux/Admin/slices/loginSlice';
import { useDispatch } from 'react-redux';
const { Link, Title, Text } = Typography;
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
      const [userType, setUserType] = useState('consumer');
      const navigate=useNavigate();
    const dispatch = useDispatch();
  const onFinish =async (values) => {
    // console.log('Received values:', values);
    const data={
email: values?.email,
password: values?.password,
user_type: values?.user_type
    }   
    const res = await dispatch(loginSlice(data));
    // console.log('login res',res);


// // Inside your login response handling:
if (res?.payload.message) {
//   const user = res?.payload.user;
//   const key = 'samya';

//   const secretPassphrase = 'samya'; // Use a better secret in production
// console.log('secret',secretPassphrase);

  // Encrypt the key
//   const encryptedKey = CryptoJS.AES.encrypt(key, secretPassphrase).toString();
// // console.log('encrypt',encryptedKey);

//   // Combine user and encrypted key
//   const userWithKey = {
//     ...user,
//     encryptedKey: encryptedKey,
//   };
// console.log('userwithkey',userWithKey);

  // Convert to string and store in localStorage
  // const userString = JSON.stringify(userWithKey);
  // console.log('user string',userString);
  
  // localStorage.setItem('userrr', userString);

  // Show success message
  message.success(res?.payload.message || 'Login successfully!');
  navigate('dashboard');

}

  };

  const handleForgotPassword = () =>
    {
        // console.log('Forgot password clicked');
    }
  const onFinishFailed = () =>
    {
        // console.log('on finish failed');
    }

return (
  <div
    style={{
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5', // Optional: for contrast
      padding: '20px',
    }}
  >
    <div
      className="login-box"
      style={{
        padding: '30px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        minWidth: '320px',
        width: '100%',
        maxWidth: '400px',
        marginRight:'20%',
        marginTop:'5%'
      }}
    >
      <h2 className="login-title">
        <UserOutlined /> Login
      </h2>
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
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please provide your password! ' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="User Type"
          name="user_type"
          rules={[{ required: true, message: 'Please select your user type!' }]}
        >
          <Radio.Group onChange={(e) => setUserType(e.target.value)} value={userType}>
            <Radio value="Consumer" style={{ fontSize: '20px' }}>Consumer</Radio>
            <Radio value="Generator" style={{ fontSize: '20px' }}>Generator</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <div className="extra-links">
        <p>
          <a
            onClick={handleForgotPassword}
            style={{
              color: "#9A8406",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Forgot your password?
          </a>
        </p>

        <p>
          Don't have an account?{" "}
          <a
            style={{
              color: "#9A8406",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  </div>
);

};

export default Login;