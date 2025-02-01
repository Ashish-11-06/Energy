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
  message,
} from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  SolutionOutlined,
  MessageOutlined,
  FormOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
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

  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  const userId = userData[0]?.id;
  const Razorpay = useRazorpay();
  const [orderId, setOrderId] = useState(null); // State to store order ID

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsQuotationVisible(true); // Show the quotation modal after selection
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

  const handleCreatePerforma = async () => {
    const performaData = {
      company_name: companyName,
      company_address: companyAddress,
      gst_number: gstinNumber,
      subscription: selectedPlan, // Use selected plan dynamically
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
    form
      .validateFields()
      .then(async (values) => {
        setFormError(""); // Reset any error message if the form is valid
        await handleCreatePerforma(values);
        setIsProformaVisible(true); // Show the proforma modal
        setIsQuotationVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        setFormError("Please fill in all required fields.");
      });
  };

  const handlePayment = async () => {
    try {
      const amount = selectedPlan === 1 ? 50000 : selectedPlan === 2 ? 200000 : 0;  // Adjust plan amount here
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
              amount: orderResponse.data.amount, 
              subscription: selectedPlan 
            };

            console.log("Payment data to send:", paymentData); // Log payment data

            try {
              const completeResponse = await dispatch(completeRazorpayPayment(paymentData)).unwrap();
              console.log("Complete payment response:", completeResponse); // Log response
              if (completeResponse.success) {
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
        <Col xs={24} sm={8} md={8} >
          <Card
            hoverable
            className={selectedPlan === "basic" ? "selected-plan" : ""}
            onClick={() => handleSelectPlan(1)}
            actions={[
              <Button
                type="primary"
                block
                size="small"
                style={{ width: "160px" }}
              >
                Select Plan
              </Button>,
            ]}
          >
            <div
              style={{
                backgroundColor: "#669800 ",
                marginBottom: "0",
                marginTop: "-25px",
                marginLeft: "-25px",
                marginRight: "-25px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <p style={{ padding: "5px" }}>
                <span
                  style={{
                    marginTop: "10px",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  EXT Lite Plan
                </span>
              </p>
              <hr />
            </div>
            <div>
            <Text className="price">50,000 INR</Text>
            <ul
              style={{ display: "flex", flexDirection: "column", padding: 0,marginLeft:'30%' }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <FormOutlined style={{ marginRight: "10px", color: '#669800' }} /> Matching IPP +
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {/* <AppstoreAddOutlined style={{ marginRight: "10px" ,color:'#669800' }} />{" "} */}
                <img src={req} alt="" style={{height:'15px',width:'15px',  marginRight:'10px'}}/>{"  "}
                Requirements +
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <FormOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Transaction
                window
              </li>
            </ul>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8} md={8}>
          <Card
            hoverable
            className={selectedPlan === "basic" ? "selected-plan" : ""}
            onClick={() => handleSelectPlan(2)}
            actions={[
              <Button
                type="primary"
                block
                size="small"
                style={{ width: "160px" }}
              >
                Select Plan
              </Button>,
            ]}
          >
            <div
              style={{
                backgroundColor: "#669800 ",
                marginBottom: "0",
                marginTop: "-25px",
                marginLeft: "-25px",
                marginRight: "-25px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <p style={{ padding: "5px" }}>
                <span
                  style={{
                    marginTop: "10px",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  EXT Pro Plan
                </span>
              </p>
              <hr />
            </div>
            <Text className="price">2,00,000 INR</Text>
            <ul
              style={{ display: "flex", flexDirection: "column", padding: 0 ,marginLeft:'30%'}}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <DashboardOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Dashboard
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <AppstoreAddOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Advisory
                Support
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <SolutionOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> PowerX
                subscription
              </li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} sm={8} md={8}>
          <Card
            hoverable
            className={selectedPlan === "basic" ? "selected-plan" : ""}
            onClick={() => handleSelectPlan(3)}
            actions={[
              <Button
                type="primary"
                block
                size="small"
                style={{ width: "160px" }}
              >
                Select Plan
              </Button>,
            ]}
          >
            <div
              style={{
                backgroundColor: "#669800 ",
                marginBottom: "0",
                marginTop: "-25px",
                marginLeft: "-25px",
                marginRight: "-25px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <p style={{ padding: "5px" }}>
                <span
                  style={{
                    marginTop: "10px",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  Trial Plan
                </span>
              </p>
              <hr />
            </div>
            <Text className="price">Free</Text>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 0,
                marginLeft: "40%",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <NotificationOutlined style={{ marginRight: "10px" ,color:'#669800' }} /> Trial
              </li>
            </ul>
          </Card>
        </Col>
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
    </div>
  );
};

export default SubscriptionPlans;
