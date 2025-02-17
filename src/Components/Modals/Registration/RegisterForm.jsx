import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, message, Radio,Select } from "antd";
import { useDispatch } from "react-redux";
import { registerUser, verifyOtp } from "../../../Redux/Slices/Consumer/registerSlice";

const RegisterForm = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [otpRequested, setOtpRequested] = useState(false);
  const [userId, setUserId] = useState();
  const [user_category, setUserCategory] = useState(""); // Define user_category state
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();


  const restrictedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'mail.com', 'yandex.com', 'gmx.com'];

  const validateCompanyEmail = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please provide your email address!'));
    }

    const domain = value.split('@')[1]; // Extract the domain from the email
    if (restrictedDomains.includes(domain)) {
      return Promise.reject(new Error('Only company emails are allowed!'));
    }

    return Promise.resolve();
  };

  const requestOtp = () => {
    setLoading(true); // Set loading to true when request starts
    form
      .validateFields()
      .then((values) => {
        const payload = { ...values, user_category: user_category };
        dispatch(registerUser(payload))
          .unwrap()
          .then((response) => {
            console.log(response); // Log the response to check the data
            setUserId(response.user_id); // Assuming the response contains a `user_id` field
            message.success("OTP has been sent to your email and mobile!");
            setOtpRequested(true);
            setLoading(false); // Set loading to false when request completes
          })
          .catch((error) => {
            message.error(`Failed to request OTP: ${error}`);
            setLoading(false); // Set loading to false when request fails
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        setLoading(false); // Set loading to false when validation fails
      });

  };

  const handleCancel = () => {
    setOtpRequested(false);
    onCancel();
  };

  const handleVerifyOtp = () => {
    setLoading(true); // Set loading to true when request starts
    form
      .validateFields(["email_otp", "mobile_otp"])
      .then((values) => {
        const otp = {
          email_otp: values.email_otp,
          mobile_otp: values.mobile_otp,
          user_id: userId,
        };
        console.log(userId);
        console.log(otp);
        dispatch(verifyOtp(otp))
          .unwrap()
          .then(() => {
            message.success("OTP verified successfully!");
            onCreate(values);
            setLoading(false); // Set loading to false when request completes
          })
          .catch((error) => {
            message.error(`OTP verification failed: ${error}`);
            setLoading(false); // Set loading to false when request fails
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        setLoading(false); // Set loading to false when validation fails
      });
  };

  return (
    <Modal
      open={open}
      title={<span style={{ fontSize: '1.6rem',justifyContent:'center',marginLeft:'40%' }}>Register</span>} // Enlarge the title
      footer={null}
      onCancel={handleCancel}
      width={700}
      style={{
        marginLeft: '55%',
        marginTop: '4%',
      }}
    >
      <Form form={form} layout="vertical" name="consumer_registration_form"
        initialValues={{ countryCode: "+91" }}>
        {/* User Category Radio Buttons */}
        <Row gutter={16}>
  <Col span={24}>
    <Form.Item
      name="user_category"
      label="Select Category"
      rules={[{ required: true, message: "Please select a user category!" }]}
      labelCol={{ span: 10 }}
    >
      <Radio.Group
        onChange={(e) => setUserCategory(e.target.value)}
        value={user_category}
        style={{ display: "flex", justifyContent: "space-between", width: "100%" }} // Aligning buttons properly
      >
        <Radio value="Consumer" style={{ fontSize: '1.2rem',marginLeft:'15%' }}>Consumer</Radio>
        <Radio value="Generator" style={{ fontSize: '1.2rem' ,marginRight:'20%'}}>Generator</Radio>
      </Radio.Group>
    </Form.Item>
  </Col>
</Row>


        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company"
              label="Company Name"
              rules={[{ required: true, message: "Please input the company name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="company_representative"
              label="Name of Company Representative"
              rules={[{ required: true, message: "Please input the name of the company representative!" }]}
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
                { required: true, message: "Please input the email!", type: "email" },
                { validator: validateCompanyEmail },
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
        { pattern: /^[0-9]{10}$/, message: "Mobile number must be 10 digits!" }, // Validation for mobile number
      ]}
    >
      <Input.Group compact>
        <Form.Item name="countryCode" noStyle>
          <Select style={{ width: "25%" }} defaultValue="+91"> {/* ✅ Default country code */}
            <Select.Option value="+91">+91</Select.Option>
            <Select.Option value="+1">+1</Select.Option>
            <Select.Option value="+44">+44</Select.Option>
            <Select.Option value="+61">+61</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="mobile" noStyle>
          <Input style={{ width: "75%" }} maxLength={10} placeholder="Enter mobile number" />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  </Col>

        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters long.' },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
              hasFeedback
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
                rules={[{ required: true, message: "Please input the email OTP!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile_otp"
                label="Mobile OTP"
                rules={[{ required: true, message: "Please input the mobile OTP!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            {!otpRequested ? (
              <Button type="primary" onClick={requestOtp} block loading={loading}>
                Request OTP
              </Button>
            ) : (
              <Button type="primary" onClick={handleVerifyOtp} block loading={loading}>
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

