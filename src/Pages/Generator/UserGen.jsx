import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Modal, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const initialUserData = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "123-456-7890",
  location: "New York, USA",
  status: "Active",
};

const UserGen = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEditModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = (values) => {
    setUserData(values);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        title="User Profile"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Name:</Text>
            <p>{userData.name}</p>
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text>
            <p>{userData.email}</p>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Phone:</Text>
            <p>{userData.phone}</p>
          </Col>
          <Col span={12}>
            <Text strong>Location:</Text>
            <p>{userData.location}</p>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Status:</Text>
            <p>{userData.status}</p>
          </Col>
        </Row>

        <Row justify="end">
          <Button
           
            type="primary"
            onClick={handleEditModal}
          >
            Edit Profile
          </Button>
        </Row>
      </Card>

      <Modal
        title="Edit User Profile"
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
          initialValues={userData}
          onFinish={handleSave}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserGen;
