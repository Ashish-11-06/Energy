import React, { useState, useEffect } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Modal,
  Form,
  Input,
  message,Spin
} from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  SolutionOutlined,
  MessageOutlined,
  FormOutlined,
  NotificationOutlined,
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
import SubscriptionModal from "./Modal/SubscriptionModal"; // Import SubscriptionModal
import { createRazorpayOrder, completeRazorpayPayment } from "../../Redux/Slices/Consumer/paymentSlice"; // Import payment actions
import { subscriptionEnroll } from "../../Redux/Slices/Consumer/subscriptionEnrollSlice";
import { fetchSubscriptionPlan } from "../../Redux/Slices/Generator/availableSubscriptionPlanG";
import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import trial from '../../assets/trial.png';
import powerX from '../../assets/powerX.png';
import advice from '../../assets/advice.png'; 
const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false); // State for proforma modal
  const [performa, setPerformaResponse] = useState(null);
  const [form] = Form.useForm();
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false); // State for subscription modal
    const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading,setLoading]=useState(false);
  const [subscriptionPlan,setSubscriptionPlan]=useState([]);


  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  const userId = userData[0]?.id;
  const Razorpay = useRazorpay();
  const [orderId, setOrderId] = useState(null); // State to store order ID

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

  const closeSubscriptionModal = () => {
    setIsSubscriptionModalVisible(false);
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

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

     useEffect(() => {
      setLoading(true);
       dispatch(fetchSubscriptionPlan())
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
     

  const handleCreatePerforma = async () => {
    const performaData = {
      company_name: companyName,
      company_address: companyAddress,
      gst_number: gstinNumber,
      subscription: selectedPlanId, // Use selected plan dynamically
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
              {
                pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: "Please provide a valid GSTIN number",
              },
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

  const handleGenerateProforma = async () => {
  const handleGenerateProforma = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setFormError(""); // Reset any error message if the form is valid
        await handleCreatePerforma(values);
      .then(async (values) => {
        setFormError(""); // Reset any error message if the form is valid
        await handleCreatePerforma(values);
        setIsProformaVisible(true); // Show the proforma modal
        setIsQuotationVisible(false);
        setIsQuotationVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        setFormError("Please fill in all required fields.");
        setFormError("Please fill in all required fields.");
      });
  };

  const handlePayment = async () => {
    try {
      // console.log(selectedPlan.id);
      
      const amount = selectedPlanId === selectedPlanId ? 50000 : selectedPlanId === selectedPlanId ? 200000 : 0;  // Adjust plan amount here
      const orderResponse = await dispatch(createRazorpayOrder({ amount, currency: "INR" })).unwrap();
      console.log("Order response:", orderResponse);

      if (orderResponse?.data?.id) {
        const options = {
          key: "rzp_test_bVfC0PJsvP9OUR",  
          amount: orderResponse.data.amount,  // Ensure this is the correct amount
          currency: orderResponse.data.currency, 
          name: "Energy Exchange",
          description: `Subscription Payment for Plan ${selectedPlan}`,
          order_id: orderResponse.data.id, 
          handler: async (response) => {
            const paymentData = {
              user: userId, // Include userId in payment data
              order_id: orderResponse.data.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: orderResponse.data.amount, // Include amount in payment data
              subscription_id:selectedPlanId
            };

            console.log("Payment data to send:", paymentData); // Log payment data

            try {
              const completeResponse = await dispatch(completeRazorpayPayment(paymentData)).unwrap();
              console.log("Complete payment response:", completeResponse);    
              if (completeResponse) {
                message.success("Payment successful! Subscription activated.");
                setIsProformaVisible(false); // Close the proforma modal
                navigate("/consumer/energy-consumption-table");
              } else {
                message.error("Payment completion failed.");
              }
            } catch (error) {
              console.error("Error completing payment:", error); // Log error
              message.error("Payment completion failed.");
            }
          },
          prefill: {
            name: userData?.name || "User",
            email: userData?.email || "user@example.com",
            contact: userData?.phone || "9999999999",
          },
          theme: { color: "#669800" },
        };

        // Use the razorpay instance from useRazorpay
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
      } else {
          console.error('Razorpay script not loaded');
      }
      
      }
    } catch (error) {
      console.error("Payment Error:", error);
      message.error("Payment initiation failed. Please try again.");
    }
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
  {loading ? ( // Show loader if loading is true
    <Spin size="large" />
  ) : (
    subscriptionPlan.map((plan) => (
      <Col key={plan.id} xs={24} sm={8} md={8}>
        <Card
          hoverable
          className={selectedPlanId === plan.id ? 'selected-plan' : ''}
          onClick={() => handleSelectPlan(plan.id)}
          actions={[
            <Button
              type="primary"
              onClick={() => handleId(plan.id)}
              block
              size="small"
              style={{ width: '160px' }}
            >
              Select Plan
              {/* {!subscriptionPlanValidity ? 'Select plan' : 'Subscribed'} */}
            </Button>,
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
            <Button type="primary" htmlType="submit" onClick={handleGenerateProforma}>
              Generate Performa
            </Button>,
          ]}
          width={600}
        >
          <p>(Please provide additional details)</p>
          {renderQuotation()}
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
          alt="Proforma Invoice"
          alt="Proforma Invoice"
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

      {isSubscriptionModalVisible && (
        <SubscriptionModal
          visible={isSubscriptionModalVisible}
          plan={selectedPlan}
          onClose={closeSubscriptionModal}
        />
      )}

      {isSubscriptionModalVisible && (
        <SubscriptionModal
          visible={isSubscriptionModalVisible}
          plan={selectedPlan}
          onClose={closeSubscriptionModal}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;