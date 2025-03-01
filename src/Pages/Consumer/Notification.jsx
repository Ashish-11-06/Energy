import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, Spin, List, Avatar, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchNotificationById } from "../../Redux/Slices/Consumer/notificationSlice.js";
import { BellOutlined, MessageOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./Notification.css"; // Optional: Add custom CSS for additional styling
import moment from "moment";

const { Title, Text } = Typography;

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user")).user.id;

  useEffect(() => {
    setLoading(true);
    dispatch(fetchNotificationById(userId))
      .then((response) => {
        setNotifications(response.payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, [dispatch, userId]);

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "90vh" }}>
      <Title level={3} style={{   marginBottom: "24px" }}>
        <BellOutlined style={{ marginRight: "8px" }} />
        Notifications:
      </Title>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row justify="center">
          <Col
            style={{
              maxWidth: "100%",
              flex: '0 0 100%'
            }}
            xs={24} sm={20} md={16} lg={12}>
            <List
              itemLayout="horizontal"
              dataSource={Array.isArray(notifications) ? notifications : []}
              style={{
                alignItems: 'center',
              }}
              renderItem={(notification) => (
                <List.Item
                  style={{
                    marginBottom: "16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                    alignItems: 'center',
                  }}
                >
                  <List.Item.Meta
                     style={{
                      alignItems: 'center',
                    }}
                    avatar={
                      <Badge dot color={notification.read ? "transparent" : "#669800"}>
                        <Avatar
                          icon={<MessageOutlined />}
                          style={{ backgroundColor: "#669800" }}
                        />
                      </Badge>
                    }
                    // title={
                    //   <Text strong style={{ fontSize: "14px" }}>
                    //     Notification #{notification.id}
                    //   </Text>
                    // }
                    description={
                      <div>
                        <div style={{ marginBottom: "8px" }}>
                          <ClockCircleOutlined style={{ marginRight: "8px" }} />
                          <Text type="secondary">
                          {moment(notification.timestamp).format("DD-MM-YYYY, hh:mm:ss A")}
                          </Text>
                        </div>
                        <div>
                          <Text>{notification.message}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Notification;