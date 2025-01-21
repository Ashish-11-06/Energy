import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../SubscriptionPlan.css';

const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsQuotationVisible(true); // Show the quotation view after selection
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

  const renderQuotation = () => {
    if (selectedPlan === 'basic') {
      return (
        <div>
          <p><strong>Plan:</strong> Basic Plan [dummy] invoice will be shown</p>
          <p><strong>Price:</strong> $9.99 / month</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>1 User</li>
            <li>5GB Storage</li>
            <li>Basic Support</li>
          </ul>
          <p><strong>Terms and Conditions:</strong></p>
          <ul>
            <li>Monthly billing cycle.</li>
            <li>No refund policy.</li>
            <li>Subject to availability.</li>
          </ul>
        </div>
      );
    } else if (selectedPlan === 'standard') {
      return (
        <div>
          <p><strong>Plan:</strong> Standard Plan [dummy] invoice will be shown</p>
          <p><strong>Price:</strong> $19.99 / month</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>5 Users</li>
            <li>50GB Storage</li>
            <li>Priority Support</li>
          </ul>
          <p><strong>Terms and Conditions:</strong></p>
          <ul>
            <li>Monthly billing cycle.</li>
            <li>Subject to terms of service.</li>
          </ul>
        </div>
      );
    }
  };

  // Handle payment done and navigate to the new page
  const handlePaymentDone = () => {
    // Navigate to the energy-consumption-table page after payment is done
    navigate('/consumer/energy-consumption-table');
  };

  return (
    <div className="subscription-plans-container">
      <Title level={2}>Choose Your Subscription Plan</Title>
      <Row gutter={[16, 16]} justify="center">
        {/* Basic Plan */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title="EXT Lite Plan"
            bordered
            hoverable
            className={selectedPlan === 'basic' ? 'selected-plan' : ''}
            onClick={() => handleSelectPlan('basic')}
            actions={[
              <Button type="primary" block size="small" style={{ width: '160px' }}>
                Select Plan
              </Button>,
            ]}
          >
            <Text className="price">$9.99 / month</Text>
            <ul>
              <li>1 User</li>
              <li>5GB Storage</li>
              <li>Basic Support</li>
            </ul>
          </Card>
        </Col>

        {/* Standard Plan */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title="EXT Pro Plan"
            bordered
            hoverable
            className={selectedPlan === 'standard' ? 'selected-plan' : ''}
            onClick={() => handleSelectPlan('standard')}
            actions={[
              <Button type="primary" block size="small" style={{ width: '160px' }}>
                Select Plan
              </Button>,
            ]}
          >
            <Text className="price">$19.99 / month</Text>
            <ul>
              <li>5 Users</li>
              <li>50GB Storage</li>
              <li>Priority Support</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Quotation View */}
      {isQuotationVisible && (
        <Modal
          title="Quotation"
          open={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            <Button key="button">
              download quotation
            </Button>,
            <Button key="button" onClick={handlePaymentDone}>
              [dummy] payment done
            </Button>,
          ]}
          width={600}
        >
          {renderQuotation()}
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionPlans;
