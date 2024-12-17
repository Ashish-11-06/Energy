// SubscriptionModal.js
import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SubscriptionModal = ({ visible, plan, onClose }) => {
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
            <Button type="primary" size="large" style={{ width: '200px' }}
             icon={<CreditCardOutlined />}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      
    </Modal>
  );
};

export default SubscriptionModal;
