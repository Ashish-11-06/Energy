/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, message, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import html2canvas from "html2canvas";
import LOGO from "../../../assets/EXG_green.png";
import jsPDF from "jspdf";
import {
  createRazorpayOrder,
  completeRazorpayPayment,
} from "../../../Redux/Slices/Consumer/paymentSlice"; // Import payment actions
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  fetchSubscriptionValidity,
  subscriptionEnroll,
} from "../../../Redux/Slices/Consumer/subscriptionEnrollSlice";

// Utility function to convert numbers to words
const numberToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " and " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + inWords(n % 100000) : "")
      );
    return (
      inWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + inWords(n % 10000000) : "")
    );
  };

  return num === 0 ? "Zero" : inWords(num);
};

const ProformaInvoiveModal = ({
  open,
  onCancel,
  selectedPlan,
  plan,
  selectedPlanId,
  fromSubscription,
}) => {
  const userData = JSON.parse(localStorage.getItem("user")).user;
  const userId = userData?.id;
  const companyName=userData?.company;
  //  const selectedPlan = fromSubscription ? selectedPlan : selectedPlan.subscription;
  // //  console.log(selected_plan);
  //  const invoiceDetails=selectedPlan;
const selectedRequirementId=localStorage.getItem('selectedRequirementId');
// console.log(selectedRequirementId);

  const [subscriptionPlanValidity, setSubscriptionPlanValidity] = useState([]);
  const navigate = useNavigate();

  //   const user = JSON.parse(localStorage.getItem("user")).user;
  //   console.log(user_category)ś;
  const dispatch = useDispatch();
  const handleDownloadPDF = async () => {
    const container = document.querySelector(".container"); // Select the main container
    if (!container) {
      console.error("Container element not found.");
      return;
      ś;
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
      // console.log("selectedPlanId", selectedPlan);

      const amount = selectedPlan?.subscription?.price;
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
            // console.log(select);
            const paymentData = {
              user: userId,
              invoice: selectedPlan.id,
              order_id: orderResponse.data.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: orderResponse.data.amount,
              subscription: selectedPlanId,
            };
            // console.log("payment data", paymentData);

            try {
              const completeResponse = await dispatch(
                completeRazorpayPayment(paymentData)
              ).unwrap();
              // console.log(completeResponse);

              if (completeResponse) {
                message.success("Payment successful! Subscription activated.");

                userData?.user_category === "Consumer"
                  ? navigate("/consumer/energy-consumption-table")
                  : navigate("/generator/update-profile-details");

                 const id=userId;
                try { const response =await dispatch(fetchSubscriptionValidity(id));
                setSubscriptionPlanValidity(response.payload);
                // console.log(response);
                localStorage.setItem(
                  "subscriptionPlanValidity",
                  JSON.stringify(response.payload)
                );
                } catch (error) {
                  message.error(error);
                  // console.log(error);
                  
                }

              
              } else {
                message.error("Payment completion failed.");
              }
            } catch (error) {
              console.error("Error completing payment:", error);
              message.error(error || "Payment completion failed.");
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

  const handleFreeContinue = () => {
    userData?.user_category === "Consumer"
      ? navigate("/consumer/energy-consumption-table")
      : navigate("/generator/update-profile-details");
  };

  const closeProforma = () => {
    setIsProformaVisible(false);
  };

  const htmlContent = `
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
        .header {
            display: flex;
            justify-content: flex-end; /* Align content to the right */
            align-items: flex-start;
            border: 1px solid #E6E8F1;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header h3 {
            color: #669800;
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
        }
        .header p {
            text-align: right;
            margin: 0;
        }
        .details, .payment-instructions, .bank-details {
            border: 1px solid #E6E8F1;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .details h3, .payment-instructions h3, .bank-details h3 {
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
        <div style="display: flex; align-items: center; justify-content: space-between; flex-direction: row;">
            <img src="${LOGO}" alt="Logo" style="height: 50px;" />
            <h2 style="flex-grow: 1; text-align: center;">${selectedPlan?.invoice_number}</h2>
        </div>
        <div class="header">
            <div>
                <h3>EXGGLOBAL</h3>
                <p>602, Avior, Nirmal Galaxy, Mulund (W),<br>Mumbai - 400080, Maharashtra, India.<br>Tel: +91 (22) 6142 6099<br>GSTIN: 27AAACQ4709P1ZZ</p>
            </div>
        </div>
<p style="text-align: left;">Invoice Date: <strong>${
    selectedPlan?.issue_date ?? "NA"
  }</strong></p>
<p style="text-align: left;">Due Date: <strong>${
    selectedPlan?.due_date ?? "NA"
  }</strong></p>

</strong></p>

        <div class="details">
            <h3>Invoiced To:</h3>
            <p><strong>${selectedPlan?.company_name ?? "NA"}</strong><br>
              Address: ${selectedPlan?.company_address ?? "NA"}<br>
              GSTIN: ${selectedPlan?.gst_number ?? "NA"}<br>
           </p>
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
                    <td>${
                      selectedPlan?.subscription?.subscription_type ?? "NA"
                    }</td>
                    <td>Upgrade</td>
                    <td>-</td>
                    <td>₹ ${selectedPlan?.subscription?.price ?? "NA"}</td>
                </tr>
                <tr>
                    <td>Discount </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td><strong>Sub Total</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>₹ ${
                      selectedPlan?.subscription?.price ?? "0"
                    }</strong></td>
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
                                <td>${selectedPlan?.cgst ?? "--"}</td>
                                <td>${selectedPlan?.sgst ?? "--"}</td>
                                <td>${selectedPlan?.igst ?? "--"}</td>
                            </tr>
                        </table>
                    </td>
                    <td>${
                      (selectedPlan?.cgst || 0) +
                      (selectedPlan?.sgst || 0) +
                      (selectedPlan?.igst || 0)
                    }</td>
                </tr>
                <tr>
                    <td><strong>Total Amount Incl. GST</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>${
                      selectedPlan?.total_amount ?? "0"
                    }</strong></td>
                </tr>
                <tr></tr>
                    <td>Total Amount Incl. GST (in words)</td>
                    <td colspan="3">₹ ${
                      selectedPlan?.subscription?.price ?? "0"
                    }</td>
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
                    <td><strong>₹ ${
                      selectedPlan?.subscription?.price ?? "0"
                    }</strong></td>
                </tr>
            </table>
        </div>

        <p><strong>Total Amount (in words):</strong>Rupees ${numberToWords(
          selectedPlan?.subscription?.price ?? 0
        )} only </p>
        <p style="text-align:right"><strong>Authorized Signatory</strong></p>
        <p style="font-size: 12px;">This is a computerized invoice. It does not require a signature.</p>
        
        <div class="payment-instructions">
            <h3>Payment Instructions:</h3>
            <ol>
                <li>Non-payment within 7 days will result in suspension of the services automatically without notice.</li>
                <li>Subject to Mumbai Jurisdiction.</li>
            </ol>
            <p>[Our services does not fall under negative list of services.]</p>
        </div>

        
    </div>
</body>
</html>


      `;

  return (
    <Modal
      title="Proforma Invoice"
      open={open}
      onCancel={onCancel}
      style={{ overflowY: 'auto', maxHeight: '85vh' }} // Added maxHeight: '70vh'
      footer={[
        selectedPlan?.subscription?.subscription_type === "LITE" ||
        selectedPlan?.subscription?.subscription_type === "PRO" ? (
          <>
            {selectedPlan?.payment_status === "Paid" ? (
              <>
                <Button
                  key="download"
                  type="primary"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
                {fromSubscription && (
                  <Tooltip
                    title={
                      !selectedRequirementId
                        ? "To continue further, select a requirement first."
                        : ""
                    }
                  >
                    <Button
                      key="generate"
                      type="primary"
                      onClick={handleFreeContinue}
                      disabled={!selectedRequirementId}
                    >
                      Continue
                    </Button>
                  </Tooltip>
                )}
              </>
            ) : (
              <>
                <Button
                  key="download"
                  type="primary"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
                <Button key="generate" type="primary" onClick={handlePayment}>
                  Proceed to Payment
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button key="download" type="primary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            {fromSubscription && (
              <Tooltip
                title={
                  !selectedRequirementId
                    ? "To continue further, select a requirement first."
                    : ""
                }
              >
                <Button
                  key="generate"
                  type="primary"
                  onClick={handleFreeContinue}
                  disabled={!selectedRequirementId}
                >
                  Continue
                </Button>
              </Tooltip>
            )}
          </>
        ),
      ]}
      width={900}
      height={800}
    >
      {/* Replace this paragraph with the PDF content */}
      <div>
        {/* <h2>Proforma Invoice</h2> */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <br />
        <br />
        <div>Please proceed to payment to complete your subscription.</div>
      </div>
    </Modal>
  );
};

export default ProformaInvoiveModal;

{
  /* <li>The Client is bound to all the rules and regulation available at <a href="https://www.qualispace.com/legal/">https://www.qualispace.com/legal/</a></li> */
}

{
  /* <div class="bank-details">
            <table>
                <tr>
                    <th colspan="3" style="text-align: center;">*For Indian Customers Only</th>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <th>Bank Details</th>
                    <th>UPI ID</th>
                    <th>Address</th>
                </tr>
                <tr>
                    <td>
                        <strong>Bank:</strong> ICICI Bank<br>
                        <strong>Account:</strong> Qualispace Web Services Pvt Ltd.<br>
                        <strong>Account no:</strong> 196805001050<br>
                        <strong>Branch:</strong> Patlipada Branch<br>
                        <strong>IFSC Code:</strong> ICIC0001968
                    </td>
                    <td>
                        <img src="upi-placeholder.png" alt="UPI QR Code" style="width: 100px; height: 100px;">
                    </td>
                    <td>
                        QualiSpace Webservices Pvt. Ltd.<br>
                        602 Avior Corporate park<br>
                        LBS Marg, Mulund West<br>
                        Mumbai 400080<br>
                        GSTIN: 27AAACQ4709P1ZZ<br>
                        PAN: AAACQ4709P<br>
                        Sales: 022 6142 6099<br>
                        Technical Support: 022 6142 604
                    </td>
                </tr>
            </table>
        </div> */
}
