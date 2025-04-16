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
import { FormOutlined } from "@ant-design/icons";
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
import ProformaInvoiceModal from "./Modal/ProformaInvoiceModal";

import html2canvas from "html2canvas"; // Import html2canvas
import {
  createRazorpayOrder,
  completeRazorpayPayment,
} from "../../Redux/Slices/Consumer/paymentSlice"; // Import payment actions
import { subscriptionEnroll } from "../../Redux/Slices/Consumer/subscriptionEnrollSlice";
import { fetchSubscriptionPlan } from "../../Redux/Slices/Consumer/availableSubscriptionSlice";
import { fetchSubscriptionPlanG } from "../../Redux/Slices/Generator/availableSubscriptionPlanG";
import jsPDF from "jspdf"; // Import jsPDF
import dash from "../../assets/dashboard.png";
import transaction from "../../assets/transaction.png";
import trial from "../../assets/trial.png";
import powerX from "../../assets/powerX.png";
import advice from "../../assets/advice.png";
import consumption from "../../assets/consumption.png";
import invoice from "../../assets/invoice.png";


const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false);
  const [performa, setPerformaResponse] = useState(null);
  const [form] = Form.useForm();
  const [formError, setFormError] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);

  const subscription = JSON.parse(
    localStorage.getItem("subscriptionPlanValidity")
  );
  const alreadySubscribed = subscription?.subscription_type;
  const time_remaining = alreadySubscribed === 'FREE' ? (() => {
    const endDate = new Date(subscription?.end_date);
  
    // Get current UTC time
    const nowUTC = new Date();
  
    // Convert to IST by adding 5 hours and 30 minutes
    const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
  
    const diffMs = endDate - nowIST; // Difference in milliseconds
    if (diffMs <= 0) return "Expired"; // Handle expiration
  
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    return `${days} days, ${hours} hours`;
  })() : ' ';
  

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  const user = JSON.parse(localStorage.getItem('user')).user;
  const user_category=user.user_category;
  const temp = user_category === 'Consumer' ? 'Matching IPP' : 'Find Consumer';
  const req=user_category === 'Consumer' ? 'Requirement' : 'Portfolio';
  const reque=user_category === 'Consumer' ? 'Requirement' : 'Capacity Sizing';
  // console.log(temp);
  
  
  // const user_category = userData[0]?.user_category;
  const userId = userData[0]?.id;
  const Razorpay = useRazorpay();
  const [orderId, setOrderId] = useState(null);

