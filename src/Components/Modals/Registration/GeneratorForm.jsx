import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const GeneratorForm = ({ onSubmit }) => (
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
          rules={[
            { required: true, message: 'Please input your email ID!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
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

    <Form.Item>
      <Button type="primary" htmlType="submit" block>
        Submit
      </Button>
    </Form.Item>
  </>
);

export default GeneratorForm;
