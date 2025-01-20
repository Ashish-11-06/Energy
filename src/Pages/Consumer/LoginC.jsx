import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "../Login.css";
import RegisterForm from "../../Components/Modals/Registration/RegisterForm";
import { loginUser } from "../../Redux/Slices/loginSlice";
import { useDispatch } from "react-redux";

const LoginC = ({user_category}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  // const [isNewUser,setNewUser]=useState(false);
console.log('user_category',user_category);


  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (values) => {
    // Implement account creation logic here
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleSendOtp = async (email) => {
    setLoading(true);
    // Implement OTP sending logic here
    setLoading(false);
    setOtpSent(true);
    setEmailForReset(email);
  };

  const handleVerifyOtp = async (values) => {
    setLoading(true);
    // Implement OTP verification logic here
    setLoading(false);
    setOtpVerified(true);
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    // Implement password reset logic here
    setLoading(false);
    setForgotPasswordModalVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    message.success("Password reset successful!");
  };

  const onFinish = async (credentials) => {
    setLoading(true);
    try {
      const response = await dispatch(loginUser(credentials)).unwrap();
      console.log('response', response.user.is_new_user);
      const new_user = response.user.is_new_user;

      setLoading(false);
      if (response) {
        message.success("Login successful!");
        localStorage.setItem("hasSeenWelcomeModal", "false"); // Set flag to show welcome modal
        if (new_user) {
          navigate("/consumer/what-we-offer", { state: { user_category, new_user } }); // Navigate to what-we-offer if new_user is true
        } else {
          navigate("/consumer/requirement", { state: { user_category, new_user } }); // Navigate to requirement if new_user is false
        }
      }
    } catch (error) {
      setLoading(false);
      message.error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="extra-links">
          <p>
            <a
              onClick={handleForgotPassword}
              style={{
                color: "#007bff",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#0056b3")}
              onMouseOut={(e) => (e.target.style.color = "#007bff")}
            >
              Forgot Password?
            </a>
          </p>

          <p>
            Don't have an account?{" "}
            <a
              onClick={showModal}
              style={{
                color: "#007bff",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#0056b3")}
              onMouseOut={(e) => (e.target.style.color = "#007bff")}
            >
              Create account
            </a>
          </p>
        </div>
      </div>

      <RegisterForm
        type="consumer"
        open={isModalVisible}
        onCancel={closeModal}
        onCreate={handleCreate}
      />

      <Modal
        title="Forgot Password"
        open={isForgotPasswordModalVisible}
        onCancel={() => setForgotPasswordModalVisible(false)}
        footer={null}
      >
        {!otpSent && (
          <Form
            layout="vertical"
            onFinish={({ email }) => handleSendOtp(email)}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Enter your email to receive OTP" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        )}

        {otpSent && !otpVerified && (
          <Form layout="vertical" onFinish={handleVerifyOtp}>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: "Please input the OTP!" }]}
            >
              <Input placeholder="Enter OTP" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        )}

        {otpVerified && (
          <Form layout="vertical" onFinish={handleResetPassword}>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default LoginC;