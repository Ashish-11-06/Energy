import React, { useState, useEffect } from "react";
import { useRazorpay } from "react-razorpay";
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
  Spin,
} from "antd";
import {
  FormOutlined,
} from "@ant-design/icons";
import moment from "moment";
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
import {
  createRazorpayOrder,
  completeRazorpayPayment,
} from "../../Redux/Slices/Consumer/paymentSlice"; // Import payment actions
import { subscriptionEnroll } from "../../Redux/Slices/Consumer/subscriptionEnrollSlice";
import { fetchSubscriptionPlan } from "../../Redux/Slices/Consumer/availableSubscriptionSlice";
import { fetchSubscriptionPlanG } from "../../Redux/Slices/Generator/availableSubscriptionPlanG";

import dash from "../../assets/dashboard.png";
import transaction from "../../assets/transaction.png";
import trial from "../../assets/trial.png";
import powerX from "../../assets/powerX.png";
import advice from "../../assets/advice.png";
const { Title, Text } = Typography;


const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false);
  const [performa, setPerformaResponse] = useState(null);
  const [form] = Form.useForm();
  const [formError, setFormError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  const user_category = userData[0]?.user_category;
  const userId = userData[0]?.id;
  const Razorpay = useRazorpay();
  const [orderId, setOrderId] = useState(null);

  const handleSelectPlan = (id, plan) => {
    setSelectedPlan(plan);
    const currentDate = moment().format("YYYY-MM-DD");
    setSelectedPlanId(id);
    const subscriptionData = {
      user: userId,
      subscription: id,
      start_date: currentDate,
    };
    const response = dispatch(subscriptionEnroll(subscriptionData));
    setIsQuotationVisible(true);
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
  };

  const handleFreeContinue = () => {
    navigate('/consumer/energy-consumption-table');
  };

  useEffect(() => {
    const fetchPerforma = async () => {
      try {
        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        setPerformaResponse(response);
        setCompanyName(response.company_name);
        setGstinNumber(response.gst_number);
        setCompanyAddress(response.company_address);
        setFormError(""); // Reset error on successful fetch
      } catch (err) {
        message.error(err.message || "Failed to fetch performa.");
      }
    };

    fetchPerforma();
  }, [dispatch, userId]);

  useEffect(() => {
    setLoading(true);
    if (user_category === 'Consumer') {
      dispatch(fetchSubscriptionPlan())
        .then((response) => {
          setSubscriptionPlan(response.payload);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching subscription:", error);
          setLoading(false);
        });
    } else {
      dispatch(fetchSubscriptionPlanG())
        .then((response) => {
          setSubscriptionPlan(response.payload);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching subscription:", error);
          setLoading(false);
        });
    }
  }, [dispatch]);

  const handleCreatePerforma = async () => {
    const performaData = {
      company_name: companyName,
      company_address: companyAddress,
      gst_number: gstinNumber,
      subscription: selectedPlanId,
      due_date: "2025-01-25",
    };

    try {
      const response = await dispatch(
        createPerformaById({ id: userId, performaData })
      ).unwrap();
      message.success("Performa invoice generated successfully!");
      setIsProformaVisible(true);
      setIsQuotationVisible(false);
    } catch (error) {
      console.error("Failed to create performa:", error);
      message.error("Failed to generate Performa invoice. Please try again.");
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setFormError(""); // Reset any error message if the form is valid
        handleCreatePerforma(values);
      })
      .catch((errorInfo) => {
        setFormError("Please fill in all required fields.");
      });
  };

  const renderQuotation = () => (
    <Form form={form} onFinish={handleCreatePerforma}>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please provide your company name" }]}
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
            rules={[{ required: true, message: "Please provide your company address" }]}
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
    form.validateFields()
      .then(async (values) => {
        setFormError(""); // Reset any error message if the form is valid
        try {
          await handleCreatePerforma(values);
          setIsProformaVisible(true);
          setIsQuotationVisible(false);
          setIsContinueDisabled(false);
        } catch (error) {
          setFormError("Please fill in all required fields.");
        }
      })
      .catch((errorInfo) => {
        setFormError("Please fill in all required fields.");
      });
  };

  const handlePayment = async () => {
    try {
      const amount = selectedPlanId === selectedPlanId ? 50000 : 200000; // Adjust plan amount here
      const orderResponse = await dispatch(
        createRazorpayOrder({ amount, currency: "INR" })
      ).unwrap();

      if (orderResponse?.data?.id) {
        const options = {
          key: "rzp_test_bVfC0PJsvP9OUR",
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency,
          name: "Energy Exchange",
          description: `Subscription Payment for Plan ${selectedPlan}`,
          order_id: orderResponse.data.id,
          handler: async (response) => {
            const paymentData = {
              user: userId,
              order_id: orderResponse.data.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: orderResponse.data.amount,
              subscription: selectedPlanId,
            };

            try {
              const completeResponse = await dispatch(
                completeRazorpayPayment(paymentData)
              ).unwrap();
              if (completeResponse) {
                message.success("Payment successful! Subscription activated.");
                setIsProformaVisible(false);
                navigate("/consumer/energy-consumption-table");
              } else {
                message.error("Payment completion failed.");
              }
            } catch (error) {
              console.error("Error completing payment:", error);
              message.error("Payment completion failed.");
            }
          },
          prefill: {
            name: userData?.name || "User ",
            email: userData?.email || "user@example.com",
            contact: userData?.phone || "9999999999",
          },
          theme: { color: "#669800" },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error("Razorpay script not loaded");
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

  return (
    <div className="subscription-plans-container">
      <Title level={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        Choose Your Annual Subscription Plan
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {loading ? (
          <Spin size="large" />
        ) : (
          subscriptionPlan.map((plan) => (
            <Col key={plan.id} xs={24} sm={8} md={8}>
              <Card
                hoverable
                className={selectedPlanId === plan.id ? 'selected-plan' : ''}
                onClick={() => handleSelectPlan(plan.id, plan)}
                actions={[
                  <Button
                    type="primary"
                    block
                    size="small"
                    style={{ width: '160px' }}
                  >
                    Select Plan
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
          title="Generate Proforma Invoice"
          open={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            selectedPlan?.subscription_type === "LITE" || selectedPlan?.subscription_type === "PRO" ? (
              <Button key="generate" type="primary" onClick={handleGenerateProforma}>
                Generate Proforma
              </Button>
            ) : (
              <Button key="continue" type="primary" onClick={handleFreeContinue}>
                Continue
              </Button>
            )
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
          </Button>
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

      {isSubscriptionModalVisible && (
        <SubscriptionModal
          visible={isSubscriptionModalVisible}
          plan={selectedPlan}
          onClose={() => setIsSubscriptionModalVisible(false)}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;