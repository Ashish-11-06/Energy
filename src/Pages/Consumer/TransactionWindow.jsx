import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  message,
  InputNumber,
  Statistic,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import ippData from "../../Data/IPPData.js";
import {
  connectWebSocket,
  subscribeToEvent,
  sendEvent,
  disconnectWebSocket,
} from '../../Redux/api/webSocketService.js';

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const TransactionWindow = () => {
  const { transactionId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState({});
  const [isNegotiateModalVisible, setIsNegotiateModalVisible] = useState(false);
  const [offerValue, setOfferValue] = useState(null);
  const [sortedIppData, setSortedIppData] = useState([]);

  const navigate = useNavigate();
  // Access user category
  const user = JSON.parse(localStorage.getItem("user")).user;
  const userCategory = user?.user_category;

// console.log('transaction key', transactionId);


  const termSheetDetail = {
    ppa: "20",
    period: "10",
    commencement: "2025-01-10",
    energy: "20",
    supply: "18",
    payment: "30",
    paymentType: "Bank Guarantee",
  };

  useEffect(() => {
    console.log("Connecting to WebSocket...");
    connectWebSocket(user.id, transactionId);

    subscribeToEvent("offerUpdate", (data) => {
      console.log("Offer Update Received:", data);
      message.info(`Offer updated: ${data.message}`);
    });

    subscribeToEvent("negotiationResult", (data) => {
      console.log("Negotiation Result Received:", data);
      message.success(`Negotiation result: ${data.message}`);
    });

    return () => {
      console.log("Disconnecting WebSocket...");
      disconnectWebSocket();
    };
  }, [user.id, transactionId]);

  useEffect(() => {
    // Sort IPP data by ascending value of tariff offer
    const sortedData = [...ippData].sort((a, b) => a.perUnitCost - b.perUnitCost);
    setSortedIppData(sortedData);
  }, []);

  const handleView = (record) => {
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAcceptButton = (id) => {
    message.success(`Offer accepted of IPP ${id}`);
  };

  const handleRejectTransaction = () => {
    message.error(`Transaction ${transactionId} rejected`);
    navigate('/consumer/transaction-page');
  };

  const handleAccept = (key) => {
    message.success("Offer accepted");
    sendEvent("acceptOffer", { offerId: key });
    setButtonsDisabled((prev) => ({
      ...prev,
      [key]: { accept: true, reject: true, negotiate: true },
    }));
    setModalContent((prev) => ({ ...prev, status: "Accepted" }));
  };

  const handleReject = (key) => {
    message.error("Offer rejected");
    sendEvent("rejectOffer", { offerId: key });
    setButtonsDisabled((prev) => ({
      ...prev,
      [key]: { accept: true, reject: true, negotiate: true },
    }));
    setModalContent((prev) => ({ ...prev, status: "Rejected" }));
  };

  const handleNegotiate = (key) => {
    setIsNegotiateModalVisible(true);
    setModalContent((prev) => ({ ...prev, status: "Negotiated" }));
    setButtonsDisabled((prev) => ({
      ...prev,
      [key]: { ...prev[key], negotiate: true },
    }));
  };

  const handleSendOffer = () => {
    if (offerValue) {
      sendEvent("negotiateOffer", { offerId: modalContent.key, value: offerValue });
      message.success("Offer sent");
      setIsNegotiateModalVisible(false);
      setOfferValue(null);
    } else {
      message.error("Please enter a valid offer value");
    }
  };

  const handleOfferChange = (value) => {
    setOfferValue(value);
  };

  const deadline = Date.now() + 3600 * 1000; // 1 hour from now

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fb" }}>
      <Row gutter={[16, 16]} justify="center">
        <Card
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={2} style={{ textAlign: "center" }}>
            Term Sheet Details
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={8}><strong>Term of PPA (years): </strong>{termSheetDetail.ppa}</Col>
            <Col span={8}><strong>Lock-in Period (years): </strong>{termSheetDetail.period}</Col>
            <Col span={8}><strong>Commencement of Supply: </strong>{termSheetDetail.commencement}</Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col span={8}><strong>Contracted Energy (million units): </strong>{termSheetDetail.energy}</Col>
            <Col span={8}><strong>Minimum Supply Obligation (million units): </strong>{termSheetDetail.supply}</Col>
            <Col span={8}><strong>Payment Security (days):</strong>{termSheetDetail.payment}</Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col span={8}><strong>Payment Security Type:</strong> {termSheetDetail.paymentType}</Col>
          </Row>
          <Row justify="center" style={{ marginTop: "24px", marginLeft:'80%'}}>
            <Countdown title="Time Remaining" value={deadline} />
          </Row>
          {/* Conditionally render the "Negotiate Tariff" button for the Generator */}
          {userCategory === "Generator" && (
            <Row justify="end" style={{ marginTop: "24px" }}>
              <Button
                type="primary"
                onClick={() => setIsNegotiateModalVisible(true)}
              >
                Negotiate Tariff
              </Button>
            </Row>
          )}

          <div style={{ marginTop: "24px" }}>Offers from IPPs:</div>
          {sortedIppData.map((item) => (
            <Col span={24} key={item.key} style={{ marginTop: "16px" }}>
              <Card
                bordered
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Row justify="space-between" align="middle">
                  <span><strong>IPP {item.ipp}</strong></span>
                  <span><strong>Offer Tariff:</strong> {item.perUnitCost}</span>
                  <span><strong>Time:</strong> {item.time}</span>
                  <Button onClick={() => handleAcceptButton(item.ipp)}>Accept</Button>
                </Row>
              </Card>
            </Col>
          ))}
          <br /><br />
          <Button onClick={handleRejectTransaction}>Reject Transaction</Button>
        </Card>
      </Row>

      {/* View Modal */}
      <Modal
        title="Project Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[<Button key="close" onClick={handleCancel}>Close</Button>]}>
        {modalContent && (
          <>
            <Text>You have selected IPP {modalContent.key}</Text>
            <br />
            <Text>for offer tariff: {modalContent.perUnitCost}</Text>
            <br /><br />
            <Button onClick={() => handleAccept(modalContent.key)} disabled={buttonsDisabled[modalContent.key]?.accept}>
              Accept
            </Button>
            <Button onClick={() => handleReject(modalContent.key)} style={{ marginLeft: "8px" }} disabled={buttonsDisabled[modalContent.key]?.reject}>
              Reject
            </Button>
            <Button onClick={() => handleNegotiate(modalContent.key)} style={{ marginLeft: "8px" }} disabled={buttonsDisabled[modalContent.key]?.negotiate}>
              Negotiate
            </Button>
          </>
        )}
      </Modal>

      {/* Negotiate Modal */}
      <Modal
        title="Tariff Value"
        open={isNegotiateModalVisible}
        onCancel={() => setIsNegotiateModalVisible(false)}
        footer={[
          <Button key="send" type="primary" onClick={handleSendOffer}>
            Send Offer
          </Button>,
        ]}
      >
        <InputNumber
          placeholder="Enter your offer"
          value={offerValue}
          onChange={handleOfferChange}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default TransactionWindow;
