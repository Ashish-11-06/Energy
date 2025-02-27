import React, { useState, useEffect } from "react";
import {
  Card,Button, Row,Col,Typography,
  Modal,
  Form,
  Input,
  message,
  Spin
} from "antd";
import {
  FormOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import req from "../../assets/req.png";
import { useNavigate } from "react-router-dom";
import "../SubscriptionPlan.css";
import proformaInvoice from "../../assets/proforma_invoice.png";
import { useDispatch } from "react-redux";
import {
  createPerformaById,
  fetchPerformaById,
} from "../../Redux/Slices/Consumer/performaInvoiceSlice";
import { useLocation } from 'react-router-dom';
import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import trial from '../../assets/trial.png';
import powerX from '../../assets/powerX.png';
import advice from '../../assets/advice.png';
import { fetchSubscriptionPlanG } from "../../Redux/Slices/Generator/availableSubscriptionPlanG";
import { subscriptionEnroll,fetchSubscriptionValidity } from "../../Redux/Slices/Consumer/subscriptionEnrollSlice";
const { Title, Text } = Typography;

const SubscriptionPlanG = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false); // State for proforma modal
  const [performa, setPerformaResponse] = useState(null);
  const [form] = Form.useForm();
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subscriptionPlan,setSubscriptionPlan]=useState([]);
  const [loading,setLoading]=useState(false);
  // const [subscriptionPlanValidity,setSubscriptionPlanValidity]=useState([]);

const subscription = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
// console.log(subscriptionPlanValidity);

const alreadySubscribed = subscription.subscription_type;

  const [gstinNumber, setGstinNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
    const [selectedPlanId, setSelectedPlanId] = useState(null);
  
    
  const location = useLocation();
  const { selectedConsumer } = location.state || {};

  // console.log(selectedConsumer); 
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);

  const userId = userData[0]?.id;
