import React from "react";
import { Modal, Form, Input, Button, Row, Col, Select } from "antd";

const { Option } = Select;

const AddUserModal = ({ isVisible, onCancel, onSave, editableData, edit }) => {
  const [form] = Form.useForm();
  
  const handleFinish = (values) => {
    onSave(values); // Call the onSave function passed as a prop
    form.resetFields(); // Reset the form fields after saving
  };

  return (
    <Modal
      title="Add User"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Row gutter={16}>
          {/* Username */}
          <Col span={12}>
            <Form.Item
              label="Name of Company Representative"
              name="username"
              rules={[{ required: true, message: "Please input username" }]}
            >
              <Input placeholder="Enter username" style={{ backgroundColor: 'white' }} />
            </Form.Item>
          </Col>

          {/* Designation */}
          <Col span={12}>
            <Form.Item
              label="Designation"
              name="designation"
              rules={[{ required: true, message: "Please input designation" }]}
            >
              <Input
                placeholder="Enter designation"
                style={{ backgroundColor: 'white' }}
                defaultValue={edit ? editableData.designation : ""}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Role Dropdown */}
          <Col span={12}>
            <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select role" }]}>
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="user">User </Option>
                <Option value="manager">Manager</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Email */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Invalid E-mail!" },
                { required: true, message: "Please input your E-mail!" },
              ]}
            >
              <Input
                placeholder="Enter email"
                style={{ backgroundColor: 'white' }}
                 defaultValue={edit ? editableData.email : ""}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Mobile */}
          <Col span={12}>
            <Form.Item
              label="Mobile"
              name="mobile"
              rules={[
                { required: true, message: "Please input your mobile number!" },
                { pattern: /^[0-9]{10}$/, message: "Mobile number must be 10 digits!" },
              ]}
            >
              <Input type="number" placeholder="Enter mobile number" style={{ backgroundColor: 'white' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row justify="end">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUserModal;