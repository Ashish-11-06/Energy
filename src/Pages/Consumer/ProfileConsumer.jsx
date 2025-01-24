import React, { useState } from "react";
import { Card, Row, Col, Typography, Avatar, Button } from "antd";
import EditProfileModal from "./Modal/EditProfileModal"; // Import the modal component

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")).user);

  const handleEditToggle = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = (values) => {
    setUserData(values);
    setIsModalVisible(false);
    localStorage.setItem("user", JSON.stringify({ user: values }));
  };

  return (
    <Row justify="center" style={{ marginTop: "50px" }}>
      <Col xs={24} sm={18} md={12} lg={10}>
        <Card bordered={true} style={{ borderRadius: "8px" }}>
          <Row justify="center" style={{ marginBottom: "20px" }}>
            <Avatar size={100} src="/src/assets/profile.jpg"  />
          </Row>
          <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
            User Profile
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>CIN Number:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.cin_number}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Company:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.company}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Representative:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.company_representative}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Email:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.email}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Mobile:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.mobile}</Text>
            </Col>
            <Col span={12}>
              <Text strong>User Category:</Text>
            </Col>
            <Col span={12}>
              <Text>{userData.user_category}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Subscription Plan:</Text>
            </Col>
            <Col span={12}>
              <Text>- to -</Text>
            </Col>
            
          </Row>
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={handleEditToggle}>
              Edit Profile
            </Button>
          </Row>
        </Card>

        {/* Modal for Editing User Details */}
        <EditProfileModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          onSave={handleSave}
          initialValues={userData}
        />
      </Col>
    </Row>
  );
};

export default ProfilePage;