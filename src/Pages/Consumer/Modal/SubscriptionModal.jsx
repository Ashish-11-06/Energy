import React, { useState } from 'react';
import { Modal, Typography, Button } from 'antd';
import { CreditCardOutlined, FilePdfOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';

const { Title, Text } = Typography;

const SubscriptionModal = ({ visible, plan, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(plan);

  // Handle plan selection
  const handlePlanSelection = (selected) => {
    setSelectedPlan(selected);
  };

  // Generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Subscription Quotation', 20, 20);
    doc.text(`Plan: ${selectedPlan}`, 20, 30);

    if (selectedPlan === 'basic') {
      doc.text('Basic features with limited support.', 20, 40);
    } else if (selectedPlan === 'premium') {
      doc.text('Best for large teams with full support.', 20, 40);
    }

    doc.text('Terms and Conditions: By selecting this plan, you agree to our terms and conditions, including payment policies, cancellations, and data usage terms.', 20, 50);
    
    // Save the PDF
    doc.save('subscription_quotation.pdf');
  };

  return (
    <Modal
      title="Select a Plan"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        {/* Plan Selection */}
        <Button
          type={selectedPlan === 'basic' ? 'primary' : 'default'}
          style={{ width: '100%', marginBottom: '10px' }}
          onClick={() => handlePlanSelection('basic')}
        >
          Basic Plan
        </Button>
        <Button
          type={selectedPlan === 'premium' ? 'primary' : 'default'}
          style={{ width: '100%' }}
          onClick={() => handlePlanSelection('premium')}
        >
          Premium Plan
        </Button>

        {selectedPlan && (
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</Title>
            <Text>
              {selectedPlan === 'basic' && 'Basic features with limited support.'}
              {selectedPlan === 'premium' && 'Best for large teams with full support.'}
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
                style={{ width: '200px', marginRight: '10px' }}
                icon={<CreditCardOutlined />}
              >
                Proceed to Payment
              </Button>
              <Button
                type="default"
                size="large"
                style={{ width: '200px' }}
                icon={<FilePdfOutlined />}
                onClick={generatePDF}
              >
                Download Quotation
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
