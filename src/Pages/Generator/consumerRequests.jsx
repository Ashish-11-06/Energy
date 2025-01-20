import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Modal, message } from "antd";
import ippData from "../../Data/IPPData.js";

const { Title } = Typography;

const ConsumerRequests = () => {
  const [tariffValues, setTariffValues] = useState(
    ippData.reduce((acc, item) => {
      acc[item.key] = item.perUnitCost;
      return acc;
    }, {})
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item for the modal
  const [requestStatus, setRequestStatus] = useState({}); // Track both accepted and rejected status

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleAccept = (key) => {
    message.success("Your request has been sent to consumer.");
    setRequestStatus((prevStatus) => ({
      ...prevStatus,
      [key]: "accepted", // Mark this particular card as accepted
    }));
    setIsModalVisible(false);
  };

  const handleReject = (key) => {
    message.error("You rejected the request");
    setRequestStatus((prevStatus) => ({
      ...prevStatus,
      [key]: "rejected", // Mark this particular card as rejected
    }));
    setIsModalVisible(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleValueChange = (key, newTariff) => {
    setTariffValues((prevValues) => ({
      ...prevValues,
      [key]: newTariff,
    }));
    console.log(`Updated Tariff for IPP ${key}:`, newTariff);
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
      <Title level={2} style={{ textAlign: "center", color: "#4B4B4B" }}>
        Consumer Requests
      </Title>

      <Button
        type="primary"
        style={{
          backgroundColor: "#1890ff",
          borderColor: "#1890ff",
          marginBottom: "2%",
          marginLeft: "80%",
        }}
        onClick={() => prompt("Enter tariff value::")}
      >
        Negotiate Tariff
      </Button>

      <Row gutter={[16, 16]} justify="center">
        {ippData.map((item) => (
          <Col span={6} key={item.key}>
            <Card
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Card
                onClick={() => handleModalOpen(item)}
                title={
                  <span style={{ fontSize: "18px", fontWeight: "500" }}>
                    Consumer {item.ipp}
                  </span>
                }
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ marginRight: "20px", flex: "1" }}>
                      <strong>Requirements:</strong> {item.capacity}
                    </p>
                  </div>
                </div>
              </Card>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal
        title="Terms and Conditions"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <p>Terms and Condition of Consumer</p>
        {selectedItem && (
          <>
            <Button
              key="accept"
              type="primary"
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                marginBottom: "2%",
                fontSize: "14px",
                display: "inline-block",
                width: "30%",
                textAlign: "center",
                padding: "1%",
              }}
              onClick={() => handleAccept(selectedItem.key)} // Pass the key to identify the card
              disabled={requestStatus[selectedItem.key] !== undefined} // Disable both buttons if any action is taken
            >
              {requestStatus[selectedItem.key] === "accepted" ? "Accepted" : "Accept"}
            </Button>
            <Button
              key="reject"
              type="primary"
              style={{
                backgroundColor: "#ff0000",
                borderColor: "#ff0000",
                marginBottom: "2%",
                marginLeft: "2%",
                fontSize: "14px",
                display: "inline-block",
                width: "30%",
                textAlign: "center",
                padding: "1%",
              }}
              onClick={() => handleReject(selectedItem.key)} // Pass the key to identify the card
              disabled={requestStatus[selectedItem.key] !== undefined} // Disable both buttons if any action is taken
            >
              {requestStatus[selectedItem.key] === "rejected" ? "Rejected" : "Reject"}
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ConsumerRequests;