// components/EditUser.js
import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const EditUser = ({ visible, onCancel, onUpdate, userData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue(userData);
    }
  }, [userData, form]);

  const handleFinish = (values) => {
    onUpdate({ ...userData, ...values });
    form.resetFields();
  };

  return (
    <Modal
      title="Edit Generator"
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Update"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={userData}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="City" name="city" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUser;
