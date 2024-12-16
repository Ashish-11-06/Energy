import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Radio, Select, Row, Col, message } from 'antd';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are included
import states from '../Data/States'; // Assuming states data is in the 'States.js' file

const RegisterModal = ({ open, onCancel }) => {
  const [selection, setSelection] = useState(null); // Track selection (consumer or generator)
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP has been requested
  const [otp, setOtp] = useState(""); // OTP state
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification status

    // Reset state when modal opens
    useEffect(() => {
       {
          setSelection(null);
          setOtpRequested(false);
          // setOtp("");
          setOtpVerified(false);
        }
      }, [open, onCancel]);
      
  // Handle radio button change
  const handleSelectionChange = (e) => {
    setSelection(e.target.value); // Set selected value (consumer or generator)
  };

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
    // Check if it's a consumer type
    if (selection === "consumer") {
      // Simulate OTP request process (in real life, you'd make an API call here)
      setOtpRequested(true);
      message.success("OTP sent to your mobile number!");
    } else {
      // For generator, just close the modal after submission
      onCancel();
    }
  };

  const onOtpSubmit = () => {
    if (otp === "123456") {  // Simulated OTP validation
      setOtpVerified(true);
      message.success("OTP Verified successfully!");
      setOtp("");  // Reset OTP field
      setSelection(null);  // Reset selection (consumer or generator)
      onCancel();  // Close modal after OTP verification
    } else {
      message.error("Invalid OTP. Please try again.");
    }
  };
  

  const handleCancel = () => {
    setOtpRequested(false);
    setOtpVerified(false);
    setOtp("");  // Clear OTP field
    setSelection(null);  // Clear selection (consumer or generator)
    onCancel(); // Close modal
  };

  return (
    <Modal
      title="Registration Form"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form onFinish={onFinish} layout="vertical">
        {/* Radio buttons for Consumer or Generator */}
        <Form.Item
          label="Select Type"
          name="type"
          rules={[{ required: true, message: 'Please select a type!' }]}
        >
          <Radio.Group onChange={handleSelectionChange} value={selection}>
            <Radio value="consumer">Consumer</Radio>
            <Radio value="generator">Generator</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Conditional fields based on selection */}
        {selection === 'consumer' && !otpRequested && !otpVerified && (
          <>
            <Row gutter={16}>
              {/* Name */}
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>

              {/* State */}
              <Col span={12}>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true, message: 'Please select your state!' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select your state"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {states.map((state, index) => (
                      <Select.Option key={index} value={state}>
                        {state}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Industry */}
              {/* <Col span={12}>
                <Form.Item
                  label="Industry"
                  name="industry"
                  rules={[{ required: true, message: 'Please select your industry!' }]}
                >
                  <Select
                    placeholder="Select your industry"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {industries.map((industry, index) => (
                      <Select.Option key={index} value={industry}>
                        {industry}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col> */}

              

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

              {/* Email */}
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please input a valid email!' }
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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

         
              {/* Password */}
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {selection === 'generator' && !otpRequested && !otpVerified && (
          <>
            <Row gutter={16}>
              {/* Name */}
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
              </Col>

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
            </Row>

            <Row gutter={16}>
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

              {/* Email ID */}
              <Col span={12}>
                <Form.Item
                  label="Email ID"
                  name="emailId"
                  rules={[{ required: true, message: 'Please input your email ID!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                  <Input placeholder="Enter your email ID" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Password */}
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* OTP Input when OTP is requested */}
        {otpRequested && !otpVerified && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="OTP"
                name="otp"
                rules={[{ required: true, message: 'Please enter the OTP!' }]}
              >
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item>
                <Button type="primary" onClick={onOtpSubmit} block
                style={{
                    marginTop: '30px',
                }}
                >
                  Verify OTP
                </Button>
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Submit Button */}
        {!otpRequested && !otpVerified && (
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default RegisterModal;
