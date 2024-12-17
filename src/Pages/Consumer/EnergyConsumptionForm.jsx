import React, { useState } from 'react';
import { Form, InputNumber, Button, Typography, Card } from 'antd';
import '../EnergyForm.css'; // Custom CSS for additional styling

const { Title } = Typography;

const EnergyConsumptionForm = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(null);

  const onFinish = (values) => {
    console.log('Form Values:', values);
    setFormValues(values); // Store the form data
  };

  return (
    <div className="energy-form-container">
      <Card style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }} bordered>
        <Title level={3} style={{ textAlign: 'center' }}>
          Energy Consumption Form
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            monthlyConsumption: '',
            peakConsumption: '',
            offPeakConsumption: '',
            monthlyBill: '',
          }}
        >
          {/* Monthly Consumption */}
          <Form.Item
            label="Monthly Consumption (kWh)"
            name="monthlyConsumption"
            rules={[
              { required: true, message: 'Please enter monthly consumption!' },
              { type: 'number', min: 0, message: 'Value must be positive!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter kWh" />
          </Form.Item>

          {/* Peak Consumption */}
          <Form.Item
            label="Peak Consumption (kWh)"
            name="peakConsumption"
            rules={[
              { required: true, message: 'Please enter peak consumption!' },
              { type: 'number', min: 0, message: 'Value must be positive!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter peak kWh" />
          </Form.Item>

          {/* Off-Peak Consumption */}
          <Form.Item
            label="Off-Peak Consumption (kWh)"
            name="offPeakConsumption"
            rules={[
              { required: true, message: 'Please enter off-peak consumption!' },
              { type: 'number', min: 0, message: 'Value must be positive!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter off-peak kWh" />
          </Form.Item>

          {/* Monthly Bill Amount */}
          <Form.Item
            label="Monthly Bill Amount ($)"
            name="monthlyBill"
            rules={[
              { required: true, message: 'Please enter monthly bill amount!' },
              { type: 'number', min: 0, message: 'Value must be positive!' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter bill amount in $" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>

        {/* Display Submitted Form Values */}
        {formValues && (
          <div className="submitted-values">
            <Title level={4}>Submitted Data:</Title>
            <ul>
              <li>
                <strong>Monthly Consumption (kWh):</strong> {formValues.monthlyConsumption}
              </li>
              <li>
                <strong>Peak Consumption (kWh):</strong> {formValues.peakConsumption}
              </li>
              <li>
                <strong>Off-Peak Consumption (kWh):</strong> {formValues.offPeakConsumption}
              </li>
              <li>
                <strong>Monthly Bill Amount ($):</strong> {formValues.monthlyBill}
              </li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnergyConsumptionForm;
