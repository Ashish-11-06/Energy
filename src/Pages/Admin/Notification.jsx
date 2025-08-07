import React, { useState, useEffect } from 'react';
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
  message,
} from 'antd';
import notificationApi from '../../Redux/Admin/api/notificationApi';
import consumerApi from '../../Redux/Admin/api/consumerApi';
import generatorApi from '../../Redux/Admin/api/generatorApi';

const { Option } = Select;
const { Title } = Typography;

const Notification = () => {
  const [type, setType] = useState('');
  const [userNumber, setUserNumber] = useState(null);
  const [userType, setUserType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (userType && userNumber === 'single_user') {
      fetchUserList();
    }
  }, [userType, userNumber]);

  const fetchUserList = async () => {
    try {
      let res;
      if (userType === 'Consumer') {
        res = await consumerApi.getConsumerList();
      } else if (userType === 'Generator') {
        res = await generatorApi.getGeneratorList();
      }
      if (res && res.status === 200 && Array.isArray(res.data)) {
        setUserList(res.data);
      } else {
        setUserList([]);
      }
    } catch {
      setUserList([]);
    }
  };

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let user_id = 'all';
      if (userNumber === 'single_user' && selectedUser) {
        user_id = selectedUser;
      }

      const payload = {
        user_id,
        user_category: userType,
        send_type: type,
        title: values.title || values.subject || '',
        message: values.message || values.content || '',
      };

      await notificationApi.addData(payload);
      message.success('Notification sent successfully');
      form.resetFields();
      setUserType(null);
      setUserNumber(null);
      setSelectedUser(null);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

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
              onChange={(val) => {
                setUserType(val);
                setSelectedUser(null);
                setUserNumber(null);
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
              onChange={(e) => {
                setUserNumber(e.target.value);
                setSelectedUser(null);
              }}
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
                loading={loading && userList.length === 0}
              >
                {userList.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.name || u.username || u.email || `${userType} ${u.id}`}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>

        {/* Form Inputs */}
        <Form form={form} layout="vertical">
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
              <Button type="primary" loading={loading} onClick={handleSend}>
                Send
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Notification;
