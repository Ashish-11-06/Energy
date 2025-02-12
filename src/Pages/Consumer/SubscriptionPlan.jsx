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
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const [htmlContent, setHtmlContent] = useState(""); // State to hold HTML content for PDF

  const subscription = JSON.parse(
    localStorage.getItem("subscriptionPlanValidity")
  );
  const alreadySubscribed = subscription?.subscription_type;

  // console.log(subscription.subscription_type);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  const user_category = userData[0]?.user_category;
  const userId = userData[0]?.id;
  const Razorpay = useRazorpay();
  const [orderId, setOrderId] = useState(null);

  const handleSelectPlan = (id, plan) => {
    setSelectedPlan(plan);
    console.log(selectedPlan);
    
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
    navigate("/consumer/energy-consumption-table");
  };

  useEffect(() => {
    const fetchPerforma = async () => {
      try {
        const response = await dispatch(fetchPerformaById(userId)).unwrap();
        setPerformaResponse(response);
        console.log(response);
        
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

  const handleGenerateProforma = async () => {
    // Your existing logic to create the performa
    // After successfully creating the performa, set the HTML content
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
      setPerformaResponse(response);
      message.success("Performa invoice generated successfully!");
      setHtmlContent(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background-color: #F5F6FB;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: auto;
            border: 1px solid #E6E8F1;
            padding: 20px;
            background-color: #ffffff;
        }
        h2 {
            text-align: center;
            color: #669800;
        }
        .header, .details, .payment-instructions, .bank-details {
            border: 1px solid #E6E8F1;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header h3, .details h3, .payment-instructions h3, .bank-details h3 {
            color: #669800;
        }
        a {
            color: #9A8406;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
        }
        th, td {
            border: 1px solid #E6E8F1;
            padding: 8px;
        }
        th {
            background-color: #669800;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Proforma Invoice #102213</h2>
        <div class="header" style="text-align: right;">
            <h3>EXGGLOBAL</h3>
            <p>602, Avior, Nirmal Galaxy, Mulund (W),<br>Mumbai - 400080, Maharashtra, India.<br>Tel: +91 (22) 6142 6099<br>GSTIN: 27AAACQ4709P1ZZ</p>
        </div>
        <p style="text-align: left;">Invoice Date: <strong>03-02-2024</strong></p>
        <p style="text-align: left;">Due Date: <strong>--</strong></p>
        
        <div class="details">
            <h3>Invoiced To:</h3>
            <p><strong>STRATXG CONSULTING PRIVATE LIMITED</strong><br>
               ATTN: Somdev Singh Arya<br>
               201, 2nd floor, Sahil, Sher-e-Punjab, Andheri (E)<br>
               Mumbai, Maharashtra, 400093, India<br>
               GSTIN: 27ABCCS1178B1ZL</p>
        </div>

        <div class="details">
            <h3>Details:</h3>
            <table>
                <tr>
                    <th>Description</th>
                    <th>Item Type</th>
                    <th>SAC Code</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Microsoft 365 Business Basic - stratxg.com</td>
                    <td>Upgrade</td>
                    <td>-</td>
                    <td>₹ 527</td>
                </tr>
                <tr>
                    <td>Discount (DISC10 - 10.00%)</td>
                    <td>-</td>
                    <td>-</td>
                    <td>₹ -53</td>
                </tr>
                <tr>
                    <td><strong>Sub Total</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>₹ 474</strong></td>
                </tr>
                <tr>
                    <td>GST</td>
                    <td colspan="2">
                        <table>
                            <tr>
                                <th>CGST (9.00%)</th>
                                <th>SGST (9.00%)</th>
                                <th>IGST</th>
                            </tr>
                            <tr>
                                <td>₹ 43</td>
                                <td>₹ 43</td>
                                <td>-</td>
                            </tr>
                        </table>
                    </td>
                    <td>₹ 86</td>
                </tr>
                <tr>
                    <td><strong>Total Amount Incl. GST</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>₹ 560</strong></td>
                </tr>
                <tr></tr>
                    <td>Total Amount Incl. GST (in words)</td>
                    <td colspan="3">Rupees five hundred sixty only</td>
                </tr>
                <tr>
                    <td>Funds Applied</td>
                    <td>-</td>
                    <td>-</td>
                    <td>₹ 0</td>
                </tr>
                <tr>
                    <td><strong>Balance</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>₹ 560</strong></td>
                </tr>
            </table>
        </div>

        <p><strong>Total Amount (in words):</strong> Rupees five hundred sixty only</p>
        <p style="text-align:right"><strong>Authorized Signatory</strong></p>
        <p style="font-size: 12px;">This is a computerized invoice. It does not require a signature.</p>
        
        <div class="payment-instructions">
            <h3>Payment Instructions:</h3>
            <ol>
                <li>Non-payment within 7 days will result in suspension of the services automatically without notice.</li>
                <li>Subject to Mumbai Jurisdiction.</li>
                <li>The Client is bound to all the rules and regulation available at <a href="https://www.qualispace.com/legal/">https://www.qualispace.com/legal/</a></li>
            </ol>
            <p>[Our services does not fall under negative list of services.</p>
        </div>

       
    </div>
</body>
</html>


      `); // Set your HTML content here
      setIsProformaVisible(true);
      setIsQuotationVisible(false);
    } catch (error) {
      console.error("Failed to create performa:", error);
      message.error("Failed to generate Performa invoice. Please try again.");
    }
  };

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
                pattern:
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
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
                className={selectedPlanId === plan.id ? "selected-plan" : ""}
                onClick={() => {
                  if (plan.subscription_type !== alreadySubscribed) {
                    handleSelectPlan(plan.id, plan);
                  }
                }}
                actions={[
                  plan.subscription_type !== alreadySubscribed ? (
                    <Button
                      type="primary"
                      block
                      size="small"
                      style={{ width: "160px", fontSize:'16px' }}
                    >
                      Select Plan
                    </Button>
                  ) : (
                    <Button disabled style={{fontSize:'14px', height:'17px', width:'160px' }}>Subscribed</Button>
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
                  {plan.price} <p style={{ fontSize: "18px" }}>INR</p>
                </Text>
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
                        Matching IPP
                        {/* {user_category=='Consumer' ?  (
                        <p>Matching IPP +</p>
                        ) : ( <p>Matching Consumer</p>)
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
                          src={req}
                          alt=""
                          style={{
                            height: "15px",
                            width: "15px",
                            marginRight: "10px",
                          }}
                        />{" "}
                        Requirements +
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
                        Dashboard
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
                          src={trial}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Trial
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={trial}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Trial
                      </li>
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={trial}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4%",
                          }}
                        />{" "}
                        Trial
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
            selectedPlan?.subscription_type === "LITE" ||
            selectedPlan?.subscription_type === "PRO" ? (
              <Button
                key="generate"
                type="primary"
                onClick={handleGenerateProforma}
              >
                Generate Proforma
              </Button>
            ) : (
              <>
                <Button
                  key="generate"
                  type="primary"
                  onClick={handleGenerateProforma}
                >
                  Generate Proforma
                </Button>
              </>
            ),
          ]}
          width={600}
          height={600}
        >
          <p>(Please provide additional details)</p>
          {renderQuotation()}
        </Modal>
      )}

      <ProformaInvoiceModal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        handleDownloadPDF={handleDownloadPDF}
        handlePayment={handlePayment}
        handleFreeContinue={handleFreeContinue}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        selectedPlan={performa}
        selectedPlanId={selectedPlanId}
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