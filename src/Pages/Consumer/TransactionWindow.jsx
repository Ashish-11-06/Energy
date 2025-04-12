/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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
  sendEvent,
  // disconnectWebSocket,
} from "../../Redux/api/webSocketService.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import time from "../../assets/time.png";
import moment from "moment";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const TransactionWindow = () => {
  const { transactionId } = useParams();
  const [modalContent, setModalContent] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState({});
  const [isNegotiateModalVisible, setIsNegotiateModalVisible] = useState(false);
  const [offerValue, setOfferValue] = useState(null);
  const [sortedIppData, setSortedIppData] = useState([]);
  const [timeUp, setTimeUp] = useState(false);
  const [messages, setMessages] = useState([]);
  const contentRef = useRef();
  const [socket, setSocket] = useState(null);
  const [offerAccepted, setOfferAccepted] = useState(false); // Track if an offer is accepted
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const role = userData?.role;
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")).user;
  const userCategory = user?.user_category;
  const record = location.state;

  console.log(record);

  // Assuming record.end_time is in the format "2025-04-11 18:00:00"
  const endDate = new Date(record.end_time);

  const end_time = endDate.getHours();     // e.g., 18
  const end_minutes = endDate.getMinutes(); // e.g., 0

  // Optional: start time
  const start_time = 10; // 10 AM
  const today = new Date();
  const startDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    start_time,
    0,
    0
  );
  const endDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    end_time,
    end_minutes,
    0
  ); // Set end time to 12:30 PM
  const deadline = endDateTime.getTime();
  console.log(deadline);

  useEffect(() => {
    const newSocket = connectWebSocket(user.id, record.tariff_id);
    setSocket(newSocket);

    const sendEvent = (action, data) => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.send(JSON.stringify({ action, ...data }));
      }
    };

    const onMessageHandler = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.action === "rejectTransaction") {
          setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
              transaction.window_id === data.transactionId
                ? { ...transaction, tariff_status: "Rejected" }
                : transaction
            )
          );
        } else if (data.offers) {
          setMessages([data.offers]);
        } else {
          const newOffers = data;
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];

            for (const offerKey in newOffers) {
              if (newOffers.hasOwnProperty(offerKey)) {
                const existingMessageIndex = updatedMessages.findIndex(
                  (msg) => msg[offerKey]
                );

                if (existingMessageIndex !== -1) {
                  updatedMessages[existingMessageIndex][offerKey] = {
                    ...updatedMessages[existingMessageIndex][offerKey],
                    ...newOffers[offerKey],
                  };
                } else {
                  updatedMessages.push({ [offerKey]: newOffers[offerKey] });
                }
              }
            }

            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    if (newSocket) {
      newSocket.onmessage = onMessageHandler;
    }

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const sortedData = [...ippData].sort(
      (a, b) => a.perUnitCost - b.perUnitCost
    );
    setSortedIppData(sortedData);
  }, []);

  const handleUser = (record) => {
    if (userCategory === "consumer") {
      message.success(`Offer sent to IPP ${record.ipp}`);
    } else {
      message.success(`Offer accepted of IPP ${record.ipp}`);
    }
  };

  const handleRejectTransaction = () => {
    Modal.confirm({
      title: "Are you sure you want to reject this transaction?",
      content: "It will not be visible to you again if rejected.",
      okText: "Yes, Reject",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await sendEvent({ action: "reject" });
          message.error("Transaction rejected");
          navigate("/transaction-page");
        } catch (error) {
          console.error("Error rejecting transaction:", error);
          message.error("Failed to reject the transaction. Please try again.");
        }
      },
    });
  };

  const handleAcceptOffer = () => {
    Modal.confirm({
      title: "Are you sure you want to accept this offer?",
      content: "It will not be visible to you again if accepted.",
      okText: "Yes, Accept",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await sendEvent({ action: "accept" });
          message.success("Offer accepted successfully");
          navigate("/transaction-page");
        } catch (error) {
          console.error("Error accepting offer:", error);
          message.error("Failed to accept the offer. Please try again.");
        }
      },
    });
  };


  const handleDownloadTransaction = async () => {
    const input = contentRef.current;

    // Temporarily hide the buttons
    const buttons = input.querySelectorAll(".red-btn, .download-btn");
    buttons.forEach((button) => (button.style.display = "none"));

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Restore the buttons
    buttons.forEach((button) => (button.style.display = ""));

    pdf.save("transaction_details.pdf");
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
      sendEvent("negotiateOffer", {
        offerId: modalContent.key,
        value: offerValue,
      });
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

  const handleAcceptBestOffer = async () => {
    if (messages.length === 0) {
      message.warning("No offers available to accept");
      return;
    }

    // Find the best offer (lowest tariff)
    let bestOffer = null;
    messages.forEach((messageObject) => {
      Object.keys(messageObject).forEach((msgKey) => {
        const msg = messageObject[msgKey];
        if (!bestOffer || msg.updated_tariff < bestOffer.updated_tariff) {
          bestOffer = msg;
        }
      });
    });

    if (bestOffer) {
      try {
        const response = await fetch("/api/acceptBestOffer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ offerId: bestOffer.id || bestOffer.generator_username }),
        });

        if (response.ok) {
          message.success(
            `Accepted offer from ${bestOffer.generator_username} at ${bestOffer.updated_tariff} INR/kWh`
          );
          sendEvent("acceptOffer", {
            offerId: bestOffer.id || bestOffer.generator_username,
          });
          setTimeUp(false); // Optionally hide the button after acceptance
        } else {
          message.error("Failed to accept the best offer. Please try again.");
        }
      } catch (error) {
        console.error("Error accepting the best offer:", error);
        message.error("An error occurred while accepting the best offer.");
      }
    }
  };

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setTimeUp(true); // Ensure timeUp is set to true when countdown completes
      return <Text style={{ color: "red" }}>Time's up!</Text>;
    }
    return (
      <span style={{ color: "red" }}>
        {hours}:{minutes}:{seconds}
      </span>
    );
  };

  return (
    <div style={{ padding: "30px" }} ref={contentRef}>
      <Row gutter={[16, 16]} justify="center">
        <Card
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <Title level={2} style={{ textAlign: "center" }}>
              Term Sheet Details
            </Title>
            <Row gutter={[16, 16]}>
              <Col
                style={{
                  fontSize: "larger",
                  color: "#9a8406",
                  background: "white",
                }}
                span={8}
              >
                Open Offer Tariff Value :{" "}
                <strong>
                  {record?.offer_tariff ? record.offer_tariff : 0}
                </strong>{" "}
                INR/kWh
              </Col>
              <Col span={8}>
                <strong>Term of PPA (years): </strong>
                {record.t_term_of_ppa}
              </Col>
              <Col span={8}>
                <strong>Lock-in Period (years): </strong>
                {record.t_lock_in_period}
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}>
                <strong>Contracted Energy (MW): </strong>
                {record.t_contracted_energy}
              </Col>
              <Col span={8}>
                <strong>Minimum Supply Obligation (million units): </strong>
                {record.t_minimum_supply_obligation}
              </Col>
              <Col span={8}>
                <strong>Payment Security (days):</strong>
                {record.t_payment_security_day}
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}>
                <strong>Commencement of Supply: </strong>
                {moment(record.t_commencement_of_supply).format("DD-MM-YYYY")}
              </Col>
              <Col span={8}>
                <strong>Payment Security Type:</strong>{" "}
                {record.t_payment_security_type}
              </Col>
            </Row>

            <Row
              justify="center"
              style={{
                marginTop: "24px",
                marginLeft: "80%",
                textAlign: "center",
              }}
            >
              <Col>
                <div style={{ color: "black", fontWeight: "bold" }}>
                  Time Remaining
                </div>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={time}
                    alt=""
                    style={{
                      height: "30px",
                      width: "30px",
                      filter:
                        "brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(7484%) hue-rotate(1deg) brightness(91%) contrast(119%)",
                    }}
                  />
                  {Date.now() < startDateTime.getTime() ? (
                    <Text style={{ color: "red" }}>
                      Countdown starts at 10:00 AM
                    </Text>
                  ) : (
                    <Countdown
                      value={deadline}
                      valueStyle={{ color: "red" }}
                      onFinish={() => setTimeUp(true)}
                      renderer={countdownRenderer}
                    />
                  )}
                </span>
              </Col>
            </Row>

            {timeUp && (
              <Card
                style={{
                  marginTop: "20px",
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>
                      The bidding time has ended. You can now accept the best
                      offer.
                    </Text>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      onClick={handleAcceptBestOffer}
                      style={{
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
                    >
                      Accept Best Offer
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            <div style={{ marginTop: "24px" }}>Offers from IPPs:</div>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#fff",
              borderRadius: "5px",
            }}
          >
            <Title level={3}>Offer tarrifs:</Title>
            {messages.length === 0 ? (
              <Text>No messages available.</Text>
            ) : (
              messages.map((messageObject, index) => {
                return Object.keys(messageObject).map((msgKey) => {
                  const msg = messageObject[msgKey];
                  if (msg && typeof msg === "object") {
                    const openOfferTariff = record.offer_tariff;
                    const tariffChange = openOfferTariff - msg.updated_tariff;
                    const percentageChange = (
                      (tariffChange / openOfferTariff) *
                      100
                    ).toFixed(2);
                    const isIncrease = tariffChange > 0;
                    return (
                      <Card
                        key={msg.id || index}
                        style={{ marginBottom: "10px", padding: "10px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text strong>
                            IPP ID:{" "}
                            <span style={{ fontSize: "larger" }}>
                              {msg.generator_username}
                            </span>
                          </Text>
                          <div>
                            <Text strong>
                              Offer Tariff:{" "}
                              <span
                                style={{ fontSize: "larger", color: "#9A8406" }}
                              >
                                {msg.updated_tariff} INR/kWh{" "}
                              </span>
                            </Text>
                            <Text
                              type={isIncrease ? "success" : "danger"}
                              style={{ marginLeft: "8px" }}
                            >
                              {isIncrease
                                ? `+${percentageChange}%`
                                : `${percentageChange}%`}
                            </Text>
                          </div>
                          <Text strong>
                            RE index:{" "}
                            <span >
                              {msg.generator_re_index ?? "NA"}
                            </span>
                          </Text>
                          <Text strong>
                            Time:{" "}
                            <span>
                              {moment(msg.timestamp).format("hh:mm A")}
                            </span>
                          </Text>

                          {Date.now() >= deadline && role !== "View" && (
                            <Button
                              type="primary"
                              onClick={() => handleAcceptOffer(msg)}
                            >
                              Accept
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  }
                  return null;
                });
              })
            )}
          </div>
          <br />
          <br />

          <Button
            className="red-btn"
            onClick={() => handleRejectTransaction(transactionId)}
          >
            Reject Transaction
          </Button>
          <Button
            className="download-btn"
            style={{ marginLeft: "20px" }}
            onClick={handleDownloadTransaction}
          >
            Download Transaction trill
          </Button>
        </Card>
      </Row>

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
