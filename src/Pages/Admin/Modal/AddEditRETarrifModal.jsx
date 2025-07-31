// /AddEditRETarrifModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const AddEditRETarrifModal = ({ visible, onClose, onSubmit, mode = 'add', initialValues = {} }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === 'edit') {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      onClose();
    } catch (err) {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={mode === 'edit' ? 'Edit RE Tariff Data' : 'Add RE Tariff Data'}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText={mode === 'edit' ? 'Update' : 'Add'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="industry"
          label="Industry"
          rules={[{ required: true, message: 'Industry is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="re_tariff"
          label="RE Tariff (₹/kWh)"
          rules={[{ required: true, message: 'Tariff is required' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} min={0} />
        </Form.Item>
        <Form.Item
          name="average_savings"
          label="Average Savings (₹)"
          rules={[{ required: true, message: 'Savings is required' }]}
        >
          <InputNumber style={{ width: '100%' }} step={1000} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditRETarrifModal;
