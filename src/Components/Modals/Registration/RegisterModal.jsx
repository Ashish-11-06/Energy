import React, { useState, useEffect } from 'react';
import { Modal, Form, message } from 'antd';
import 'antd/dist/reset.css';
import ConsumerForm from './ConsumerForm';  // Import ConsumerForm component
import GeneratorForm from './GeneratorForm';  // Import GeneratorForm component

const RegisterModal = ({ open, onCancel, type }) => {
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP has been requested
  const [otp, setOtp] = useState(""); // Mobile OTP state
  const [emailOtp, setEmailOtp] = useState(""); // Email OTP state
  const [otpVerified, setOtpVerified] = useState(false); // Track Mobile OTP verification status
  const [emailOtpVerified, setEmailOtpVerified] = useState(false); // Track Email OTP verification status

  useEffect(() => {
    setOtpRequested(false);
    setOtpVerified(false);
    setEmailOtpVerified(false);
    setOtp(""); // Reset Mobile OTP field
    setEmailOtp(""); // Reset Email OTP field
  }, [open]);

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
    if (otpVerified && emailOtpVerified) {
      message.success("Registration successful!");
      onCancel(); // Close the modal after successful registration
    } else {
      message.error("Please verify both OTPs before submitting.");
    }
  };

  const onOtpSubmitMobile = () => {
    if (otp === "123456") {  // Simulated Mobile OTP validation
      setOtpVerified(true);
      message.success("Mobile OTP Verified successfully!");
      setOtp("");  // Reset Mobile OTP field
    } else {
      message.error("Invalid Mobile OTP. Please try again.");
    }
  };

  const onOtpSubmitEmail = () => {
    if (emailOtp === "654321") {  // Simulated Email OTP validation
      setEmailOtpVerified(true);
      message.success("Email OTP Verified successfully!");
      setEmailOtp("");  // Reset Email OTP field
    } else {
      message.error("Invalid Email OTP. Please try again.");
    }
  };

  return (
    <Modal
      title="Registration Form"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Form onFinish={onFinish} layout="vertical">
        {/* Render ConsumerForm or GeneratorForm based on the passed 'type' prop */}
        {type === 'consumer' && (
          <ConsumerForm
            onSubmit={onFinish}
            onOtpSubmitMobile={onOtpSubmitMobile}
            onOtpSubmitEmail={onOtpSubmitEmail}
            otp={otp}
            setOtp={setOtp}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
            otpRequested={otpRequested}
            otpVerified={otpVerified}
            emailOtpVerified={emailOtpVerified}
            setOtpRequested={setOtpRequested}
          />
        )}

        {type === 'generator' && (
          <GeneratorForm onSubmit={onFinish} />
        )}

        {/* Final submit button */}
        {otpVerified && emailOtpVerified && (
          <Form.Item>
            <button type="submit" className="ant-btn ant-btn-primary" style={{ width: '100%' }}>
              Final Submit
            </button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default RegisterModal;
