import React from "react";
import { Modal, Form, Input, Button, Row, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditProfileModal = ({ isVisible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  // Synchronous getValueFromEvent for AntD
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  // Convert file to base64 and set in form
  const handleProofChange = async ({ file, fileList }) => {
    if (file.status === "removed") {
      form.setFieldsValue({ proof: [] });
      return;
    }
    if (fileList.length > 0) {
      const latestFile = fileList[0];
      if (!latestFile.originFileObj) {
        message.error("No file selected or file is invalid.");
        return;
      }
      const toBase64 = (fileObj) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileObj);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      try {
        const base64 = await toBase64(latestFile.originFileObj);
        latestFile.base64 = base64;
        form.setFieldsValue({ proof: [latestFile] });
      } catch (e) {
        message.error("Failed to read file. Please ensure the file is not corrupted and is less than 5MB.");
      }
    }
  };

  // On form submit, extract base64 and send to backend
  const handleFinish = (values) => {
    let base64Proof = null;
    if (values.proof && values.proof.length > 0 && values.proof[0].base64) {
      // Remove the prefix "data:...;base64," if needed
      const base64String = values.proof[0].base64;
      base64Proof = base64String.split(",")[1];
    }
    const payload = {
      ...values,
      proof: base64Proof,
    };
    onSave(payload);
  };

  return (
    <Modal
      title="Edit Profile"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item
          label="Company Representative"
          name="company_representative"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Company"
          name="company"
        >
          <Input />
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
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Credit Rating"
          name="credit_rating"
          rules={[
            {
              required: true,
              message: "Please input credit rating!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Proof"
          name="proof"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload proof document!",
            },
          ]}
        >
          <Upload
            beforeUpload={() => false}
            accept=".pdf,.doc,.docx"
            maxCount={1}
            onChange={handleProofChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
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
