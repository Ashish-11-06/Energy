import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import './SubscriptionPlan.css';

const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
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

        {/* Premium Plan */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title="Premium Plan"
            bordered
            hoverable
            className={selectedPlan === 'premium' ? 'selected-plan' : ''}
            onClick={() => handleSelectPlan('premium')}
            actions={[
              <Button type="primary" block size="small" style={{ width: '160px' }}>
                Select Plan
              </Button>,
            ]}
          >
            <Text className="price">$29.99 / month</Text>
            <ul>
              <li>Unlimited Users</li>
              <li>500GB Storage</li>
              <li>24/7 Support</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <div className="selected-plan-details">
          <Title level={4}>You have selected the {selectedPlan} plan</Title>
          <Text>
            {selectedPlan === 'basic' && 'Basic features with limited support.'}
            {selectedPlan === 'standard' && 'Great for small teams with moderate support.'}
            {selectedPlan === 'premium' && 'Best for large teams with full support.'}
          </Text>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
