import React, { useState } from 'react';
import { Table, Typography, Card, Button, Form, InputNumber, Modal, Space, Select, Row, Col, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
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
  
  // Initialize navigate hook
  const navigate = useNavigate();

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
    const updatedDataSource = [...dataSource, newData];
    setDataSource(updatedDataSource); // Update data source state
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

  // Handle SCADA file upload (without processing)
  const handleFileUpload = (file) => {
    console.log('File uploaded:', file);
    message.success('SCADA file uploaded successfully');
    return false;
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    showUploadList: false, // Hide upload list as we manually handle the file
  };

  // Get an array of months that are already added to the table
  const usedMonths = dataSource.map(item => item.month);

  // Filter the months array to exclude already used months
  const availableMonths = months.filter(month => !usedMonths.includes(month));

  // Show the "Continue" button after all 12 months are added
  const isAllMonthsAdded = dataSource.length === 12;

  const handleContinue = () => {
    // Navigate to the specified path when "Continue" is clicked
    navigate('/consumer/consumption-pattern');
  };

  return (
    <div className="energy-table-container" style={{ padding: '20px' }}>
      <Card style={{ maxWidth: '100%', margin: '0 auto' }}>
        <p>Please fill the details for making your energy transition plan</p>
        <Title level={3} style={{ textAlign: 'center', marginTop: '10px' }}>
          Energy Consumption Data (12 Months)
        </Title>

        {/* Conditionally render Add Data or Continue Button */}
        <Space style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          {!isAllMonthsAdded ? (
            <Button type="primary" onClick={showModal}>
              Add Data
            </Button>
          ) : (
            <Button
              type="primary"
              block
              onClick={handleContinue}  // Handle Continue
            >
              Continue
            </Button>
          )}
        </Space>

        {/* Table to Display Data */}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
          size="small"
          tableLayout="fixed"
        />

        {/* Modal for Adding New Data */}
        <Modal
          title="Add Monthly Data"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleAddData}>
            {/* Month Dropdown */}
            <Form.Item
              label="Month"
              name="month"
              rules={[{ required: true, message: 'Please select a month!' }]} >
              <Select placeholder="Select month">
                {availableMonths.map((month, index) => (
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
                  rules={[{ required: true, message: 'Please enter monthly consumption!' }]} >
                  <InputNumber style={{ width: '100%' }} placeholder="Enter kWh" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Peak Consumption (kWh)"
                  name="peakConsumption"
                  rules={[{ required: true, message: 'Please enter peak consumption!' }]} >
                  <InputNumber style={{ width: '100%' }} placeholder="Enter peak kWh" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Off-Peak Consumption (kWh)"
                  name="offPeakConsumption"
                  rules={[{ required: true, message: 'Please enter off-peak consumption!' }]} >
                  <InputNumber style={{ width: '100%' }} placeholder="Enter off-peak kWh" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Monthly Bill Amount ($)"
                  name="monthlyBill"
                  rules={[{ required: true, message: 'Please enter monthly bill amount!' }]} >
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

        {/* Upload SCADA_15 File Button */}
        <Space style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          For more accuracy, you can upload a SCADA dump file.
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload SCADA_15 File</Button>
          </Upload>
        </Space>
      </Card>
    </div>
  );
};

export default EnergyConsumptionTable;
