import React, { useState } from "react";
import { Card, Avatar, Row, Col, Typography, Divider, Input, Button, Modal, Form } from "antd";

const { Title, Text } = Typography;

// Mock data for the consumer profile
const initialConsumerData = {
  name: "John Doe",
  role: "Consumer",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?img=4",
  address: "123 Main Street, Springfield, USA",
  phone: "+1 (555) 123-4567",
};

const ProfileConsumer = () => {
  const [consumerData, setConsumerData] = useState(initialConsumerData);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Toggle the modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditToggle = () => {
    showModal();
  };

  const handleSave = (values) => {
    setConsumerData(values);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Avatar
              size={100}
              src={consumerData.avatar}
              style={{ border: "2px solid #1890ff" }}
            />
          </Col>
          <Col xs={24} sm={16} md={18}>
            <Title level={3}>{consumerData.name}</Title>
            <Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
              Role: {consumerData.role}
            </Text>
            <Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>
              Email: {consumerData.email}
            </Text>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Address:</Text>
            <p>{consumerData.address}</p>
          </Col>
          <Col span={12}>
            <Text strong>Phone:</Text>
            <p>{consumerData.phone}</p>
          </Col>
        </Row>
        <Button type="primary" onClick={handleEditToggle} style={{ marginTop: '16px' }}>
          Edit Details
        </Button>
      </Card>

      {/* Modal for Editing User Details */}
      <Modal
        title="Edit Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          initialValues={consumerData}
        >
          <Form.Item
            label="Name"
            name="name"
          >
            <Input defaultValue={consumerData.name} />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
          >
            <Input defaultValue={consumerData.role} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input defaultValue={consumerData.email} />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input defaultValue={consumerData.address} />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input defaultValue={consumerData.phone} />
          </Form.Item>

          <Row justify="end">
            <Button onClick={handleCancel} style={{ marginRight: "10px" }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileConsumer;
