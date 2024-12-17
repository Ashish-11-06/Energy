import React, { useState } from 'react';
import { Table, Typography, Card, Button, Form, InputNumber, Modal, Space, Select, Row, Col, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse'; // Library for CSV parsing
import '../EnergyTable.css';

const { Title } = Typography;

const EnergyConsumptionTable = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Show modal for adding data
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleAddData = (values) => {
    const newData = {
      key: dataSource.length + 1,
      month: values.month,
      ...values,
    };
    setDataSource([...dataSource, newData]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Table columns with fixed width for mobile responsiveness
  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      width: 100,
    },
    {
      title: 'Monthly Consumption (kWh)',
      dataIndex: 'monthlyConsumption',
      key: 'monthlyConsumption',
      width: 150,
    },
    {
      title: 'Peak Consumption (kWh)',
      dataIndex: 'peakConsumption',
      key: 'peakConsumption',
      width: 150,
    },
    {
      title: 'Off-Peak Consumption (kWh)',
      dataIndex: 'offPeakConsumption',
      key: 'offPeakConsumption',
      width: 150,
    },
    {
      title: 'Monthly Bill ($)',
      dataIndex: 'monthlyBill',
      key: 'monthlyBill',
      width: 120,
    },
  ];

  // Handle SCADA file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const csv = reader.result;
      Papa.parse(csv, {
        complete: (result) => {
          // Assuming the CSV file structure is known and consistent
          const scadaData = result.data;
          const formattedData = scadaData.map((row, index) => {
            return {
              key: index + 1,
              month: row[0], // Assuming first column is the month
              monthlyConsumption: parseFloat(row[1]),
              peakConsumption: parseFloat(row[2]),
              offPeakConsumption: parseFloat(row[3]),
              monthlyBill: parseFloat(row[4]),
            };
          });
          setDataSource(formattedData);
          message.success('SCADA file data loaded successfully');
        },
        header: false, // set to true if the CSV file contains headers
      });
    };
    reader.readAsText(file);
    return false; // Prevent automatic file upload
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    showUploadList: false, // Hide upload list as we manually handle the file
  };

  return (
    <div className="energy-table-container" style={{ padding: '20px' }}>
      <Card style={{ maxWidth: '100%', margin: '0 auto' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Energy Consumption Data (12 Months)
        </Title>

        {/* Add Data Button */}
        <Space style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={showModal}>
            Add Data
          </Button>
          {/* Upload SCADA_15 File Button */}
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload SCADA_15 File</Button>
          </Upload>
        </Space>

        {/* Table to Display Data */}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          size="small" // This reduces the table's size and height
          tableLayout="fixed" // Makes the table more compact by using fixed layout
        />

        {/* Modal for Adding New Data */}
        <Modal
          title="Add Monthly Data"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width="80%"
        >
          <Form form={form} layout="vertical" onFinish={handleAddData}>
            {/* Month Dropdown */}
            <Form.Item
              label="Month"
              name="month"
              rules={[{ required: true, message: 'Please select a month!' }]}>
              <Select placeholder="Select month">
                {months.map((month, index) => (
                  <Select.Option key={index} value={month}>
                    {month}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Monthly Consumption (kWh)"
                  name="monthlyConsumption"
                  rules={[{ required: true, message: 'Please enter monthly consumption!' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Enter kWh" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Peak Consumption (kWh)"
                  name="peakConsumption"
                  rules={[{ required: true, message: 'Please enter peak consumption!' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Enter peak kWh" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Off-Peak Consumption (kWh)"
                  name="offPeakConsumption"
                  rules={[{ required: true, message: 'Please enter off-peak consumption!' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Enter off-peak kWh" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Monthly Bill Amount ($)"
                  name="monthlyBill"
                  rules={[{ required: true, message: 'Please enter monthly bill amount!' }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="Enter bill amount in $" />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default EnergyConsumptionTable;
