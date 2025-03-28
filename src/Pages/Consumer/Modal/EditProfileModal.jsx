import React from "react";
import { Modal, Form, Input, Button, Row } from "antd";
// import { editUser } from "../../../Redux/Slices/userSlice";

const EditProfileModal = ({ isVisible, onCancel, onSave, initialValues }) => {
  return (
    <Modal
      title="Edit Profile"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={onSave}
        initialValues={initialValues}
      >
        <Form.Item
          label="Company Representative"
          name="company_representative"
        >
          <Input defaultValue={initialValues.company_representative} />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
        >
          <Input defaultValue={initialValues.company} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input defaultValue={initialValues.email} />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[
            {
              required: true,
              message: "Please input your mobile number!",
            },
            {
              pattern: /^[0-9]{10}$/,
              message: "Mobile number must be 10 digits!",
            },
          ]}
        >
          <Input defaultValue={initialValues.mobile} />
        </Form.Item>


        <Row justify="end">
          <Button onClick={onCancel} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
