import React, { useState } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';

const ForgotPassword = ({ visible, onCancel, onResetPassword }) => {
  const [step, setStep] = useState(1); // Track the step (email input, OTP verification, or password reset)
  const [email, setEmail] = useState('');

  // Handle email OTP request
  const handleEmailSubmit = (email) => {
    // Simulate sending OTP to the email
    setEmail(email);
    message.success('OTP sent to your email!');
    setStep(2); // Go to the next step (OTP verification)
  };

  // Handle OTP verification and show the new password fields
  const handleOtpSubmit = (otp) => {
    // Simulate OTP verification
    if (otp === '123456') {
      message.success('OTP verified successfully!');
      setStep(3); // Go to the next step (new password)
    } else {
      message.error('Invalid OTP. Please try again.');
    }
  };

  // Handle new password reset
  const handlePasswordReset = (values) => {
    const { newPassword } = values;
    // Simulate password reset
    onResetPassword(newPassword);
    message.success('Password has been reset successfully!');
    onCancel(); // Close the modal after the password reset action
  };

  return (
    <Modal
      title="Forgot Password"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      style={{
        marginLeft: '62%',
        marginTop: '4%',
      }}
    >
      {/* Step 1: Email input */}
      {step === 1 && (
        <Form
          name="forgot-password"
          onFinish={({ email }) => handleEmailSubmit(email)}
          layout="vertical"
        >
          <Form.Item
            label="Enter your registered email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email to reset password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      )}

      {/* Step 2: OTP input */}
      {step === 2 && (
        <Form
          name="otp-verification"
          onFinish={({ otp }) => handleOtpSubmit(otp)}
          layout="vertical"
        >
          <Form.Item
            label="Enter OTP"
            name="otp"
            rules={[{ required: true, message: 'Please input the OTP!' }]}
          >
            <Input placeholder="Enter the OTP sent to your email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      )}

      {/* Step 3: New password input */}
      {step === 3 && (
        <Form
          name="reset-password"
          onFinish={handlePasswordReset}
          layout="vertical"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters long.' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPassword;
