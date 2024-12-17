import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Modal } from 'antd';
import SubscriptionModal from './Modal/SubscriptionModal'; // Assuming this is for other subscription details
import '../SubscriptionPlan.css';

const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalVisible(true); // Optionally show a modal with more details
    setIsQuotationVisible(true); // Show the quotation view after selection
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

  const renderQuotation = () => {
    if (selectedPlan === 'basic') {
      return (
        <div>
          <Title level={3}>Quotation</Title>
          <p><strong>Plan:</strong> Basic Plan</p>
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
          <Title level={3}>Quotation</Title>
          <p><strong>Plan:</strong> Standard Plan</p>
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
            <li>Cancellation within 30 days for a full refund.</li>
            <li>Subject to terms of service.</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="subscription-plans-container">
      <Title level={2}>Choose Your Subscription Plan</Title>
      <Row gutter={[16, 16]} justify="center">
        {/* Basic Plan */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title="Basic Plan"
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
            title="Standard Plan"
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

      {/* Modal for Selected Plan Details */}
      <SubscriptionModal visible={isModalVisible} plan={selectedPlan} onClose={closeModal} />

      {/* Quotation View */}
      {isQuotationVisible && (
        <Modal
          title="Quotation"
          visible={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            <Button key="close" onClick={closeQuotation}>
              Close
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
