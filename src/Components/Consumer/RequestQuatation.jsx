import React from "react";
import { Form, Input, Select, Button, message, Modal } from "antd";

const RequestQuatation = ({ open, onCancel, capacity_of_solar_rooftop }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Add your request logic here
    message.success("Quotation request submitted!");
    form.resetFields();
    if (onCancel) onCancel();
  };

  return (
    <Modal
      title="Request Quotation"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          capacity: capacity_of_solar_rooftop,
        }}
      >
        <Form.Item
          label="Capacity (kWp/MW)*"
          name="capacity"
          rules={[
            { required: true, message: "Please enter capacity" },
            { pattern: /^[0-9.]+$/, message: "Enter a valid number" },
          ]}
        >
          <Input
            placeholder="Enter capacity (kWp/MW)"
            value={capacity_of_solar_rooftop}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Mode of Development"
          name="mode"
          rules={[{ required: true, message: "Please select mode" }]}
        >
          <Select placeholder="Select mode">
            <Select.Option value="CAPEX">CAPEX</Select.Option>
            <Select.Option value="RESCO">RESCO</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Send Quotation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestQuatation;
