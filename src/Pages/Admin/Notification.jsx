import React, { useState, useEffect } from "react";
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
} from "antd";
import notificationApi from "../../Redux/Admin/api/notificationApi";
import consumerApi from "../../Redux/Admin/api/consumerApi";
import generatorApi from "../../Redux/Admin/api/generatorApi";

const { Option } = Select;
const { Title } = Typography;

const Notification = ({
  isModal = false,
  onClose = () => {},
  initialUserType = null,
  initialUserNumber = null,
  initialSelectedUser = null,
}) => {
  const [type, setType] = useState("");
  const [userNumber, setUserNumber] = useState(initialUserNumber);
  const [userType, setUserType] = useState(initialUserType);
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (userType && userNumber === "single_user") {
      setDropdownLoading(true);
      fetchUserList();
    } else {
      setUserList([]);
    }
  }, [userType, userNumber]);

  const fetchUserList = async () => {
    try {
      let res;
      if (userType === "Consumer") {
        res = await consumerApi.getConsumerList();
      } else if (userType === "Generator") {
        res = await generatorApi.getGeneratorList();
      }
      if (res && res.status === 200 && Array.isArray(res.data.results)) {
        setUserList(res.data.results);
      } else {
        setUserList([]);
      }
    } catch {
      setUserList([]);
    } finally {
      setDropdownLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let user_id = "all";
      // If opened from Consumer/Generator page for a single user, send only to that user
      if (initialSelectedUser) {
        user_id = initialSelectedUser;
      } else if (userNumber === "single_user" && selectedUser) {
        user_id = selectedUser;
      } else if (userNumber === "all_user" && userType && userList.length > 0) {
        user_id = userList.map((u) => u.id);
      }

      const payload = {
        user_id,
        user_category: userType,
        send_type: type,
        title: values.title || values.subject || "",
        message: values.message || values.content || "",
      };

      await notificationApi.addData(payload);
      message.success("Notification sent successfully");
      form.resetFields();
      setUserType(null);
      setUserNumber(null);
      setSelectedUser(null);
      if (isModal && typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  // Only apply modal logic if initialSelectedUser is set (from Consumer page)
  const isSingleConsumerModal = !!initialSelectedUser;

  return (
    <div
      style={{
        padding: isModal ? 0 : "40px",
        backgroundColor: isModal ? "transparent" : "#f5f5f5",
        minHeight: isModal ? "auto" : "90vh",
      }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: isModal ? "100%" : "90%",
          margin: isModal ? 0 : "0 auto",
          background: "#fff",
          boxShadow: isModal ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
          padding: isModal ? 0 : "40px",
        }}
      >
        {/* Header Section */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
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

        {/* Only show selected user info if initialSelectedUser is set */}
        {initialSelectedUser && (
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Title level={5}>
                {initialUserType === "Generator" ? "Selected Generator" : "Selected Consumer"}
              </Title>
              <Input
                value={
                  userList.find((u) => u.id === initialSelectedUser)?.name ||
                  userList.find((u) => u.id === initialSelectedUser)?.company_representative ||
                  userList.find((u) => u.id === initialSelectedUser)?.username ||
                  userList.find((u) => u.id === initialSelectedUser)?.email ||
                  `${initialUserType} ${initialSelectedUser}`
                }
                disabled
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        )}

        {/* Only show user selection controls if not opened from Consumer/Generator page */}
        {!initialSelectedUser && (
          <Row
            gutter={[16, 16]}
            style={{
              marginBottom: 16,
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Col span={12} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Title level={5} style={{ textAlign: "center", width: "100%" }}>Select User Category</Title>
              <Radio.Group
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setSelectedUser(null);
                }}
                style={{ display: "flex", gap: "16px", justifyContent: "center" }}
              >
                <Radio value="Consumer">Consumer</Radio>
                <Radio value="Generator">Generator</Radio>
              </Radio.Group>
            </Col>
          </Row>
        )}

        {/* Form Inputs */}
        <Form form={form} layout="vertical">
          {type === "email" ? (
            <>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: "Please enter a subject" }]}
              >
                <Input placeholder="Enter email subject" />
              </Form.Item>
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Please enter a message" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your message here"
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Enter notification title" />
              </Form.Item>
              <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: "Please enter content" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter notification content"
                />
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

