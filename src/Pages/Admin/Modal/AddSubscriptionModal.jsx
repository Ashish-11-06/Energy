import React, { useState } from 'react';
import { Button, Modal, Card, Row, Col, Form, Input } from 'antd';

const initialPlans = [
  {
    id: 'free',
    title: 'EXT FREE Plan',
    price: 'NIL',
    validity: '7 days',
    features: ['Add Requirement', 'Matching IPP', 'Create optimized offering'],
    status: 'Closed',
  },
  {
    id: 'lite',
    title: 'EXT LITE Plan',
    price: '5 Lakh INR',
    validity: '180 days',
    features: ['FREE Plan +', 'Requirement', 'Finalize Transaction'],
    status: 'Active Subscription',
  },
  {
    id: 'pro',
    title: 'EXT PRO Plan',
    price: '10 Lakh INR',
    validity: '365 days',
    features: ['Lite Plan +', 'Requirement', 'Dashboard Analytics', 'PowerX subscription'],
    status: 'Select Plan',
  },
];

const PlanEditor = ({ visible, onCancel }) => {
  const [plans, setPlans] = useState(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();

  const handleCardClick = (plan) => {
    setSelectedPlan(plan);
    form.setFieldsValue({
      title: plan.title,
      price: plan.price,
      validity: plan.validity,
      features: plan.features.join(', '),
    //   status: plan.status,
    });
  };

  const handleSave = (values) => {
    const updatedPlans = plans.map((p) =>
      p.id === selectedPlan.id
        ? {
            ...p,
            title: values.title,
            price: values.price,
            validity: values.validity,
            // status: values.status,
            features: values.features.split(',').map((f) => f.trim()),
          }
        : p
    );
    setPlans(updatedPlans);
    setSelectedPlan(null);
  };

  return (
    <Modal
      title="Edit Subscription Plans"
      visible={visible}
      onCancel={() => {
        setSelectedPlan(null);
        onCancel();
      }}
      footer={null}
      width={1000}
    >
      {!selectedPlan ? (
        <Row gutter={16} justify="center">
          {plans.map((plan) => (
            <Col span={8} key={plan.id}>
<Card
  title={plan.title}
  headStyle={{ backgroundColor: '#669800', color: 'white', textAlign: 'center' }}
  hoverable
  onClick={() => handleCardClick(plan)}
  style={{
    cursor: 'pointer',
    marginBottom: '16px',
    height: '100%',
  }}
  bodyStyle={{
    height: '300px', // same height for all
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }}
>
  <div>
    <div style={{ textAlign: 'center', fontSize: '18px', marginBottom: '8px' }}>
      <strong>{plan.price}</strong>
      <div><b>Validity:</b> {plan.validity}</div>
    </div>
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {plan.features.map((f, i) => (
        <li key={i} style={{ marginBottom: '6px', color: '#4d4d4d' }}>✅ {f}</li>
      ))}
    </ul>
  </div>
  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
    <Button>Edit Plan</Button>
  </div>
</Card>


            </Col>
          ))}
        </Row>
      ) : (
        <>
          <h3>{selectedPlan.title}</h3>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Validity" name="validity" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Features (comma-separated)"
              name="features"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Input />
            </Form.Item> */}

        <Form.Item>
  <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
    Save
  </Button>
  <Button onClick={() => setSelectedPlan(null)}>Back</Button>
</Form.Item>

          </Form>
        </>
      )}
    </Modal>
  );
};

export default PlanEditor;
