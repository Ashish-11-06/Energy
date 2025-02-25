import React, { useState } from "react";
import { Form, Input, Button, Radio, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../Redux/slices/userSlice";
import "./LoginPage.css";

const { Title } = Typography;

const LoginPage = () => {
  const [userCategory, setUserCategory] = useState("consumer");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    console.log(values);
    
    try {
      const userData = {
        email: values.email,
        password: values.password,
        category: userCategory,
      };
      const resultAction = await dispatch(fetchUserData(userData)).unwrap();
      message.success("Login successful!");
      console.log(resultAction);
      // Navigate to the appropriate dashboard based on user category
      if (userCategory === "consumer") {
        navigate("/px/consumer/dashboard");
      } else {
        navigate("/px/generator/dashboard");
      }
    } catch (error) {
      message.error("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2} className="login-title">Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item label="User Category" name="userCategory">
            <Radio.Group
              onChange={(e) => setUserCategory(e.target.value)}
              value={userCategory}
            >
              <Radio value="consumer">Consumer</Radio>
              <Radio value="generator">Generator</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn" loading={loading}>
              Login
            </Button>
          </Form.Item>

          <div className="login-footer">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
            <Link to="/signup" className="create-account-link">
              Create Account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
