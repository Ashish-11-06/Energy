/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, Avatar, Badge, List, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNotificationData } from "../../Redux/slices/consumer/notificationSlice";
import { BellOutlined, ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const NotificationP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(false);

  const userId = Number(JSON.parse(localStorage.getItem('user')).user.id);
  // console.log(userId);
  
  
  useEffect(() => {
      // Dispatch action to fetch notifications based on the retrieved requirement id
      setLoading(true);
      dispatch(getNotificationData(userId))
        .then(response => {
          // Assuming the response contains the notifications array
          setNotifications(response.payload); // Adjust based on your actual response structure
           if (response.payload.length < 1) {
                    message.error('No notifications available for this user');
                  }
                  
                  setLoading(false);
        })
        .catch(error => {
          // console.error("Error fetching notifications:", error);
        });
   
  }, [dispatch]);

  return (
//     <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
//       Notifications
//       </h1>
//       {/* <Title level={2} style={{ color: "#4B4B4B" }}>
//         Notifications
//       </Title> */}

//       <Row gutter={[16, 16]} justify="center">
//       {(Array.isArray(notifications) ? notifications : []).map((notification) => (
//   <Col span={24} key={notification.id}>
//     <Card
//       title={
//         <span style={{ fontSize: "18px", fontWeight: "500" }}>
//           Notification #{notification.title}
//         </span>
//       }
//       bordered={true}
//       style={{
//         width: "100%",
//         borderRadius: "8px",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         backgroundColor: "#ffffff",
//         height: "auto",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "14px",
//           color: "#555",
//           marginBottom: "10px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-start",
//           textAlign: "left",
//         }}
//       >
//         {/* <Text strong>From: {notification.user}</Text> */}
//         {/* Timestamp */}
//         <div style={{ marginTop: "10px" }}>
//           <Text strong>Timestamp: </Text>
//           <Text>{notification.timestamp}</Text>
//         </div>
//         <br />
//         {/* Message */}
//         <div>
//           <Text strong>Message: </Text>
//           <Text>{notification.message}</Text>
//           <Text>{notification.message?.demand}</Text> 
//         </div>
//       </div>
//     </Card>
//   </Col>
// ))}

//       </Row>
//     </div>

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

export default NotificationP;
