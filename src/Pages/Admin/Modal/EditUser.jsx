// components/EditUser.js
import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

const EditUser = ({ visible, onCancel, onUpdate, userData, loading }) => {
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
      open={visible}
      confirmLoading={loading} // ✅ Use loading on Update button
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
        <Form.Item
          label="Name"
          name="company_representative"
          rules={[{ required: true, message: "Please enter name" }]}          
        >
          <Input disabled/>
        </Form.Item>

        <Form.Item
          label="Company Name"
          name="company"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input disabled/>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="mobile"
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^\d{10}$/,
              message: "Phone number must be exactly 10 digits",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUser;
