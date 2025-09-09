import React, { useState } from "react";
import { Form, Input, Radio, Button, message, Modal } from "antd";
import roofTop from "../../Redux/api/roofTop";

const RequestQuatation = ({ open, onCancel, capacity_of_solar_rooftop, rooftop_type, requirement }) => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        capacity: values.capacity,
        mode_of_development: values.mode,
        rooftop_type: rooftop_type,
        requirement_id: requirement?.id,
      };


      const response = await roofTop.requestQuotation(payload); 


      // message.success("Quotation sent to all the Generators!");
      message.success(response.data.message);
      form.resetFields();

      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error submitting quotation:", error.response.data.error);
      message.error(error.response.data.error || "Failed to submit quotation. Please try again.", 5);
    } finally {
      setLoading(false);
    }
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
          label="Capacity (kWp)"
          name="capacity"
          rules={[
            { required: true, message: "Please enter capacity" },
            { pattern: /^[0-9.]+$/, message: "Enter a valid number" },
          ]}
        >
          <Input
            placeholder="Enter capacity (kWp)"
            value={capacity_of_solar_rooftop}
            
          />
        </Form.Item>

        <Form.Item
          label="Mode of Development"
          name="mode"
          rules={[{ required: true, message: "Please select mode" }]}
        >
          <Radio.Group>
            <Radio value="CAPEX">CAPEX</Radio>
            <Radio value="RESCO">RESCO</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading}>
            Request Quotation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestQuatation;
