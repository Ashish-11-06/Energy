import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Modal, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../SubscriptionPlan.css';

const { Title, Text } = Typography;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isQuotationVisible, setIsQuotationVisible] = useState(false);
  const [isProformaVisible, setIsProformaVisible] = useState(false); // State for proforma modal
  const [form] = Form.useForm(); // Form instance for validation
  const navigate = useNavigate(); // Hook for navigation

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsQuotationVisible(true); // Show the quotation view after selection
  };

  const closeQuotation = () => {
    setIsQuotationVisible(false);
    setSelectedPlan(null);
  };

  const renderQuotation = () => (
    <Form form={form} layout="vertical">
      <Row>
      <Col span={12}>
      <Form.Item
        label="Company Name"
        name="companyName"
        rules={[{ required: true, message: 'Please enter your company name' }]}
      >
        <Input />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item style={{marginLeft:'2%'}}
        label="GSTIN Number"
        name="gstinNumber"
        rules={[
          { required: true, message: 'Please enter your GSTIN number' },
          { pattern: /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, message: 'Please enter a valid GSTIN number' }
        ]}
      >
        <Input />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="Company Address"
        name="companyAddress"
        rules={[{ required: true, message: 'Please enter your company address' }]}
       
      >
        
        <Input.TextArea rows={2} /> {/* Increased height by using TextArea with 4 rows */}
      </Form.Item>
      </Col>
     
      </Row>
      <p>
        please provide additional details for generating proforma invoice - company name, company address, GSTIN no
        <br />
        remove download quotation button 
        <br />
        provide additional details 
        <br />
        notification triggered to Mail
      </p>
    </Form>

  );

  const handleGenerateProforma = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      setIsProformaVisible(true); // Show the proforma modal
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const closeProforma = () => {
    setIsProformaVisible(false);
  };

  // Handle payment done and navigate to the new page
  const handlePaymentDone = () => {
    // Navigate to the energy-consumption-table page after payment is done
    navigate('/consumer/energy-consumption-table');
  };

  return (
    <div className="subscription-plans-container">
      <Title level={2} style={{marginTop:'5%',marginBottom:'5%'}}>Choose Your Annual Subscription Plan</Title>
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
            <Text className="price">50,000 INR</Text>
            <ul>
              <li>Matching IPP +</li>
              <li>Requirements +</li>
              <li>Transaction window</li>
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
            <Text className="price">2,00,000 INR</Text>
            <ul>
              <li>Dashboard</li>
              <li>Advisory Support</li>
              <li>PowerX subscription</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Quotation View */}
      {isQuotationVisible && (
        <Modal
          title="Generate proforma invoice"
          open={isQuotationVisible}
          onCancel={closeQuotation}
          footer={[
            <Button key="button" onClick={handleGenerateProforma}>
              Generate Proforma
            </Button>,
          ]}
          width={600}
        >
          {renderQuotation()}
        </Modal>
      )}

      {/* Proforma Modal */}
      <Modal
        title="Proforma Invoice"
        open={isProformaVisible}
        onCancel={closeProforma}
        footer={[
          <Button key="button" onClick={handlePaymentDone}>
            Proceed to Payment
          </Button>,
        ]}
        width={600}
      >
        <p>This is a proforma invoice.</p>
        <p>Please proceed to payment to complete your subscription.</p>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;
