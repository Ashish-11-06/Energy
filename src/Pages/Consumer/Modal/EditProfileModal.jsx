import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditProfileModal = ({ isVisible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue(initialValues);
      setFileList([]);
    }
  }, [isVisible, initialValues, form]);

  const beforeUpload = (file) => {
    const isPdfOrImage = file.type === 'application/pdf' || 
                         file.type === 'image/jpeg' || 
                         file.type === 'image/png';
    if (!isPdfOrImage) {
      message.error('You can only upload PDF, JPG, or PNG files!');
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
    }
    
    return isPdfOrImage && isLt5M ? true : Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = (values) => {
    onSave(values);
  };

  return (
    <Modal
      title="Edit Profile"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="company_representative"
          label="Company Representative"
          rules={[{ required: true, message: 'Please input company representative!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: 'Please input company name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="mobile"
          label="Mobile"
          rules={[{ required: true, message: 'Please input mobile number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="credit_rating"
          label="Credit Rating"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="proof"
          label="Credit Rating Proof"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;