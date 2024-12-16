import React from 'react';
import { Form, Input, Button, Row, Col, message, Select } from 'antd';

const ConsumerForm = ({
  onSubmit,
  onOtpSubmitMobile,
  onOtpSubmitEmail,
  otp,
  setOtp,
  emailOtp,
  setEmailOtp,
  otpRequested,
  otpVerified,
  emailOtpVerified,
  setOtpRequested
}) => {
  // Function to handle Mobile OTP verification
  const handleMobileOtpSubmit = () => {
    if (otp === "123456") {
      message.success('Mobile OTP verified successfully!');
      onOtpSubmitMobile(); // Call mobile OTP verification
    } else {
      message.error('Mobile OTP is incorrect!');
    }
  };

  // Function to handle Email OTP verification
  const handleEmailOtpSubmit = () => {
    if (emailOtp === "654321") {
      message.success('Email OTP verified successfully!');
      onOtpSubmitEmail(); // Call email OTP verification
    } else {
      message.error('Email OTP is incorrect!');
    }
  };

  const handleRequestOtp = () => {
    setOtpRequested(true); // Trigger OTP request
    message.success("OTP sent to your mobile number and email!");
  };

  return (
    <>
      <Row gutter={16}>
        {/* Company Name */}
        <Col span={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: 'Please input your company name!' }]}
          >
            <Input placeholder="Enter your company name" />
          </Form.Item>
        </Col>

        {/* Name of Company Representative */}
        <Col span={12}>
          <Form.Item
            label="Name of Company Representative"
            name="companyRepresentative"
            rules={[{ required: true, message: 'Please input the company representative\'s name!' }]}
          >
            <Input placeholder="Enter the representative's name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Email */}
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
        </Col>

        {/* Mobile Number */}
        <Col span={12}>
          <Form.Item
            label="Mobile"
            name="mobile"
            rules={[{ required: true, message: 'Please input your mobile number!' }]}
          >
            <Input placeholder="Enter your mobile number" />
          </Form.Item>
        </Col>
      </Row>

     

      <Row gutter={16}>
        {/* CIN Number */}
        <Col span={12}>
          <Form.Item
            label="CIN Number"
            name="cinNumber"
            rules={[{ required: true, message: 'Please input your CIN number!' }]}
          >
            <Input placeholder="Enter your CIN number" />
          </Form.Item>
        </Col>

        {/* Industry Type */}
        
      </Row>

      {/* OTP Input when OTP is requested */}
      {otpRequested && !otpVerified && (
        <>
          <Row gutter={16}>
            {/* Mobile OTP */}
            <Col span={12}>
              <Form.Item
                label="Mobile OTP"
                name="mobileOtp"
                rules={[{ required: true, message: 'Please enter the mobile OTP!' }]}
              >
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the Mobile OTP"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleMobileOtpSubmit}
                  block
                  style={{ marginTop: '30px' }}
                >
                  Verify Mobile OTP
                </Button>
              </Form.Item>
            </Col>

            {/* Email OTP */}
            <Col span={12}>
              <Form.Item
                label="Email OTP"
                name="emailOtp"
                rules={[{ required: true, message: 'Please enter the email OTP!' }]}
              >
                <Input
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter the Email OTP"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleEmailOtpSubmit}
                  block
                  style={{ marginTop: '30px' }}
                >
                  Verify Email OTP
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {/* Button to Request OTP */}
      {!otpRequested && (
        <Form.Item>
          <Button type="primary" onClick={handleRequestOtp} block>
            Request OTP
          </Button>
        </Form.Item>
      )}
    </>
  );
};

export default ConsumerForm;