const company=userData[0]?.company;


  const handleSelectPlan = (id) => {
    const currentDate = moment().format('YYYY-MM-DD');
    setSelectedPlanId(id);
    const subscriptionData ={
      user:userId,
      subscription:id,
      start_date:currentDate
    }
console.log(id);
const response=dispatch(subscriptionEnroll(subscriptionData));
console.log(response);

    setIsQuotationVisible(true); // Show the quotation view after selection
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

   useEffect(() => {
    setLoading(true);
     dispatch(fetchSubscriptionPlanG())
       .then(response => {    
         setSubscriptionPlan(response.payload);
         setLoading(false);
         //console.log(isState);
       })
       .catch(error => {
         console.error("Error fetching subscription:", error);
       });
   }, [dispatch]);
   
   console.log(subscriptionPlan);
   

  // useEffect(()=> {
  //   const id=userId;
  //   dispatch(fetchSubscriptionValidity(id))
  //   .then(response => {    
  //     setSubscriptionPlanValidity(response.payload);
  //      console.log(response.payload);

  //      localStorage.setItem('subscriptionPlanValidity', JSON.stringify(response.payload));
  //   })
  //   .catch(error => {
  //     console.error("Error fetching industry:", error);
  //   });
  // },[dispatch]);


  useEffect(() => {
    const fetchPerforma = async () => {
      try {

        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        setPerformaResponse(response);
        setCompanyName(response.company_name);
        setGstinNumber(response.gst_number);
        setCompanyAddress(response.company_address);
        setError(null);
      } catch (err) {
        message.error(err || "Failed to fetch performa.");
      }
    };

    fetchPerforma();
  }, [dispatch, userId]);

  const handleCreatePerforma = async () => {
    const performaData = {
      company_name: companyName,
      company_address: companyAddress,
      gst_number: gstinNumber,
      subscription: selectedPlanId,
      due_date: "2025-01-25",
    };
  
    try {
      const response = await dispatch(createPerformaById({ id: userId, performaData })).unwrap();
      console.log("Created Performa:", response);
      
      // Show success message
      message.success("Performa invoice generated successfully!")
  
      setIsProformaVisible(true);
      setIsQuotationVisible(false);
    } catch (error) {
      console.error("Failed to create performa:", error);
      
      // Show error message
      message.error("Failed to generate Performa invoice. Please try again.")
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setFormError(""); // Reset any error message if the form is valid
        handleCreatePerforma(values);
        // isPaymentVisible(true)
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        setFormError("");
      });
  };

  const handleSkip =() => {
    setIsQuotationVisible(false);
    setIsProformaVisible(true);
  }

  const renderQuotation = () => (
    <Form form={form} onFinish={handleCreatePerforma}>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please provide your company name" },
            ]}
          >
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="GSTIN Number"
            name="gstinNumber"
            rules={[
              { required: true, message: "Please provide your GSTIN number" },
            ]}
          >
            <Input
              value={gstinNumber}
              onChange={(e) => setGstinNumber(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Company Address"
            name="companyAddress"
            rules={[
              {
                required: true,
                message: "Please provide your company address",
              },
            ]}
          >
            <Input.TextArea
              rows={2}
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      {formError && (
        <Text type="danger" style={{ marginBottom: 20 }}>
          {formError}
        </Text>
      )}
    </Form>
  );

  const handleGenerateProforma = () => {
    form
      .validateFields()
      .then((values) => {
        setIsProformaVisible(true); // Show the proforma modal
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handlePayment = () => {
    navigate("/generator/update-profile-details", { state: { selectedConsumer } });
  };

  const closeProforma = () => {
    setIsProformaVisible(false);
  };
  const closePayment = () => {
    setIsPaymentVisible(false);
  };

  const handlePaymentDone = () => {
    navigate("/consumer/energy-consumption-table");
  };

  return (
    <div className="subscription-plans-container">
      <Title level={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        Choose Your Annual Subscription Plan
      </Title>
      <Row gutter={[16, 16]} justify="center">
  {loading ? (// Show loader if loading is true
    <Spin size="large" />
  ) : (
    subscriptionPlan.map((plan) => (
      <Col key={plan.id} xs={24} sm={8} md={8}>
        <Card
          hoverable
          className={selectedPlanId === plan.id ? 'selected-plan' : ''}
          onClick={() => handleSelectPlan(plan.id)}
          actions={[
                         plan.subscription_type !== alreadySubscribed ? (
                           <Button
                             type="primary"
                             block
                             size="small"
                             style={{ width: "160px" }}
                           >
                             Select Plan
                           </Button>
                         ) : (
                           <Button disabled>Subscribed</Button>
                         ),
                       ]}
        >
          <div
            style={{
              backgroundColor: '#669800',
              marginBottom: '0',
              marginTop: '-25px',
              marginLeft: '-25px',
              marginRight: '-25px',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            <p style={{ padding: '5px' }}>
              <span
                style={{
                  marginTop: '10px',
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                }}
              >
                EXT {plan.subscription_type} Plan
              </span>
            </p>
            <hr />
          </div>
          <Text className="price">{plan.price} <p style={{ fontSize: '18px' }}>INR</p></Text>
          <p><strong>Duration:</strong> {plan.duration_in_days} days</p>
          <ul style={{ display: 'flex', flexDirection: 'column', padding: 0, marginLeft: '30%' }}>
            {plan.subscription_type === 'LITE' && (
              <>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <FormOutlined style={{ marginRight: '10px', color: '#669800' }} /> Matching IPP +
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={req} alt="" style={{ height: '15px', width: '15px', marginRight: '10px' }} /> Requirements +
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={transaction} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Transaction window
                </li>
              </>
            )}
            {plan.subscription_type === 'PRO' && (
              <>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={dash} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Dashboard
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={advice} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Advisory Support
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={powerX} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> PowerX subscription
                </li>
              </>
            )}
            {plan.subscription_type === 'FREE' && (
              <>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={trial} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Trial
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={trial} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Trial
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={trial} alt="" style={{ width: '20px', height: '20px', marginRight: '4%' }} /> Trial
                </li>
              </>
            )}
          </ul>
        </Card>
      </Col>
    ))
  )}
</Row>

      {isQuotationVisible && (
        <Modal
          title="Generate proforma invoice"
          open={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            <Button type="primary" htmlType="submit" onClick={handleGenerateProforma}>
              Generate Performa
            </Button>,
          ]}
          width={600}
        >
          <p>(Please provide additional details)</p>
          {renderQuotation()}

          <Button onClick={handleSkip}>Skip</Button>
        </Modal>
      )}

      <Modal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        footer={[
          <Button key="button" onClick={handlePayment}>
            Proceed to Payment
          </Button>,
        ]}
        width={600}
      >
        <p>This is a proforma invoice.</p>
        <img
          src={proformaInvoice}
          alt=""
          style={{ height: "500px", width: "500px", marginLeft: "5%" }}
        />
        <p>Please proceed to payment to complete your subscription.</p>
      </Modal>

      <Modal
        title="Proceed to Payment"
        open={isPaymentVisible}
        onCancel={closePayment}
        footer={[
          <Button key="button" onClick={handlePayment}>
            Pay
          </Button>,
        ]}
        width={600}
      >
        This is dummy Payment
      </Modal>
    </div>
  );
};

export default SubscriptionPlanG;












// import React, { useState } from 'react';
// import { Card, Button, Row, Col, Typography, Modal } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import '../SubscriptionPlan.css';
// import {
//   DashboardOutlined,
//   AppstoreAddOutlined,
//   SolutionOutlined,
//   MessageOutlined,
//   FormOutlined,
//   NotificationOutlined,
// } from "@ant-design/icons";

// const { Title, Text } = Typography;

// const SubscriptionPlanG = () => {
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [isQuotationVisible, setIsQuotationVisible] = useState(false);
//   const navigate = useNavigate(); // Hook for navigation

//   const handleSelectPlan = (plan) => {
//     setSelectedPlan(plan);
//     setIsQuotationVisible(true); // Show the quotation view after selection
//   };

//   const closeQuotation = () => {
//     setIsQuotationVisible(false);
//     setSelectedPlan(null);
//   };

//   const renderQuotation = () => {
//     if (selectedPlan === 'basic') {
//       return (
//         <div>
//           <p><strong>Plan:</strong> Basic Plan [dummy] invoice will be shown</p>
//           <p><strong>Price:</strong> $9.99 / month</p>
//           <p><strong>Details:</strong></p>
//           <ul>
//             <li>1 User</li>
//             <li>5GB Storage</li>
//             <li>Basic Support</li>
//           </ul>
//           <p><strong>Terms and Conditions:</strong></p>
//           <ul>
//             <li>Monthly billing cycle.</li>
//             <li>No refund policy.</li>
//             <li>Subject to availability.</li>
//           </ul>
//         </div>
//       );
//     } else if (selectedPlan === 'standard') {
//       return (
//         <div>
//           <p><strong>Plan:</strong> Standard Plan [dummy] invoice will be shown</p>
//           <p><strong>Price:</strong> $19.99 / month</p>
//           <p><strong>Details:</strong></p>
//           <ul>
//             <li>5 Users</li>
//             <li>50GB Storage</li>
//             <li>Priority Support</li>
//           </ul>
//           <p><strong>Terms and Conditions:</strong></p>
//           <ul>
//             <li>Monthly billing cycle.</li>
//             <li>Subject to terms of service.</li>
//           </ul>
//         </div>
//       );
//     }
//   };

//   // Handle payment done and navigate to the new page
//   const handlePaymentDone = () => {
//     // Navigate to the energy-consumption-table page after payment is done
//     navigate('/generator/update-profile-details');
//   };

//   return (
//     <div className="subscription-plans-container">
//       <Title level={2} style={{marginBottom:'5%',marginTop:'5%'}}>Choose Your Annual Subscription Plan</Title>
//       <Row gutter={[16, 16]} justify="center">
//         <Col xs={24} sm={8} md={8} style={{ height: "800px" }}>
//           <Card
//             hoverable
//             className={selectedPlan === "basic" ? "selected-plan" : ""}
//             onClick={() => handleSelectPlan("basic")}
//             actions={[
//               <Button
//                 type="primary"
//                 block
//                 size="small"
//                 style={{ width: "160px" }}
//               >
//                 Select Plan
//               </Button>,
//             ]}
//           >
//             <div
//               style={{
//                 backgroundColor: "#669800 ",
//                 marginBottom: "0",
//                 marginTop: "-25px",
//                 marginLeft: "-25px",
//                 marginRight: "-25px",
//                 borderTopLeftRadius: "10px",
//                 borderTopRightRadius: "10px",
//               }}
//             >
//               <p style={{ padding: "5px" }}>
//                 <span
//                   style={{
//                     marginTop: "10px",
//                     color: "white",
//                     fontSize: "22px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   EXT Lite Plan
//                 </span>
//               </p>
//               <hr />
//             </div>
//             <div>
//             <Text className="price">50,000 INR</Text>
//             <ul
//               style={{ display: "flex", flexDirection: "column", padding: 0,marginLeft:'30%' }}
//             >
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <FormOutlined style={{ marginRight: "10px", color: '#669800' }} /> Matching Consumer +
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <AppstoreAddOutlined style={{ marginRight: "10px" ,color:'#669800' }} />{" "}
//                 {/* <img src={req} alt="" style={{height:'15px',width:'15px',  marginRight:'10px'}}/>{"  "} */}
//                 Requirements +
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <FormOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Transaction
//                 window
//               </li>
//             </ul>
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} sm={8} md={8}>
//           <Card
//             hoverable
//             className={selectedPlan === "basic" ? "selected-plan" : ""}
//             onClick={() => handleSelectPlan("basic")}
//             actions={[
//               <Button
//                 type="primary"
//                 block
//                 size="small"
//                 style={{ width: "160px" }}
//               >
//                 Select Plan
//               </Button>,
//             ]}
//           >
//             <div
//               style={{
//                 backgroundColor: "#669800 ",
//                 marginBottom: "0",
//                 marginTop: "-25px",
//                 marginLeft: "-25px",
//                 marginRight: "-25px",
//                 borderTopLeftRadius: "10px",
//                 borderTopRightRadius: "10px",
//               }}
//             >
//               <p style={{ padding: "5px" }}>
//                 <span
//                   style={{
//                     marginTop: "10px",
//                     color: "white",
//                     fontSize: "22px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   EXT Pro Plan
//                 </span>
//               </p>
//               <hr />
//             </div>
//             <Text className="price">2,00,000 INR</Text>
//             <ul
//               style={{ display: "flex", flexDirection: "column", padding: 0 ,marginLeft:'30%'}}
//             >
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <DashboardOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Dashboard
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <AppstoreAddOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Advisory
//                 Support
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <SolutionOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> PowerX
//                 subscription
//               </li>
//             </ul>
//           </Card>
//         </Col>

//         <Col xs={24} sm={8} md={8}>
//           <Card
//             hoverable
//             className={selectedPlan === "basic" ? "selected-plan" : ""}
//             onClick={() => handleSelectPlan("basic")}
//             actions={[
//               <Button
//                 type="primary"
//                 block
//                 size="small"
//                 style={{ width: "160px" }}
//               >
//                 Select Plan
//               </Button>,
//             ]}
//           >
//             <div
//               style={{
//                 backgroundColor: "#669800 ",
//                 marginBottom: "0",
//                 marginTop: "-25px",
//                 marginLeft: "-25px",
//                 marginRight: "-25px",
//                 borderTopLeftRadius: "10px",
//                 borderTopRightRadius: "10px",
//               }}
//             >
//               <p style={{ padding: "5px" }}>
//                 <span
//                   style={{
//                     marginTop: "10px",
//                     color: "white",
//                     fontSize: "22px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Trial Plan
//                 </span>
//               </p>
//               <hr />
//             </div>
//             <Text className="price">Free</Text>
//             <ul
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 padding: 0,
//                 marginLeft: "40%",
//               }}
//             >
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
//               </li>
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
//               </li>
//             </ul>
//           </Card>
//         </Col>
//       </Row>

//       {/* Quotation View */}
//       {isQuotationVisible && (
//         <Modal
//           title="Quotation"
//           open={isQuotationVisible}
//           onCancel={closeQuotation}
//           footer={[
//             <Button key="download" onClick={() => console.log('Download Quotation')}>
//               Download Quotation
//             </Button>,
//             <Button key="payment" onClick={handlePaymentDone}>
//               [dummy] Payment Done
//             </Button>,
//           ]}
//           width={600}
//         >
//           {renderQuotation()}
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default SubscriptionPlanG;
