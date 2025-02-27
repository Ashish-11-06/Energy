// import React, { useState } from 'react';
// import { Layout, Typography, Input, Button, Row, Col, Card, Space, message } from 'antd';
// import { SendOutlined } from '@ant-design/icons';
// import useMediaQuery from 'react-responsive';

// const { Title } = Typography;

// const ChatWithExpert = () => {
//   const [messageInput, setMessageInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [hasReplied, setHasReplied] = useState(false);

//   const isMobile = useMediaQuery({ maxWidth: 768 });

//   const handleSendMessage = () => {
//     if (messageInput.trim() === '') {
//       message.error('Please enter a message!');
//       return;
//     }

//     const userMessage = { from: 'user', text: messageInput };

//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     if (!hasReplied) {
//       const automatedReply = {
//         from: 'system',
//         text: "Hi! Sorry for the inconvenience. Our chat expert is not available right now. Please drop your message. Thank you!",
//       };
//       setMessages((prevMessages) => [...prevMessages, automatedReply]);
//       setHasReplied(true);
//     }

//     setMessageInput('');
//   };

//   return (
    // <Row gutter={[16, 16]}>
    //   <Col span={isMobile ? 24 : 16} offset={isMobile ? 0 : 4}>
    //     <Card
    //       bordered={false}
    //       style={{
    //         boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    //         borderRadius: '12px',
    //         overflow: 'hidden',
    //         height: '85vh',
    //       }}
    //     >
    //       <div
    //         style={{
    //           background: 'linear-gradient(to bottom, #f7f9fc,rgb(237, 251, 232))',
    //           padding: '16px',
    //           height: '70vh',
    //           overflowY: 'auto',
    //           borderBottom: '1px solid #d9d9d9',
    //         }}
    //       >
    //         {messages.map((msg, index) => (
    //           <div
    //             key={index}
    //             style={{
    //               textAlign: msg.from === 'user' ? 'right' : 'left',
    //               marginBottom: '16px',
    //               display: 'flex',
    //               justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
    //             }}
    //           >
    //             <div
    //               style={{
    //                 background: msg.from === 'user' ? '#7ca61b' : '#f1f1f1',
    //                 color: msg.from === 'user' ? '#fff' : '#000',
    //                 padding: '12px 16px',
    //                 borderRadius: '18px',
    //                 boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    //                 maxWidth: '70%',
    //                 wordWrap: 'break-word',
    //               }}
    //             >
    //               {msg.text}
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       <div
    //         style={{
    //           padding: '16px',
    //           display: 'flex',
    //           gap: '12px',
    //           background: '#fff',
    //           borderTop: '1px solid #d9d9d9',
    //         }}
    //       >
    //         <Input
    //           value={messageInput}
    //           onChange={(e) => setMessageInput(e.target.value)}
    //           placeholder="Type your message..."
    //           style={{
    //             flex: 1,
    //             padding: '12px 16px',
    //             borderRadius: '24px',
    //             border: '1px solid #d9d9d9',
    //             fontSize: '14px',
    //           }}
    //         />
    //         <Button
    //           type="primary"
    //           icon={<SendOutlined />}
    //           onClick={handleSendMessage}
    //           style={{
    //             borderRadius: '24px',
    //             padding: '0 24px',
    //             height: '40px',
    //             fontSize: '16px',
    //           }}
    //         >
    //           Send
    //         </Button>
    //       </div>
    //     </Card>
    //   </Col>
    // </Row>
//   );
// };

// export default ChatWithExpert;

import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Card, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import faqData from "../assets/data/faq.json"; // Adjust path as per your folder structure

const ChatWithExpert = () => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    setFaqData(faqData); // Directly set JSON data to state
  }, []);

  const findBestMatch = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();
    const foundAnswer = faqData.find(item => 
      lowerCaseInput.includes(item.question.toLowerCase())
    );
    
    return foundAnswer || null;
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") {
      message.error("Please enter a message!");
      return;
    }

    const userMessage = { from: "user", text: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const foundAnswer = findBestMatch(messageInput);

    const replyMessage = foundAnswer
      ? { from: "system", text: foundAnswer.answer }
      : { from: "system", text: "I'm not sure. Please try rewording your question." };

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
    }, 500);

    setMessageInput("");
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={isMobile ? 24 : 16} offset={isMobile ? 0 : 4}>
        <Card
          bordered={false}
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            height: "85vh",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to bottom, #f7f9fc, rgb(237, 251, 232))",
              padding: "16px",
              height: "70vh",
              overflowY: "auto",
              borderBottom: "1px solid #d9d9d9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background: msg.from === "user" ? "#7ca61b" : "#f1f1f1",
                    color: msg.from === "user" ? "#fff" : "#000",
                    padding: "12px 16px",
                    borderRadius: "18px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "16px",
              display: "flex",
              gap: "12px",
              background: "#fff",
              borderTop: "1px solid #d9d9d9",
            }}
          >
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "24px",
                border: "1px solid #d9d9d9",
                fontSize: "14px",
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              style={{
                borderRadius: "24px",
                padding: "0 24px",
                height: "40px",
                fontSize: "16px",
              }}
            >
              Send
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChatWithExpert;
