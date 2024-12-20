import React from 'react';
import { Modal, Form, InputNumber, Button, DatePicker, Row, Col, Select } from 'antd';
import states from '../../../Data/States';

const AddPortfolioModal = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm(); // Ant Design form instance

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Add new entry to the portfolio (for simplicity, just call onAdd here)
      onAdd(values);
      form.resetFields(); // Reset the form after submission
      onClose(); // Close the modal
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title="Add New Portfolio Entry"
      open={visible} // Controlled by the parent component
      onCancel={onClose} // Close the modal when canceling
      footer={null} // Remove default footer
    >
      <Form form={form} layout="vertical" name="addPortfolioForm">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please select type!' }]}>
              <Select placeholder="Select Type">
                <Select.Option value="solar">Solar</Select.Option>
                <Select.Option value="wind">Wind</Select.Option>
                <Select.Option value="ess">ESS (Energy Storage System)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: 'Please select state!' }]}>
              <Select placeholder="Select State">
                {states.map((state) => (
                  <Select.Option key={state} value={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Energy Capacity (in kWh)"
              name="capacity"
              rules={[{ required: true, message: 'Please input energy capacity!' }, { type: 'number', message: 'Please enter a valid number!' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Energy Capacity in kWh"
                min={0} // Optionally, set a minimum value (0 for no negative capacity)
                onKeyDown={(e) => {
                  // Prevent letters and non-numeric characters
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="COD (Commercial Operation Date)"
              name="cod"
              rules={[{ required: true, message: 'Please select COD!' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit} style={{ width: '100%' }}>
            Add Entry
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPortfolioModal;
