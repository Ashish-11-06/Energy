/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect,useRef } from 'react';
import { Button, message, Form, Input, Modal, Radio, App, Row,Col} from 'antd'; // Import App from antd
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import video from '../assets/vecteezy_solar-panels-and-wind-turbines-green-energy-concept_6299246.mp4';
import EXGLogo from '../assets/EXG.png'; // Import the logo image
import { useDispatch } from 'react-redux';
import { loginUser } from "../Redux/Slices/loginSlice";
import { sendForgotPasswordOtp, verifyForgotPasswordOtp, setNewPassword } from "../Redux/Slices/loginSlice";
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'; // Import UserOutlined icon
import RegisterForm from '../Components/Modals/Registration/RegisterForm';
import { fetchSubscriptionValidity } from '../Redux/Slices/Consumer/subscriptionEnrollSlice';

const LandingPage = () => {
  const [animatedText, setAnimatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [subscriptionPlanValidity, setSubscriptionPlanValidity] = useState([]);

  const user=JSON.parse(localStorage.getItem('user'))?.user || null;
 
  const lastVisitedPage = user?.last_visited_page || '/';
  // console.log('user',lastVisitedPage);

  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [userType, setUserType] = useState('consumer');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const textRef = useRef("");
  // const [loading, setLoading] = useState(false);
  // const [otpVerified, setOtpVerified] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const text = "Welcome to Energy Transition (EXT) Platform";
    let index = 0;
    textRef.current = ""; // Reset ref text
    const interval = setInterval(() => {
      if (index < text.length) {
        textRef.current += text.charAt(index); // Update ref value
        setAnimatedText(textRef.current); // Update state
      // console.log(textRef.current);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
        const loginData = { ...values}; // user_type: userType Add user_type to loginData
        // console.log('Login data:', loginData);

        const resultAction = await dispatch(loginUser(loginData));
        // console.log("API Response:", resultAction);
// console.log(lastVisitedPage);

        if (loginUser.fulfilled.match(resultAction)) {
            message.success('Login successful!');

            const user = resultAction.payload.user;
            const id = user.id;
            // console.log(id); 
            if (!user) {
                throw new Error("Invalid response from server");
            }
            // await new Promise(resolve => setTimeout(resolve, 5000));
            if (user?.user_category === 'Generator') {
              navigate(
                  user?.is_new_user 
                      ? '/what-we-offer' 
                      : '/generator/dashboard',
                      // : (lastVisitedPage === '/' ? '/generator/dashboard' : lastVisitedPage),
                  { state: { isNewUser: user?.is_new_user } }
              );
          } else if (user?.user_category === 'Consumer') {
              navigate(
                  user?.is_new_user 
                      ? '/what-we-offer' 
                      : '/consumer/dashboard' ,
                      // : (lastVisitedPage === '/' ? '/consumer/dashboard' : lastVisitedPage),
                  { state: { isNewUser: user?.is_new_user } }
              );
          }
// console.log('jello from landing');
const response = await dispatch(fetchSubscriptionValidity(id));
                    setSubscriptionPlanValidity(response.payload);
                    // console.log(response.payload);
            
            localStorage.setItem('subscriptionPlanValidity', JSON.stringify(response.payload));
          

            
        } else {
            // console.error('Login failedklaksdlfklaskdlk:', resultAction.payload);
            message.error(resultAction.payload || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        message.error(error.message || 'An error occurred during login. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
    message.error('Please check your inputs and try again.');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (values) => {
    setIsModalVisible(false);
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(false);
  };

  const handleSendOtp = async (email) => {
    setLoading(true);
    try {
      const res = await dispatch(sendForgotPasswordOtp(email)).unwrap(); // Unwrap the result
    // console.log(res?.message)
    //   console.log(res);
      message.success(res.message || "OTP sent successfully!"); // Show success message
      // setOtpSent(true);
      setIsForgotPasswordModalVisible(false)
      setEmailForReset(email);
    } catch (error) {
      console.log(error);
      message.error(error)
      // message.error(error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (otp) => {
    dispatch(verifyForgotPasswordOtp({ email: emailForReset, otp }));
  };

  const handleResetPassword = async (newPassword) => {
    dispatch(setNewPassword({ email: emailForReset, newPassword }));
  };

  // ✅ Handle success messages
  useEffect(() => {
    if (otpVerified) message.success("OTP verified successfully!");
    if (passwordResetSuccess) {
      message.success("Password reset successful!");
      setIsForgotPasswordModalVisible(false);
    }
  }, [otpVerified, passwordResetSuccess]);

  // ✅ Handle errors from Redux
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);


  return (
    <App> {/* Wrap the component with App */}
      <div className="landing-page" style={{padding:'5px'}}>
        {/* Background Video */}
        <video className="background-video" src={video} autoPlay muted loop />
        <div className="overlay" style={{ backgroundColor: 'rgba(3, 110, 11, 0.5)', backdropFilter: 'blur(5px)' }}></div>

<Row>
  <Row style={{width:'100%',height:'100%',justifyContent:'center',marginBottom:'0'}}>
    <h1 style={{marginTop:'20px',color:'white',fontWeight:'bolder'}} >{animatedText}</h1>
    {/* <h1 style={{marginTop:'20px'}}>jnkm</h1> */}
    <div className="logo-container">
            {/* <img src={EXGLogo} alt="EXG Logo" className="exg-logo" /> */}
            <img src={EXGLogo} alt="EXG Logo" className="exg-logo"  />
          </div>
  </Row>
  <Row>
   {/* <h2 style={{justifyContent:'center'}}>Green Energy </h2> */}
        <div className="content-container" style={{marginTop:'-20px'}}> 
          <div className="text-content" style={{marginTop: '-10px'}} >
            <div className='energy-title' style={{backgroundColor:'#669800',width:'160%'}}> 
            <p className='green-title' style={{marginLeft:'2%',fontWeight:'bold',marginTop:"20px"}}>Green Energy</p>
            <p className='marketplace' style={{marginLeft:'2%',marginTop:'-30px',fontWeight:'bolder'}}>Marketplace</p>
            </div>
           <p style={{fontSize:'24px',width:'160%',marginTop:'-5px'}}><i>...a Comprehensive <b>energy marketplace</b> that bridges the gap between energy consumers and generators</i></p>
            {/* <h2 className="animated-text">{animatedText}</h2> */}
            <ul >
           
            </ul>
            <p style={{color:'white',fontWeight:'bold',marginTop:'10%', width: '160%', fontSize: '28px'}}>Fast-track your energy transition</p>
          </div>

       
          
          {/* Login Box */}
          <div className="login-box" style={{
          marginTop: '-70px'
          }}>
         
            <h2 className="login-title"><UserOutlined /> Login</h2> 
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
                rules={[{ required: true, message: 'Please provide your email address!' }]}
                // labelCol={{ style: { fontSize: '35px' } }}

              >
                <Input prefix={<MailOutlined />} placeholder="Enter your email" /> 
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please provide your password! ' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" /> 
              </Form.Item>

              <Form.Item
                label="User Type"
                name="user_type"
                rules={[{ required: true, message: 'Please select your user type!' }]}
              >
                <Radio.Group onChange={(e) => setUserType(e.target.value)} value={userType}>
                  <Radio value="Consumer" style={{fontSize:'20px'}}>Consumer</Radio>
                  <Radio value="Generator" style={{fontSize:'20px'}}>Generator</Radio>
                </Radio.Group>
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
                    color: "#9A8406",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot your password?
                </a>
              </p>

              <p>
                Don't have an account?{" "}
                <a
                  onClick={showModal}
                  style={{
                    color: "#9A8406",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
        </Row>
        </Row>

        {/* Footer */}
        <div className="footer">
       <a 
       href='https://www.exgglobal.com' 
      //  href='#' 
       style={{zIndex:2000}}  alt='EXG Global'>WWW.EXGGLOBAL.COM</a> 
        </div>

        {/* Registration Modal */}
        <RegisterForm
          type="consumer"
          open={isModalVisible}
          onCancel={closeModal}
          onCreate={handleCreate}
        />

        {/* Forgot Password Modal */}
        <Modal
          title="Forgot Password"
          open={isForgotPasswordModalVisible}
          onCancel={closeForgotPasswordModal}
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
                <Input placeholder="Enter your email to receive link" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Send Link
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
    </App>
  );
};

export default LandingPage;
