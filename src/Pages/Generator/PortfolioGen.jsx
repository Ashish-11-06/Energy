import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Modal, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const initialPortfolioData = {
  solar: "500 kW",
  wind: "300 kW",
  ess: "100 kWh",
};

const PortfolioGen = () => {
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEditModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = (values) => {
    setPortfolioData(values);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        title="Portfolio"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Solar Power Capacity:</Text>
            <p>{portfolioData.solar}</p>
          </Col>
          <Col span={12}>
            <Text strong>Wind Power Capacity:</Text>
            <p>{portfolioData.wind}</p>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Energy Storage Capacity (ESS):</Text>
            <p>{portfolioData.ess}</p>
          </Col>
        </Row>

        <Row justify="end">
          <Button
            
            type="primary"
            onClick={handleEditModal}
          >
            Edit Portfolio
          </Button>
        </Row>
      </Card>

      <Modal
        title="Edit Portfolio"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button key="cancel" onClick={handleCancelModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save Changes
          </Button>,
        ]}
      >
        <Form
          form={form}
          initialValues={portfolioData}
          onFinish={handleSave}
        >
          <Form.Item label="Solar Power" name="solar" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Wind Power" name="wind" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="ESS Capacity" name="ess" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PortfolioGen;
