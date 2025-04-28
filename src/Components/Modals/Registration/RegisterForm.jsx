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
  const [cinValid, setCinValid] = useState(null);
  const dispatch = useDispatch();


  const restrictedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'mail.com', 'yandex.com', 'gmx.com'];

  const countryPhoneRules = {
    "+91": /^[6-9]\d{9}$/, // India - 10 digits
    "+1": /^\d{10}$/, // USA, Canada - 10 digits
    "+44": /^\d{10}$/, // UK - 10 digits
    "+61": /^\d{9}$/, // Australia - 9 digits
    "+971": /^\d{9}$/, // UAE - 9 digits
    "+49": /^\d{10}$/, // Germany - 10 digits
    "+33": /^\d{9}$/, // France - 9 digits
    "+86": /^\d{11}$/, // China - 11 digits
  };


const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/; // Standard CIN Format

  const handleCINChange = (e) => {
    const cinNumber = e.target.value.trim();
    if (cinNumber === "") {
      setCinValid(null); // Reset when empty
    } else {
      setCinValid(CIN_REGEX.test(cinNumber));
    }
  };

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

  // const requestOtp = () => {
  //   setLoading(true); // Set loading to true when request starts
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       const payload = { ...values, user_category: user_category };
  //       dispatch(registerUser(payload))
  //         .unwrap()
  //         .then((response) => {
  //           console.log(response); // Log the response to check the data
  //           setUserId(response.user_id); // Assuming the response contains a `user_id` field
  //           message.success("OTP has been sent to your email and mobile!");
  //           setOtpRequested(true);
  //           setLoading(false); // Set loading to false when request completes
  //         })
  //         .catch((error) => {
  //           message.error(`Failed to request OTP: ${error}`);
  //           setLoading(false); // Set loading to false when request fails
  //         });
  //     })
  //     .catch((info) => {
  //       console.log("Validate Failed:", info);
  //       setLoading(false); // Set loading to false when validation fails
  //     });

  // };

  const requestOtp = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const payload = { ...values, user_category: user_category };
      const response = await dispatch(registerUser(payload)).unwrap();
      // console.log('registerresponse', response); // Log the response to check the data
      // if (response?.error) {
      //   message.error(response.error || 'aaa');
      // } else if (response?.status === "error") {
      //   message.error(response.message || 'bbb');
      // } else if (response?.status === "failed") {
      //   message.error("CIN already exists. Please try again.");
      // } else if (response?.status === "invalid") {
      //   message.error("Invalid CIN for the given company name.");
      // } 
      
      if (response?.valid === false) {
        message.error("Invalid CIN for the given company name.");
      } else {
        // console.log("CIN is valid. OTP sent.");
        setUserId(response.user_id);
        message.success("OTP has been sent to your email and mobile!");
        setOtpRequested(true);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || error);
      // message.error(error.message || "Invalide CIN");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOtpRequested(false);
    onCancel();
  };

  const handleVerifyOtp = () => {
    setLoading(true); 
    form
      .validateFields(["email_otp", "mobile_otp"])
      .then((values) => {
        const otp = {
          email_otp: values.email_otp,
          mobile_otp: values.mobile_otp,
          user_id: userId,
        };
        // console.log(userId);
        // console.log(otp);
        dispatch(verifyOtp(otp))
          .unwrap()
          .then(() => {
            message.success("OTP verified successfully!");
            onCreate(values);
            setLoading(false); 
          })
          .catch((error) => {
            message.error(`OTP verification failed: ${error}`);
            setLoading(false); 
          });
      })
      .catch((info) => {
        // console.log("Validate Failed:", info);
        setLoading(false); 
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
        // marginLeft: '55%',
        // marginTop: '4%',
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
    label="CIN Number"
    name="cin_number"
    rules={[{ required: true, message: "Please input your CIN number!" }]}
    validateStatus={cinValid === null ? undefined : (cinValid ? "success" : "error")}
    help={cinValid === null ? undefined : (cinValid ? "" : "Invalid CIN format")}
  >
    <Input
      placeholder="Enter your CIN number"
      onChange={handleCINChange}
    />
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
    {/* <Form.Item
      name="mobile"
      label="Mobile"
      rules={[
        { required: true, message: "Please input the mobile number!" },
        { pattern: /^[0-9]{10}$/, message: "Mobile number must be 10 digits!" }, // Validation for mobile number
      ]}
    >
      <Input.Group compact>
        <Form.Item name="countryCode" noStyle>
          <Select style={{ width: "25%" }} defaultValue="+91"> 
            <Select.Option value="+91">+91</Select.Option>
            <Select.Option value="+93">+93</Select.Option>
            <Select.Option value="+43">+43</Select.Option>
            <Select.Option value="+32">+32</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="mobile" noStyle>
          <Input style={{ width: "75%" }} maxLength={10} placeholder="Enter mobile number" />
        </Form.Item>
      </Input.Group>
    </Form.Item> */}

    <Form.Item 
    label="Mobile">
        <Input.Group compact>
          <Form.Item name="countryCode" noStyle>
            <Select style={{ width: "24%", marginRight: "8px" }} defaultValue="+91">
              {Object.keys(countryPhoneRules).map((code) => (
                <Select.Option key={code} value={code}>
                  {code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="mobile"
            noStyle
            rules={[
              { required: true, message: "Please input the mobile number!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const selectedCode = getFieldValue("countryCode");
                  const regex = countryPhoneRules[selectedCode];
                  if (regex && regex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(`Invalid number format for ${selectedCode}`)
                  );
                },
              }),
            ]}
          >
            <Input style={{ width: "70%" }} placeholder="Enter mobile number" />
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
<p style={{color:'GrayText'}}>(Note : All * fields are mandatory.)</p>
        <Row gutter={16}>
          <Col span={24}>
            {!otpRequested ? (
              <Button type="primary" onClick={requestOtp} block loading={loading}>
                Verify & Request OTP
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

