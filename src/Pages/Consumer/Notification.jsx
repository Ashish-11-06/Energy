import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import ippData from "../../Data/IPPData.js";

const { Title, Text } = Typography;

const Notification = () => {
  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
      <Title level={2} style={{ textAlign: "center", color: "#4B4B4B" }}>
        IPP Details
      </Title>
      <Text
        style={{
          display: "block",
          textAlign: "center",
          fontSize: "16px",
          color: "#777",
        }}
      >
        This is the notification page visible only from 10 PM to 11 PM IST.
      </Text>
      <p
        style={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "600",
          color: "#4B4B4B",
        }}
      >
        These are the IPP details:
      </p>

      <Row gutter={[16, 16]} justify="center">
        {ippData.map((item) => (
          <Col span={12} key={item.key}>
            <Card
              title={
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  IPP {item.ipp}
                </span>
              }
              bordered={true}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
                height: "auto", // Adjusted to allow dynamic height based on content
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start", // Align content to the left
                  textAlign: "left", // Align text to the left
                }}
              >
                {/* First Row */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>Time:</strong> {item.time}
                  </p>
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>State:</strong> {item.states}
                  </p>
                </div>

                {/* Second Row */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>Capacity:</strong> {item.capacity}
                  </p>
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>Replacement:</strong> {item.replacement}
                  </p>
                </div>

                {/* Third Row */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <p style={{ marginRight: "20px", flex: "1" }}>
                    <strong>Per Unit Cost:</strong> ₹{item.perUnitCost}
                  </p>
                </div>
              </div>

              {/* Request Button */}
              <Button
                type="primary"
                block
                style={{
                  marginTop: "10px",
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  width: "100px",
                  alignSelf: "center",
                }}
              >
                Accept
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Notification;
