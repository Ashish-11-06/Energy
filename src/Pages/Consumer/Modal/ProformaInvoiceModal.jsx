import React, { useState, useEffect } from "react";
import { Modal, Button, Typography,message } from "antd";
import { useDispatch } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; 
import {
    createRazorpayOrder,
    completeRazorpayPayment,
  } from '../../../Redux/Slices/Consumer/paymentSlice'; // Import payment actions
const ProformaInvoiveModal = ({ open,onCancel,selectedPlan ,selectedPlanId }) => {
    const userData =JSON.parse(localStorage.getItem("user")).user;
 const userId=userData?.id;
 console.log(userId);
 
//   const user = JSON.parse(localStorage.getItem("user")).user;
//   console.log(user_category);
const dispatch=useDispatch();
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
    navigate("/consumer/energy-consumption-table");
  };

  const closeProforma = () => {
    setIsProformaVisible(false);
  };

  const htmlContent=`
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

        <div class="bank-details">
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
        </div>
    </div>
</body>
</html>


      `

  return (
  <Modal
          title="Proforma Invoice"
          open={open}
          
          onCancel={onCancel}
          footer={[
            selectedPlan?.subscription_type === "LITE" || selectedPlan?.subscription_type === "PRO" ? (
  
  
              <>
                <Button key="download" type="primary" onClick={handleDownloadPDF}>
                  Download PDF
                </Button>
                <Button key="generate" type="primary" onClick={handlePayment}>
                  Proceed to Payment
                </Button>
  
              </>
            ) : (
              <>
                <Button key="generate" type="primary" onClick={handleFreeContinue}>
                  Continue
                </Button>
  
              </>
            )
          ]}
          width={900}
          height={800}
        >
          {/* Replace this paragraph with the PDF content */}
          <div>
            {/* <h2>Proforma Invoice</h2> */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            <br /><br />
            <div>Please proceed to payment to complete your subscription.</div>
          </div>
        </Modal>
  );
};

export default ProformaInvoiveModal;
