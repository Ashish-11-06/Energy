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
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import ippData from "../../Data/IPPData.js";
import {
  connectWebSocket,
  sendEvent,
  // disconnectWebSocket,
} from '../../Redux/api/webSocketService.js';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import time from '../../assets/time.png'
import moment from "moment";

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
  const contentRef = useRef();
  const [socket, setSocket] = useState(null); // Add this line to define the socket variable
  const [messages, setMessages] = useState([]); // Store incoming messages
  const [currentTime, setCurrentTime] = useState(Date.now()); // Track current time
 
  const location = useLocation();

  const navigate = useNavigate();
  
  const [deadline, setDeadline] = useState(null);

  // const { state } = location;  // this should contain your passed record

  // console.log(state);  // Check if the state is available here

  const user = JSON.parse(localStorage.getItem("user")).user;
  const userCategory = user?.user_category;
  const record = location.state;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // console.log("Connecting to WebSocket..." + user.id + record.tariff_id);
    const newSocket = connectWebSocket(user.id, record.tariff_id);
    setSocket(newSocket);

    console.log(newSocket, socket);

    const onMessageHandler = (event) => {
      console.log("📩 event jkjkjkjkjkjkjkjkjkj:", event);
      try {

        const data = JSON.parse(event.data); // Parse the JSON message
        console.log("ll", data);

        if (data.offers) {
          console.log("data.offers", data.offers);
          setMessages([data.offers]); // Append new message to state
        } else {
          const newOffers = data; // Assuming data is the new offers object
          console.log("newOffers", newOffers);
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages]; // Start with a copy of the previous messages

            // Iterate over the keys in the new offers
            for (const offerKey in newOffers) {
              if (newOffers.hasOwnProperty(offerKey)) {
                // Check if the key already exists in any of the existing messages
                const existingMessageIndex = updatedMessages.findIndex(msg => msg[offerKey]);

                if (existingMessageIndex !== -1) {
                  // Update the existing message
                  updatedMessages[existingMessageIndex][offerKey] = {
                    ...updatedMessages[existingMessageIndex][offerKey],
                    ...newOffers[offerKey],
                  };
                } else {
                  // If the key does not exist, you can choose to add it as a new message
                  updatedMessages.push({ [offerKey]: newOffers[offerKey] });
                }
              }
            }

            return updatedMessages; // Return the updated messages array
          });
        }
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    };

    if (newSocket) {
      // console.log("Subscribing to messages...");
      newSocket.onmessage = onMessageHandler;
    }

    return () => {
      // disconnectWebSocket();
    };
  }, []);

  // console.log(messages);

  useEffect(() => {
    // Sort IPP data by ascending value of tariff offer
    const sortedData = [...ippData].sort((a, b) => a.perUnitCost - b.perUnitCost);
    setSortedIppData(sortedData);
  }, []);


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRejectTransaction = () => {
    
    const messageToSend = {
      action: "reject",
    };

    // Send the message using the sendEvent function
    sendEvent("rejectOffer", messageToSend);

    message.error(`Transaction rejected`);
    navigate('/consumer/transaction-page');
  };

  const handleDownloadTransaction = async () => {
    const input = document.getElementById("transaction-page"); // Ensure the entire page is captured
    if (!input) {
      message.error("Error: Unable to capture transaction details.");
      return;
    }
  
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("transaction_details.pdf");
  
      message.success("Transaction details downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF.");
    }
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

  useEffect(() => {
    const calculatedDeadline = Date.now() + 60 * 1000; // 1 minute from now
    setDeadline(calculatedDeadline);
  }, []); // Runs only once on mount

  const handleAcceptOffer = (msg) => {
    // Construct the message object

    console.log(msg);
    const messageToSend = {
      action: "select_generator",
      selected_generator_id: msg.generator_id // Assuming msg.id contains the generator ID
    };

    // Send the message using the sendEvent function
    sendEvent("acceptOffer", messageToSend);

    // Optionally, you can also show a success message
    message.success("Offer accepted for generator ID: " + msg.id);
  };

  return (
    <div id="transaction-page" style={{ padding: "30px", backgroundColor: "" }}>
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
              <Col span={8}><strong>Term of PPA (years): </strong>{record.t_term_of_ppa}</Col>
              <Col span={8}><strong>Lock-in Period (years): </strong>{record.t_lock_in_period}</Col>
              <Col span={8}><strong>Commencement of Supply: </strong>{moment(record.t_commencement_of_supply).format('DD-MM-YYYY')}</Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}><strong>Contracted Energy (MW): </strong>{record.t_contracted_energy}</Col>
              <Col span={8}><strong>Minimum Supply Obligation (million units): </strong>{record.t_minimum_supply_obligation}</Col>
              <Col span={8}><strong>Payment Security (days):</strong>{record.t_payment_security_day}</Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col span={8}><strong>Payment Security Type:</strong> {record.t_payment_security_type}</Col>
            </Row>
            <Row justify="center" style={{ marginTop: "24px", marginLeft: '80%' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={time} alt="" style={{ height: '30px', width: '30px' }} />
                <Countdown title="Time Remaining" value={deadline} />
              </span>
            </Row>
            <div style={{ marginTop: "24px" }}>Offers from IPPs:</div>
          </div>

          <div style={{ marginTop: "20px", padding: "10px", background: "#fff", borderRadius: "5px" }}>
            <Title level={3}>Offer tarrifs:</Title>
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
                    if (msg && typeof msg === 'object') {
                      return (


                        <div>
                          <Card
                            key={msg.id || index}
                            style={{
                              marginBottom: "10px",
                              // padding: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-start" // Aligns text to start
                            }}
                          >
                            <div>
                              <Text strong>Event: </Text> {msg.generator_username} <br />
                              <Text strong>Offer Tariff: </Text> {msg.updated_tariff} INR/KWH <br />
                              <Text strong>Time: </Text> {moment(msg.timestamp).format("hh:mm A")}
                            </div>


                          </Card>
                          <div style={{
                            width: "98%", display: "flex", justifyContent: "flex-end",
                            transform: 'translateY(-60px)',
                            marginTop: "10px"
                          }}>
                            {/* Show Accept Offer button only if the deadline has passed */}
                          {currentTime >= deadline && (
                            <Button type="primary" onClick={() => handleAcceptOffer(msg)}>
                              Accept Offer
                            </Button>
                          )}
                          </div>
                        </div>

                      );
                    } else {
                      console.warn("Invalid message format:", messageObject);
                      return null; // Return null if the message format is invalid
                    }
                  });
                })
              )
            )}
          </div>

          <br /><br />

          <Button onClick={handleRejectTransaction}>Reject Transaction</Button>
          <Button style={{ marginLeft: '20px' }} onClick={handleDownloadTransaction}>Download Transaction trill</Button>
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

export default TransactionWindow;
