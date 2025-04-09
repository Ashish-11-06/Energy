/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
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
  Spin
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import ippData from "../../Data/IPPData.js";
import {
  connectWebSocket,
  sendEvent,
} from '../../Redux/api/webSocketService.js';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import time from '../../assets/time.png'
import moment from "moment";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const TransactionWindowgen = () => {
  const { transactionId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState({});
  const [isNegotiateModalVisible, setIsNegotiateModalVisible] = useState(false);
  const [offerValue, setOfferValue] = useState(null);
  const [sortedIppData, setSortedIppData] = useState([]);
  const contentRef = useRef();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tariffValue, setTariffValue] = useState(null);

  const handleTariffChange = (value) => {
    setTariffValue(value);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const start_time = 10; // 10 AM
  const end_time = 11; // 11 AM
  const today = new Date();
  const startDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), start_time, 0, 0);
  const endDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), end_time, 0, 0);
  const deadline = endDateTime.getTime();

  const deadlineTime = () => {
    const now = Date.now();
    const remainingTime = deadline - now;
    return remainingTime <= 0 || now < startDateTime.getTime() ? 0 : remainingTime;
  };

  const user = JSON.parse(localStorage.getItem("user")).user;
  const userCategory = user?.user_category;
  const record = location.state;
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.user?.id;

  useEffect(() => {
    setIsLoading(true);
    const newSocket = connectWebSocket(user.id, record.tariff_id);
    setSocket(newSocket);

    const onMessageHandler = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.offers) {
          setMessages([data.offers]);
        } else {
          const newOffers = data;
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            for (const offerKey in newOffers) {
              if (newOffers.hasOwnProperty(offerKey)) {
                const existingMessageIndex = updatedMessages.findIndex(msg => msg[offerKey]);
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
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error parsing message:", error);
        setIsLoading(false);
      }
    };

    if (newSocket) {
      newSocket.onmessage = onMessageHandler;
      newSocket.onopen = () => setIsLoading(false);
      newSocket.onerror = () => setIsLoading(false);
    }

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user.id, record.tariff_id]);

  const handleSendTariff = () => {
    if (tariffValue !== null) {
      Modal.confirm({
        title: "Confirm Tariff Value",
        content: `Are you sure you want to send the tariff value: ${tariffValue} INR/kWh?`,
        onOk: () => {
          const messageToSend = {
            updated_tariff: tariffValue,
          };
          sendEvent(messageToSend);
          message.success("Tariff offer sent");
        },
        onCancel: () => {
          console.log("Tariff value sending cancelled");
        },
      });
    } else {
      message.error("Please enter a valid tariff value");
    }
  };

  useEffect(() => {
    const sortedData = [...ippData].sort((a, b) => a.perUnitCost - b.perUnitCost);
    setSortedIppData(sortedData);
  }, []);

  const handleUser = (record) => {
    if (userCategory === "consumer") {
      message.success(`Offer sent to IPP ${record.ipp}`);
    } else {
      message.success(`Offer accepted of IPP ${record.ipp}`);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRejectTransaction = () => {
    message.error(`Transaction ${transactionId} rejected`);
    navigate('/transaction-page');
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

  // const deadline = Date.now() + 3600 * 1000; // 1 hour from now



  return (
    <div style={{ padding: "30px", }}>
      <Row gutter={[16, 16]} justify="center">
        <Card
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div ref={contentRef}>
            <Title level={2} style={{ textAlign: "center" }}>
              Term Sheet Details
            </Title>
            <Row gutter={[16, 16]}>
              <Col style={{ fontSize: 'larger', color: '#9a8406', background: 'white' }} span={8}>Open Offer Tariff Value : <strong>{record?.offer_tariff ? record.offer_tariff : 0}</strong> INR/kWh</Col>
              <Col span={8}><strong>Term of PPA (years): </strong>{record.t_term_of_ppa}</Col>
              <Col span={8}><strong>Lock-in Period (years): </strong>{record.t_lock_in_period}</Col>
              {/* <Col span={8}><strong>Commencement of Supply: </strong>{moment(record.t_commencement_of_supply).format('DD-MM-YYYY')}</Col> */}
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}><strong>Contracted Energy (MW): </strong>{record.t_contracted_energy}</Col>
              <Col span={8}><strong>Minimum Supply Obligation (million units): </strong>{record.t_minimum_supply_obligation}</Col>
              <Col span={8}><strong>Payment Security (days):</strong>{record.t_payment_security_day}</Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}><strong>Commencement of Supply: </strong>{moment(record.t_commencement_of_supply).format('DD-MM-YYYY')}</Col>
              <Col span={8}><strong>Payment Security Type:</strong> {record.t_payment_security_type}</Col>
            </Row>

            <hr />

            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Combination Details</p>

            <Row gutter={[16, 16]}>

              <Col span={8}><strong>Solar Capacity (MW): </strong>{record.c_optimal_solar_capacity}</Col>
              <Col span={8}><strong>Wind Capacity (MW): </strong>{record.c_optimal_wind_capacity}</Col>
              <Col span={8}><strong>ESS Capacity (MWh): </strong>{record.c_optimal_battery_capacity}</Col>
            </Row>

            <Row justify="center" style={{ marginTop: "24px", marginLeft: '80%', textAlign: 'center' }}>
              <Col>
                <div style={{ color: 'black', fontWeight: 'bold' }}>Time Remaining</div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={time}
                    alt=""
                    style={{ height: '30px', width: '30px', filter: 'brightness(0) saturate(100%) invert(13%) sepia(85%) saturate(7484%) hue-rotate(1deg) brightness(91%) contrast(119%)' }}
                  />
                  {Date.now() < startDateTime.getTime() ? (
                    <Text style={{ color: 'red' }}>Countdown starts at 10:00 AM</Text>
                  ) : (
                    <Countdown value={deadline} valueStyle={{ color: 'red' }} />
                  )}                          </span>
              </Col>
            </Row>

            <div style={{
              color: '#9A8406',
              marginRight: '10px'
            }}>

              You can submit/update tariffs within the specified time frame. After one hour, the consumer will decide which offer to select.
            </div>

          </div>
          <div style={{ marginTop: "20px", padding: "10px", background: "#fff", borderRadius: "5px" }}>
            <Title level={3}>Your Offer:</Title>
            {messages.length === 0 ? (
              <Text>No messages available.</Text>
            ) : (
              messages
                .filter((messageObject) => Object.values(messageObject).some(msg => msg.generator_id === loggedInUserId))
                .map((messageObject, index) =>
                  Object.keys(messageObject).map((msgKey) => {
                    const msg = messageObject[msgKey];
                    if (msg && typeof msg === "object" && msg.generator_id === loggedInUserId) {
                      // Calculate percentage change for your offer
                      const openOfferTariff = record.offer_tariff;
                      const tariffChange = openOfferTariff - msg.updated_tariff;
                      const percentageChange = ((tariffChange / openOfferTariff) * 100).toFixed(2);
                      const isIncrease = tariffChange > 0;

                      return (
                        <Card
                          key={msg.id || index}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <Text strong>
                              IPP ID: <span style={{ fontSize: 'larger' }}>{msg.generator_username}</span>
                            </Text>

                            <div>
                              <Text strong>
                                Offer Tariff:{" "}
                                <span style={{ fontSize: "larger", color: "#9A8406" }}>
                                  {msg.updated_tariff} INR/kWh{" "}
                                </span>
                              </Text>
                              <Text type={isIncrease ? "success" : "danger"} style={{ marginLeft: "8px" }}>
                                {isIncrease ? `+${percentageChange}%` : `${percentageChange}%`}
                              </Text>
                            </div>

                            <Text strong>
                              Time: <span style={{ fontSize: 'larger' }}>{moment(msg.timestamp).format("hh:mm A")}</span>
                            </Text>
                          </div>
                        </Card>
                      );
                    }
                    return null;
                  })
                )
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <InputNumber
                  style={{ backgroundColor: "white", width: "150px" }}
                  placeholder="Enter tariff value"
                  value={tariffValue}
                  onChange={handleTariffChange}
                />
                <Button
                  onClick={handleSendTariff}
                  disabled={tariffValue === null || tariffValue <= 0}
                >
                  Send Tariff
                </Button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", padding: "10px", background: "#fff", borderRadius: "5px" }}>
            <Title level={3}>Other IPP offers:</Title>
            {messages.length === 0 ? (
              <Text>No messages available.</Text>
            ) : (
              messages.length === 0 ? (
                <Text>No messages available.</Text>
              ) : (
                messages.map((messageObject, index) => {
                  // Iterate over each key in the messageObject
                  return Object.keys(messageObject).map((msgKey) => {
                    const msg = messageObject[msgKey]; // Access the message using the key

                    // Validate the message object
                    if (msg && typeof msg === 'object' && msg.generator_id !== loggedInUserId) {
                      const openOfferTariff = record.offer_tariff; // Use backend-provided value
                      const tariffChange = openOfferTariff - msg.updated_tariff;
                      const percentageChange = ((tariffChange / openOfferTariff) * 100).toFixed(2);
                      const isIncrease = tariffChange > 0;
                      return (
                        <Card
                          key={msg.id || index}
                          style={{
                            marginBottom: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-start", // Aligns text to start
                          }}
                        >
                          <div>
                            <Text strong>
                              IPP ID : <span style={{ fontSize: 'larger' }}> {msg.generator_username}</span>
                            </Text>
                            {/* <Text style={{ margin: '150px' }} strong>
                              Offer Tariff : <span style={{ fontSize: 'larger', color: '#9A8406' }}>{msg.updated_tariff} INR/kWh </span>
                            </Text> */}

                            <div>
                              <Text strong>
                                Offer Tariff:{" "}
                                <span style={{ fontSize: "larger", color: "#9A8406" }}>
                                  {msg.updated_tariff} INR/kWh{" "}
                                </span>
                              </Text>
                              <Text type={isIncrease ? "success" : "danger"} style={{ marginLeft: "8px" }}>
                                {isIncrease ? `+${percentageChange}%` : `${percentageChange}%`}
                              </Text>
                            </div>

                            <Text strong>
                              Time : <span style={{ fontSize: 'larger' }}>{moment(msg.timestamp).format("hh:mm A")}</span>
                            </Text>
                          </div>
                        </Card>
                      );
                    } else {
                      // console.warn("Invalid message format:", messageObject);
                      return null; // Return null if the message format is invalid
                    }
                  });
                })
              )
            )}
          </div>
          <br /><br />

        </Card>

      </Row>

      {/* View Modal */}
      <Modal
        title="Project Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[<Button key="close" onClick={handleCancel}>Close</Button>]}>
        {modalContent && (
          <>
            <Text>You have selected IPP {modalContent.key}</Text>
            <br />
            <Text>for offer tariff: {modalContent.perUnitCost}</Text>
            <br /><br />
            {userCategory === "consumer" ? (
              <Button onClick={() => handleSendOffer(modalContent.key)} disabled={buttonsDisabled[modalContent.key]?.negotiate}>
                Send Offer
              </Button>
            ) : (
              <Button onClick={() => handleAccept(modalContent.key)} disabled={buttonsDisabled[modalContent.key]?.accept}>
                Accept
              </Button>
            )}
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

export default TransactionWindowgen;
