import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, message } from "antd";

const RegisterForm = ({ open, onCancel, onCreate, type }) => {
  const [form] = Form.useForm();
  const [otpRequested, setOtpRequested] = useState(false);

  const requestOtp = () => {
    // Logic to request OTP
    setOtpRequested(true);
  };

  const handleCancel = () => {
    setOtpRequested(false);
    onCancel();
  };

  const handleRegister = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
        message.success("You have successfully registered!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      open={open}
      title="Register"
      footer={null}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical" name="consumer_registration_form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[
                { required: true, message: "Please input the company name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyRepresentative"
              label="Name of Company Representative"
              rules={[
                {
                  required: true,
                  message:
                    "Please input the name of the company representative!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[
                { required: true, message: "Please input the designation!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input the email!",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[
                { required: true, message: "Please input the mobile number!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          {type === "consumer" && (
            <Col span={12}>
              <Form.Item
                name="cinNumber"
                label="CIN Number"
                rules={[
                  { required: true, message: "Please input the CIN number!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input the password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="confirm-password"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Your passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        {otpRequested && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emailOtp"
                label="Email OTP"
                rules={[
                  { required: true, message: "Please input the email OTP!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobileOtp"
                label="Mobile OTP"
                rules={[
                  { required: true, message: "Please input the mobile OTP!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={16}>
          <Col span={24}>
            {!otpRequested ? (
              <Button type="primary" onClick={requestOtp} block>
                Request OTP
              </Button>
            ) : (
              <Button type="primary" onClick={handleRegister} block>
                Register
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RegisterForm;
