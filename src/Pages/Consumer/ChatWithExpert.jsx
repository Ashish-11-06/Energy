import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Row, Col, Card, Space, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useMediaQuery from 'react-responsive'; // To detect screen size

const { Title } = Typography;

const ChatWithExpert = () => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasReplied, setHasReplied] = useState(false); // Track if the automated reply has been sent
  
  // Check if the screen is mobile size
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Handle sending message
  const handleSendMessage = () => {
    if (messageInput.trim() === '') {
      message.error('Please enter a message!');
      return;
    }
    
    const userMessage = { from: 'user', text: messageInput };

    // Add user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Add automated reply only once
    if (!hasReplied) {
      const automatedReply = {
        from: 'system',
        text: "Hi! Sorry for the inconvenience. Our chat expert is not available right now. Please drop your message. Thank you!",
      };
      setMessages((prevMessages) => [...prevMessages, automatedReply]);
      setHasReplied(true);
    }
    
    setMessageInput('');
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Chat area */}
      <Col span={isMobile ? 24 : 16} offset={isMobile ? 0 : 4}>
        <Card
          title="Expert Chat"
          bordered={false}
          style={{
            padding: '10px',
            maxHeight: '500px',
            overflowY: 'scroll',
            position: 'relative',
            height: '80vh',
          }}
        >
          <div className="chat-messages" style={{ padding: '10px', height: '80%' }}>
            {/* Display messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === 'user' ? 'right' : 'left',
                  marginBottom: '10px',
                }}
              >
                <Space direction={msg.from === 'user' ? 'horizontal' : 'vertical'}>
                  <div
                    style={{
                      background: msg.from === 'user' ? '#669800' : '#f0f0f0',
                      color: msg.from === 'user' ? '#fff' : '#000',
                      padding: '10px 25px 10px 10px',
                      borderRadius: '10px',
                      maxWidth: '100%',
                    }}
                  >
                    {msg.text}
                  </div>
                </Space>
              </div>
            ))}
          </div>
        </Card>

        {/* Input and Send Button */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '20px',
              marginBottom: '10px',
              marginTop: '10px',
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            style={{ width: '100%', padding: '10px', borderRadius: '20px' }}
          >
            Send
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ChatWithExpert;
