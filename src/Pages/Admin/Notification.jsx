import React, { useState } from 'react';
import {
  Select,
  Input,
  Button,
  Form,
  Row,
  Col,
  Typography,
  Space,
  Card,
  Divider,
  Radio,
} from 'antd';

const { Option } = Select;
const { Title } = Typography;

const Notification = () => {
  const [type, setType] = useState(''); // 'email' or 'notification'
  const [userNumber, setUserNumber] = useState(null); // 'single_user' or 'all_user'
  const [userType, setUserType] = useState(null); // 'Consumer' or 'Generator'
  const [selectedUser, setSelectedUser] = useState(null); // To be populated via API

  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '90vh' }}>
      <Card
        bordered={false}
        style={{
          maxWidth: '90%',
          margin: '0 auto',
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Send Notification / Email
            </Title>
          </Col>
          <Col>
            <Select
              value={type || undefined}
              onChange={(val) => setType(val)}
              style={{ width: 200 }}
              placeholder="Select Type"
            >
              <Option value="email">Email</Option>
              <Option value="notification">Notification</Option>
            </Select>
          </Col>
        </Row>

        <Divider />

        {/* User Selection Section */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Title level={5}>Select User Category</Title>
            <Select
              value={userType}
              // allowClear
              onChange={(val) => {
                setUserType(val);
                setSelectedUser(null); // Reset selected user
              }}
              style={{ width: '100%' }}
              placeholder="Choose User Type"
            >
              <Option value="Consumer">Consumer</Option>
              <Option value="Generator">Generator</Option>
            </Select>
          </Col>

          <Col span={8}>
            <Title level={5}>Select User</Title>
            <Radio.Group
              onChange={(e) => setUserNumber(e.target.value)}
              value={userNumber}
              style={{ display: 'flex', gap: '16px' }}
            >
              <Radio value="single_user">Single {userType}</Radio>
              <Radio value="all_user">All {userType}</Radio>
            </Radio.Group>
          </Col>

          {userType && userNumber === 'single_user' && (
            <Col span={10}>
              <Title level={5}>Select {userType}</Title>
              <Select
                value={selectedUser}
                onChange={(val) => setSelectedUser(val)}
                style={{ width: '100%' }}
                placeholder={`Choose a ${userType}`}
              >
                {/* Dummy options for now */}
                <Option value="user1">{userType} 1</Option>
                <Option value="user2">{userType} 2</Option>
              </Select>
            </Col>
          )}
        </Row>

        {/* Form Inputs */}
        <Form layout="vertical">
          {type === 'email' ? (
            <>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Enter email subject" />
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please enter a message' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter your message here" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="Enter notification title" />
              </Form.Item>
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: 'Please enter content' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter notification content" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Space style={{ marginTop: 16 }}>
              <Button type="primary">Schedule</Button>
              <Button type="default">Send</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Notification;
