import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, Select, Button, Upload, message, Typography } from 'antd';
import * as XLSX from 'xlsx'; // Import xlsx
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const UpdateProfileForm = ({ form, project }) => {
  const selectedProject = JSON.parse(JSON.stringify(project, null, 2));
  const [fileList, setFileList] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  // Function to generate and download the blank Excel sheet
  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Hourly Data", "Annual Generation Potential (MWh)"]]); // Add headers as per your requirement
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");
  };

  // Function to handle file upload
  const handleFileUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setFilePreview(info.file.name);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        ...selectedProject,
        cod: selectedProject.cod ? dayjs(selectedProject.cod) : null, // Ensure date is formatted properly
        yearOfCommissioning: selectedProject.yearOfCommissioning ? dayjs(selectedProject.yearOfCommissioning) : null,
      });
    }
  }, [selectedProject, form]);

  const onSubmit = () => {
    form.validateFields()
      .then((values) => {
        console.log('Form Values:', values);
        message.success('Form submitted successfully!');
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
      });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        cod: selectedProject.cod ? dayjs(selectedProject.cod) : null, // Prefill COD field
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Technology"
            rules={[{ required: true, message: 'Please select the type!' }]}
          >
            <Select placeholder="Select type">
              <Option value="Solar">Solar</Option>
              <Option value="Wind">Wind</Option>
              <Option value="ESS">ESS</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'Please input the state!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Available Capacity"
            name="available_capacity"
            rules={[{ required: true, message: 'Please input the capacity!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="total_install_capacity"
            label="Total install capacity"
            rules={[{ required: true, message: 'Please input the total install capacity!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="capitalCost"
            label="Capital Cost"
            rules={[{ required: form.getFieldValue('type') === 'ESS', message: 'Please input the capital cost!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="marginalCost"
            label="Marginal Cost"
            rules={[{ required: form.getFieldValue('type') === 'ESS', message: 'Please input the marginal cost!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="cod"
            label="COD"
            rules={[{ required: true, message: 'Please input the COD!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="annualGenerationPotential"
            label="Annual Generation Potential (MWh)"
            rules={[{ required: false, message: 'Please input the annual generation potential!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <h3>Upload Hourly Generation Data</h3>
          <Text type="secondary">Please download the template, fill it with the hourly generation data, and then upload it here.</Text>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Download Excel Template Icon */}
        <Col span={3}>
          <Button onClick={downloadExcelTemplate} icon={<DownloadOutlined />} type="primary" style={{ width: '100%' }}>
            
          </Button>
        </Col>

        {/* Upload Excel File Icon */}
        <Col span={12}>
          <Upload
            customRequest={handleFileUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false} // Prevent default upload behavior
          >
            <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
              Upload Excel Sheet
            </Button>
          </Upload>
        </Col>
      </Row>

      {filePreview && (
        <Row gutter={16}>
          <Col span={24}>
            <Text type="secondary">Selected file: {filePreview}</Text>
          </Col>
        </Row>
      )}

      {/* Submit Button aligned to the right */}
      <Row gutter={16}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Button type="primary" onClick={onSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateProfileForm;
