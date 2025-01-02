import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "../Login.css";
import RegisterForm from "../../Components/Modals/Registration/RegisterForm"; // Import RegisterForm

const LoginC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control Register modal
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false); // State for Forgot Password modal
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // To toggle new password fields
  const [emailForReset, setEmailForReset] = useState("");
  const navigate = useNavigate();

  const role = "consumer"; // You can dynamically set this role based on your needs

  const onFinish = (values) => {
    const { email, password } = values;

    // Mock login logic
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Mock user data
      const userData = {
        role: role,
        email,
      };

      if (userData.role === "consumer") {
        message.success("Login successful!");
        navigate("/consumer/dashboard");
      } else if (userData.role === "generator") {
        message.success("Login successful!");
        navigate("/generator/what-we-offer");
      }
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (values) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleSendOtp = (email) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailForReset(email);
      setOtpSent(true);
      message.success(`OTP sent to ${email}`); // Simulated message
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setOtpVerified(true);
    message.success("OTP verified successfully!");
  };

  const handleResetPassword = (values) => {
    const { newPassword } = values;
    message.success("Password reset successfully!");
    setForgotPasswordModalVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setEmailForReset("");
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
                color: "#007bff", // Bootstrap's primary blue color
                textDecoration: "none", // Removes underline
                cursor: "pointer", // Changes the cursor to a pointer
              }}
              onMouseOver={(e) => (e.target.style.color = "#0056b3")} // Darker blue on hover
              onMouseOut={(e) => (e.target.style.color = "#007bff")} // Back to original color
            >
              Forgot Password?
            </a>
          </p>

          <p>
            Don't have an account?{" "}
            <a
              onClick={showModal}
              style={{
                color: "#007bff", // Bootstrap's primary blue color
                textDecoration: "none", // Removes underline
                cursor: "pointer", // Changes the cursor to a pointer
              }}
              onMouseOver={(e) => (e.target.style.color = "#0056b3")} // Darker blue on hover
              onMouseOut={(e) => (e.target.style.color = "#007bff")} // Back to original color
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
        visible={isForgotPasswordModalVisible}
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
