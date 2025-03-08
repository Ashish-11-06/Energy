import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotificationData } from "../../Redux/slices/consumer/notificationSlice";

const { Title, Text } = Typography;
const NotificationG = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]); // State to store notifications

  const userId = Number(JSON.parse(localStorage.getItem('user')).user.id);
  console.log(userId);
  
  
  useEffect(() => {
      // Dispatch action to fetch notifications based on the retrieved requirement id
      dispatch(getNotificationData(userId))
        .then(response => {
          // Assuming the response contains the notifications array
          setNotifications(response.payload); // Adjust based on your actual response structure
        })
        .catch(error => {
          console.error("Error fetching notifications:", error);
        });
   
  }, [dispatch]);

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
      <Title level={2} style={{ color: "#4B4B4B" }}>
        Notifications
      </Title>

      <Row gutter={[16, 16]} justify="center">
      {(Array.isArray(notifications) ? notifications : []).map((notification) => (
  <Col span={24} key={notification.id}>
    <Card
      title={
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Notification #{notification.title}
        </span>
      }
      bordered={true}
      style={{
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        height: "auto",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#555",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        {/* <Text strong>From: {notification.user}</Text> */}
        {/* Timestamp */}
        <div style={{ marginTop: "10px" }}>
          <Text strong>Timestamp: </Text>
          <Text>{notification.timestamp}</Text>
        </div>
        <br />
        {/* Message */}
        <div>
          <Text strong>Message: </Text>
          <Text>{notification.message}</Text>
          <Text>{notification.message?.demand}</Text> 
        </div>
      </div>
    </Card>
  </Col>
))}

      </Row>
    </div>
  );
};

export default NotificationG;
