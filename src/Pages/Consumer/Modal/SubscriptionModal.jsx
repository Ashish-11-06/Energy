import React from 'react';
import { Modal, Typography, Button, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createRazorpayOrder, completeRazorpayPayment } from '../../../Redux/Slices/Consumer/paymentSlice'; // Import Redux actions

const { Title, Text } = Typography;

const SubscriptionModal = ({ visible, plan, onClose }) => {
  const dispatch = useDispatch();
console.log(plan);

  const handlePayment = async () => {
    try {
      // Define the amount based on the selected plan
      const amount = plan === 1 ? 50000 : plan === 2 ? 200000 : 0; // Adjust for different plans
      
      // Step 1: Create Razorpay order
      const orderResponse = await dispatch(createRazorpayOrder(amount)).unwrap();
  
      if (orderResponse && orderResponse.id) {
        // Step 2: Configure Razorpay options
        const options = {
          key: "rzp_test_bVfC0PJsvP9OUR",  // Replace with your Razorpay API key
          amount: orderResponse.amount,
          currency: "INR",  // Specify currency
          name: "Your Company Name",
          description: `Subscription Payment for Plan ${plan}`,
          order_id: orderResponse.id,  // Order ID returned from backend
          handler: async (response) => {
            // Step 3: Handle payment success and complete payment
            const paymentData = {
              order_id: orderResponse.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
  
            try {
              // Dispatch to complete the payment
              const completeResponse = await dispatch(completeRazorpayPayment(paymentData)).unwrap();
              if (completeResponse.success) {
                message.success("Payment successful! Subscription activated.");
                onClose();
                navigate("/consumer/energy-consumption-table");
              } else {
                message.error("Payment completion failed.");
              }
            } catch (error) {
              message.error("Payment completion failed.");
            }
          },
          prefill: {
            name: "Your Name",
            email: "your.email@example.com",
            contact: "9999999999",
          },
          theme: { color: "#669800" },  // Customize theme
        };
  
        // Step 4: Open Razorpay Checkout
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Payment Error:", error);
      message.error("Payment initiation failed. Please try again.");
    }
  };  

  return (
    <Modal
      title="Selected Plan Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <Title level={4}>{plan} Plan</Title>
        <Text>
          {plan === 'basic' && 'Basic features with limited support.'}
          {plan === 'standard' && 'Great for small teams with moderate support.'}
          {plan === 'premium' && 'Best for large teams with full support.'}
        </Text>

        <div style={{ marginTop: '20px' }}>
          <Title level={5}>Terms and Conditions</Title>
          <Text>
            By selecting this plan, you agree to our terms and conditions, including payment policies, cancellations, and data usage terms.
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            type="primary"
            size="large"
            style={{ width: '200px' }}
            icon={<CreditCardOutlined />}
            onClick={handlePayment}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
