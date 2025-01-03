import React, { useState } from 'react';
import { Form, Input, DatePicker, Row, Col, Select, Button, Upload, message } from 'antd';
import * as XLSX from 'xlsx'; // Import xlsx
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const UpdateProfileForm = ({ form }) => {
  const [fileList, setFileList] = useState([]);

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
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Form form={form} layout="vertical">
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
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Please input the capacity!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="totalInstallCapacity"
            label="Total Install Capacity"
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
            rules={[
              {
                required: form.getFieldValue('type') === 'ESS',
                message: 'Please input the capital cost!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="marginalCost"
            label="Marginal Cost"
            rules={[
              {
                required: form.getFieldValue('type') === 'ESS',
                message: 'Please input the marginal cost!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="yearOfCommissioning"
            label="Year of Commissioning"
            rules={[{ required: true, message: 'Please input the year of commissioning!' }]}
          >
            <DatePicker picker="year" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="cod"
            label="COD"
            rules={[{ required: true, message: 'Please input the COD!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
      >
        {({ getFieldValue }) =>
          getFieldValue('type') === 'Solar' || getFieldValue('type') === 'Wind' ? (
            <Row gutter={16}>
              {/* <Col span={12}>
                <Form.Item
                  name="hourlyData"
                  label="Hourly Data"
                  rules={[{ required: false, message: 'Please input the hourly data!' }]}
                >
                  <Input />
                </Form.Item>
              </Col> */}
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
          ) : getFieldValue('type') === 'ESS' ? (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="efficiencyOfStorage"
                  label="Efficiency of Storage"
                  rules={[{ required: true, message: 'Please input the efficiency of storage!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="efficiencyOfDispatch"
                  label="Efficiency of Dispatch"
                  rules={[{ required: true, message: 'Please input the efficiency of dispatch!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          ) : null
        }
      </Form.Item>

      {/* Download Excel Template Button */}
      <Button onClick={downloadExcelTemplate} type="primary" style={{ marginBottom: '16px' }}>
        Download Excel Template
      </Button>

      {/* Upload Excel File Button */}
      <Form.Item label="Upload Excel File">
        <Upload
          customRequest={handleFileUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false} // Prevent default upload behavior
        >
          <Button icon={<UploadOutlined />}>Upload Filled Excel Sheet</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfileForm;
