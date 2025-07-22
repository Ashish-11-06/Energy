import React, { useEffect, useState } from 'react';
import { Button, Modal, Card, Row, Col, Form, Input } from 'antd';
import { editSubscriptionPlan, getSubscriptionPlan } from '../../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';
import { decryptData } from '../../../Utils/cryptoHelper';

const dummyFeatures = [
  'Add Requirement',
  'Matching IPP',
  'Create Optimized Offering',
  'Dashboard Analytics',
];

const PlanEditor = ({ visible, onCancel }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const userData = decryptData(localStorage.getItem('user'));
  const user = userData?.user;
  const [editLoading,setEditLoading] = useState(false);
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getSubscriptionPlan());
        if (response?.payload) {
          if (user?.user_category && Array.isArray(response.payload)) {
            const filteredPlans = response.payload
              .filter((plan) => plan.user_type === user.user_category)
              .map((plan) => ({
                ...plan,
                features: plan.description
                  ? plan.description.split(',').map((f) => f.trim())
                  : dummyFeatures,
              }));
            setPlans(filteredPlans);
            setLoading(false);
          } else {
            setPlans([]);
          }
        }
      } catch (err) {
        console.error('Error fetching plans', err);
        setPlans([]);
      }
    };

  const handleCardClick = (plan) => {
    setSelectedPlan(plan);
    form.setFieldsValue({
      id:plan.id,
      user_type:plan.user_type,
      subscription_type: plan.subscription_type,
      price: plan.price, // kept as number/string
      duration_in_days: plan.duration_in_days.toString(),
      description: plan.description || dummyFeatures.join(', '),
    });
  };

  const handleSave =async (values) => {
    // console.log('values',values);
    const data={
      discription:values.discription,
      duration_in_days:values.duration_in_days,
      price:values.price,
      subscription_type:values.subscription_type
    }
    // console.log('data ',data);
    setEditLoading(true);
    const response = await dispatch(editSubscriptionPlan({id:values?.id,data}));
    // console.log('response',response);
    if(response?.payload) {
      fetchPlan();
      setEditLoading(false);
    }
    const updatedPlans = plans.map((p) =>
      p.id === selectedPlan.id
        ? {
            ...p,
            subscription_type: values.title,
            price: values.price,
            duration_in_days: parseInt(values.validity),
            description: values.features,
          }
        : p
    );
    setPlans(updatedPlans);
    setSelectedPlan(null);
     setEditLoading(false);
  };



useEffect(() => {
fetchPlan();
},[dispatch, user?.user_category])

  return (
    <Modal
      title="Edit Subscription Plans"
      open={visible}
      onCancel={() => {
        setSelectedPlan(null);
        onCancel();
      }}
      footer={null}
  width={selectedPlan ? 600 : 1000}  // <-- conditional width here
    >

      {!selectedPlan ? (
        <Row gutter={16} justify="center">
          {Array.isArray(plans) &&
            plans.map((plan) => (
              <Col span={8} key={plan.id}>
                <Card
                  title={plan.subscription_type}
                  headStyle={{
                    backgroundColor: '#669800',
                    color: 'white',
                    textAlign: 'center',
                  }}
                  hoverable
                  onClick={() => handleCardClick(plan)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '16px',
                    height: '100%',
                  }}
                  bodyStyle={{
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>
                        {parseFloat(plan.price).toLocaleString('en-IN')} INR
                      </strong>
                      <div>
                        <b>Validity:</b> {plan.duration_in_days} days
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {(Array.isArray(plan.features) ? plan.features : []).map((f, i) => (
                        <li key={i} style={{ marginBottom: '6px', color: '#4d4d4d' }}>
                          ✅ {f}
                        </li>
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
        <div style={{  margin: '0 auto' }}>
          <h3>{selectedPlan.subscription_type}</h3>
          <Form form={form} layout="vertical" onFinish={handleSave} >
            <Form.Item label="Subscription Type" name="subscription_type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
<Form.Item name="id" hidden>
  <Input />
</Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <Input addonAfter="INR" type="number" />
            </Form.Item>

            <Form.Item label="Validity (in days)" name="duration_in_days" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Features (comma-separated)"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 20 }} loading={editLoading}> 
                Save
              </Button>
              <Button onClick={() => setSelectedPlan(null)}>Back</Button>
            </Form.Item>
          </Form>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PlanEditor;