const companyName=userData[0]?.company;



  const handleSelectPlan = (id, plan) => {
    // console.log("Selected Plan ID:", id);
    // console.log("Selected Plan:", plan);
    
    setSelectedPlan(plan);
    // console.log('selected plan',selectedPlan);

    // const currentDate = moment().format("YYYY-MM-DD");
    setSelectedPlanId(id);
    // const subscriptionData = {
    //   user: userId,
    //   subscription: id,
    //   start_date: currentDate,
    // };
    // const response = dispatch(subscriptionEnroll(subscriptionData));
    setIsQuotationVisible(true);
  };

  // console.log('id',performa);

  const closeQuotation = () => {
    setIsQuotationVisible(false);
  };

  useEffect(() => {
    const fetchPerforma = async () => {
      try {
        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        setPerformaResponse(response);
        // console.log(response);

        // setCompanyName(response.company_name);
        // setGstinNumber(response.gst_number);
        // setCompanyAddress(response.company_address);
        setFormError(""); // Reset error on successful fetch
      } catch (err) {
        message.error(err.message || "Failed to fetch performa.");
      }
    };

    fetchPerforma();
  }, [dispatch, userId]);

  // console.log(performa);

  useEffect(() => {
    setLoading(true);
    if (user_category === "Consumer") {
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
// console.log(selectedPlan);
// console.log(subscriptionPlan);


  const handleGenerateProforma = async (values) => {
    // console.log(values);
    const performaData = {
      company_name: values.companyName,
      company_address: values.companyAddress,
      gst_number: values.gstinNumber,
      subscription: selectedPlanId, // Ensure selectedPlanId is coming from a controlled input
      // due_date: "2025-01-25",
    };
// console.log('performaData',performaData);

    try {
      const response = await dispatch(
        createPerformaById({ id: userId, performaData })
      ).unwrap();
      setPerformaResponse(response);
      message.success("Performa invoice generated successfully!");
      setIsProformaVisible(true);
      setIsQuotationVisible(false);
    } catch (error) {
      console.error("Failed to create performa:", error);
      message.error("Failed to generate Performa invoice. Please try again.");
    }
  };

  // const handleGenerateProforma = async () => {
  //   form.validateFields()
  //     .then(async (values) => {
  //       setFormError(""); // Reset any error message if the form is valid
  //       try {
  //       const res=  await handleCreatePerforma(values);
  //         setIsProformaVisible(true);
  //         setIsQuotationVisible(false);
  //         setIsContinueDisabled(false);
  //       } catch (error) {
  //         setFormError("Please fill in all required fields.");
  //       }
  //     })
  //     .catch((errorInfo) => {
  //       setFormError("Please fill in all required fields.");
  //     });
  // };

  const handleDownloadPDF = async () => {
    const container = document.querySelector(".container"); // Select the main container

    if (!container) {
      console.error("Container element not found.");
      return;
    }

    try {
      const canvas = await html2canvas(container, {
        scale: 2, // Increase scale for better resolution (adjust as needed)
        useCORS: true, // Important for images from different domains
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate scaling to fit canvas within A4
      const scaleFactor = Math.min(width / canvasWidth, height / canvasHeight);

      const scaledWidth = canvasWidth * scaleFactor;
      const scaledHeight = canvasHeight * scaleFactor;

      const xPos = (width - scaledWidth) / 2; // Center horizontally
      const yPos = 10; // Start with some top margin

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        xPos,
        yPos,
        scaledWidth,
        scaledHeight
      ); // Use JPEG for better compression

      pdf.save("proforma_invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF. Please try again.");
    }
  };

  const handlePayment = async () => {
    try {
      log("Selected Plan ID:", selectedPlanId);
      const amount = selectedPlanId === selectedPlanId ? 500000 : 1000000; // Adjust plan amount here
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
//  console.log('plan',selectedPlan);
//  console.log('id',selectedPlanId);
 
  return (
    <div className="subscription-plans-container">
      <Title level={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        Choose Your Annual Subscription Plan
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {loading ? (
          <Spin size="large" />
        ) : (
          subscriptionPlan?.map((plan) => (
            <Col key={plan.id} xs={24} sm={8} md={8}>
              <Card
                hoverable={!(alreadySubscribed === "PRO" || (alreadySubscribed === "LITE" && plan.subscription_type === "FREE"))}
                className={selectedPlanId === plan.id ? "selected-plan" : ""}
                style={{
                  cursor:
                    alreadySubscribed === "PRO" || (alreadySubscribed === "LITE" && plan.subscription_type === "FREE")
                      ? "pointer"
                      : "default",
                }}
                onClick={() => {
                  if (
                    !(alreadySubscribed === "PRO" || (alreadySubscribed === "LITE" && plan.subscription_type === "FREE")) &&
                    plan.subscription_type !== alreadySubscribed
                  ) {
                    handleSelectPlan(plan.id, plan);
                  }
                }}
                actions={[
                  alreadySubscribed === plan.subscription_type ? (
                    <Button
                      disabled
                      style={{
                        fontSize: "14px",
                        height: "17px",
                        width: "160px",
                      }}
                    >
                      Active Subscription
                    </Button>
                  ) : alreadySubscribed === "PRO" || (alreadySubscribed === "LITE" && plan.subscription_type === "FREE") ? (
                    <Button
                      disabled
                      style={{
                        fontSize: "14px",
                        height: "17px",
                        width: "160px",
                      }}
                    >
                      Closed
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      block
                      size="small"
                      style={{ width: "160px", fontSize: "16px" }}
                      onClick={() => handleSelectPlan(plan.id, plan)}
                    >
                      Select Plan
                    </Button>
                  ),
                ]}
              >
                <div
                  style={{
                    backgroundColor: "#669800",
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
                      EXT {plan.subscription_type} Plan
                    </span>
                  </p>
                  <hr />
                </div>
                <Text className="price">
                  {plan.subscription_type === "FREE" && plan.price === "0.00"
                    ? "NULL"
                    : `${Number(plan.price).toLocaleString("en-IN")}${plan.price !== 0 ? " INR" : ""}`}
                </Text>
                {plan.subscription_type === "FREE" && alreadySubscribed === "FREE" ? (
                  <p style={{fontSize:'12px'}}>Time Remaining: <span style={{color:'red'}}>{time_remaining}</span> </p>
                ) : (
                  null
                )}
                <p>
                  <strong>Duration:</strong> {plan.duration_in_days} days
                </p>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 0,
                    marginLeft: "30%",
                  }}
                >
                  {plan.subscription_type === "LITE" && (
                    <>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <FormOutlined
                          style={{ marginRight: "10px", color: "#669800" }}
                        />{" "}
                         {temp}
                        {/* {user_category=='Consumer' ?  (
                        <p>Matching IPP +</p>
                        ) : (<p>Matching Consumer</p>)
                      } */}
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={invoice}
                          alt=""
                          style={{
                            height: "15px",
                            width: "15px",
                            marginRight: "10px",
                          }}
                        />{" "}
                      {reque}
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={transaction}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Transaction window
                      </li>
                    </>
                  )}
                  {plan.subscription_type === "PRO" && (
                    <>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={dash}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Dashboard Analytics
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={advice}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Advisory Support
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={powerX}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        PowerX subscription
                      </li>
                    </>
                  )}
                  {plan.subscription_type === "FREE" && (
                    <>
                   
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={consumption}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                       Add {req}
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        {/* <img
                          src={trial}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                            
                        /> */}
                        <FormOutlined
                          style={{ marginRight: "10px", color: "#669800" }}
                        />{" "}
                        {" "}
                       {temp}
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={transaction}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Model Optimization
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
            <Button key="generate" type="primary" onClick={() => form.submit()}>
              Generate Proforma Invoice
            </Button>,
          ]}
          width={600}
        >
          <p>(Please provide additional details)</p>

          <Form
            form={form}
            onFinish={handleGenerateProforma} // Ensures form values are passed
            initialValues={{
              companyName: companyName, // Set initial value from a variable
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Please provide your company name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="GSTIN Number"
                  name="gstinNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please provide your GSTIN number",
                    },
                    {
                      pattern:
                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Please provide a valid GSTIN number",
                    },
                  ]}
                >
                  <Input />
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
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>

            {formError && (
              <Text type="danger" style={{ marginBottom: 20 }}>
                {formError}
              </Text>
            )}
          </Form>
        </Modal>
      )}

      <ProformaInvoiceModal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        handleDownloadPDF={handleDownloadPDF}
        handlePayment={handlePayment}
        plan={performa}
        selectedPlan={performa}
        selectedPlanId={selectedPlan?.id}
        fromSubscription={true}
      />

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

// <div class="bank-details">
// <table>
//     <tr>
//         <th colspan="3" style="text-align: center;">*For Indian Customers Only</th>
//     </tr>
//     <tr style="background-color: #f8f9fa;">
//         <th>Bank Details</th>
//         <th>UPI ID</th>
//         <th>Address</th>
//     </tr>
//     <tr>
//         <td>
//             <strong>Bank:</strong> ICICI Bank<br>
//             <strong>Account:</strong> Qualispace Web Services Pvt Ltd.<br>
//             <strong>Account no:</strong> 196805001050<br>
//             <strong>Branch:</strong> Patlipada Branch<br>
//             <strong>IFSC Code:</strong> ICIC0001968
//         </td>
//         <td>
//             <img src="upi-placeholder.png" alt="UPI QR Code" style="width: 100px; height: 100px;">
//         </td>
//         <td>
//             QualiSpace Webservices Pvt. Ltd.<br>
//             602 Avior Corporate park<br>
//             LBS Marg, Mulund West<br>
//             Mumbai 400080<br>
//             GSTIN: 27AAACQ4709P1ZZ<br>
//             PAN: AAACQ4709P<br>
//             Sales: 022 6142 6099<br>
//             Technical Support: 022 6142 604
//         </td>
//     </tr>
// </table>
// </div>
