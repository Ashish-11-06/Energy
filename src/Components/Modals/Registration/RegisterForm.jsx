import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { registerUser, verifyOtp } from "../../../Redux/Slices/Consumer/registerSlice";

const RegisterForm = ({ open, onCancel, onCreate, type }) => {
  const [form] = Form.useForm();
  const [otpRequested, setOtpRequested] = useState(false);
  const [userCategory, setUserCategory] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")).user;
    const userCategory = user?.user_category;
    console.log('category:', userCategory);
    setUserCategory(userCategory);
  }, []);

  const requestOtp = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = { ...values, user_category: userCategory };
        dispatch(registerUser(payload))
          .unwrap()
          .then(() => {
            message.success("OTP has been sent to your email and mobile!");
            setOtpRequested(true);
          })
          .catch((error) => {
            message.error(`Failed to request OTP: ${error}`);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setOtpRequested(false);
    onCancel();
  };

  const handleVerifyOtp = () => {
    form
      .validateFields(["email_otp", "mobile_otp"])
      .then((values) => {
        const otp = {
          email_otp: values.email_otp,
          mobile_otp: values.mobile_otp,
        };
        dispatch(verifyOtp(otp))
          .unwrap()
          .then(() => {
            message.success("OTP verified successfully!");
            onCreate(values);
          })
          .catch((error) => {
            message.error(`OTP verification failed: ${error}`);
          });
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
              name="company"
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
              name="company_representative"
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
          {/* <Col span={12}>
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
           */}
          {type === "consumer" && (
            <Col span={12}>
              <Form.Item
                name="cin_number"
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
                name="email_otp"
                label="Email OTP"
                rules={[
                  { required: true, message: "Please input the email OTP!" },
                ]}
              >
                <Input  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile_otp"
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
              <Button type="primary" onClick={handleVerifyOtp} block>
                Verify OTP
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RegisterForm;
