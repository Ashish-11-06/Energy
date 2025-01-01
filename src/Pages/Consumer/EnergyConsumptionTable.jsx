import React, { useState } from "react";
import {
  Table,
  Typography,
  Card,
  Button,
  Form,
  InputNumber,
  Modal,
  Space,
  Row,
  Col,
  Upload,
  message,
  Select,
} from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../EnergyTable.css";

const { Title } = Typography;
const { Option } = Select;

const EnergyConsumptionTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileMonth, setSelectedFileMonth] = useState(null);
  const [disableForm, setDisableForm] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const availableMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const usedMonths = new Set(dataSource.map((data) => data.month));

  const handleFileUpload = (file) => {
    if (uploadedFiles.length >= 1) {
      message.error("You can upload only one file at a time!");
      return false;
    }

    if (!selectedFileMonth) {
      message.error("Please select a month before uploading!");
      return false;
    }

    setUploadedFiles([file]);
    setDisableForm(true);
    message.success(`${file.name} uploaded successfully`);
    return false;
  };

  const handleRemoveFile = () => {
    setUploadedFiles([]);
    setSelectedFileMonth(null);
    setDisableForm(false);
    message.info("File removed");
  };

  const handleAddData = (values) => {
    if (!disableForm && Object.values(values).some((value) => !value)) {
      message.error("Please fill out all the fields or upload a document!");
      return;
    }

    const newData = {
      key: dataSource.length + 1,
      month: disableForm ? selectedFileMonth : values.month,
      monthlyConsumption: values.monthlyConsumption,
      peakConsumption: values.peakConsumption,
      offPeakConsumption: values.offPeakConsumption,
      monthlyBill: values.monthlyBill,
      fileUploaded: uploadedFiles.length > 0 ? "Yes" : "No",
    };

    setDataSource([...dataSource, newData]);
    setIsModalVisible(false);
    setUploadedFiles([]);
    setSelectedFileMonth(null);
    form.resetFields();
    setDisableForm(false);
    message.success("Data added successfully!");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setDisableForm(false);
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    multiple: false,
    showUploadList: false,
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 100,
    },
    {
      title: "Monthly Consumption (kWh)",
      dataIndex: "monthlyConsumption",
      key: "monthlyConsumption",
      width: 150,
    },
    {
      title: "Peak Consumption (kWh)",
      dataIndex: "peakConsumption",
      key: "peakConsumption",
      width: 150,
    },
    {
      title: "Off-Peak Consumption (kWh)",
      dataIndex: "offPeakConsumption",
      key: "offPeakConsumption",
      width: 150,
    },
    {
      title: "Monthly Bill ($)",
      dataIndex: "monthlyBill",
      key: "monthlyBill",
      width: 120,
    },
    {
      title: "File Uploaded",
      dataIndex: "fileUploaded",
      key: "fileUploaded",
      width: 120,
    },
  ];

  const handleContinue = () => {
    navigate("/consumer/consumption-pattern");
  };

  return (
    <div className="energy-table-container" style={{ padding: "20px" }}>
      <Card style={{ maxWidth: "100%", margin: "0 auto" }}>
        <p>Please fill the details for making your energy transition plan.</p>
        <Title level={3} style={{ textAlign: "center", marginTop: "10px" }}>
          Energy Consumption Data (12 Months)
        </Title>

        <Space
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Data
          </Button>
        </Space>

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
          size="small"
          tableLayout="fixed"
        />

        <Modal
          title="Add Monthly Data"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddData}
            initialValues={{
              month: null,
              monthlyConsumption: null,
              peakConsumption: null,
              offPeakConsumption: null,
              monthlyBill: null,
            }}
          >
            <Form.Item>
              <Select
                placeholder="Select month for file upload"
                style={{ width: "100%", marginBottom: "10px" }}
                value={selectedFileMonth}
                onChange={(value) => setSelectedFileMonth(value)}
              >
                {availableMonths.map(
                  (month, index) =>
                    !usedMonths.has(month) && (
                      <Option key={index} value={month}>
                        {month}
                      </Option>
                    )
                )}
              </Select>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload Document</Button>
              </Upload>
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: "10px", color: "green" }}>
                  <span>{uploadedFiles[0].name}</span>
                  <CloseCircleOutlined
                    style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
                    onClick={handleRemoveFile}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item
              label="Month"
              name="month"
              rules={[
                { required: !disableForm, message: "Please select a month!" },
              ]}
            >
              <Select placeholder="Select month" disabled={disableForm}>
                {availableMonths.map(
                  (month, index) =>
                    !usedMonths.has(month) && (
                      <Option key={index} value={month}>
                        {month}
                      </Option>
                    )
                )}
              </Select>
            </Form.Item>

            {/* Consumption and Bill Input Fields */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Monthly Consumption (kWh)"
                  name="monthlyConsumption"
                  rules={[
                    {
                      required: !disableForm,
                      message: "Please enter monthly consumption!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter kWh"
                    disabled={disableForm}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Peak Consumption (kWh)"
                  name="peakConsumption"
                  rules={[
                    {
                      required: !disableForm,
                      message: "Please enter peak consumption!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter peak kWh"
                    disabled={disableForm}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Off-Peak Consumption (kWh)"
                  name="offPeakConsumption"
                  rules={[
                    {
                      required: !disableForm,
                      message: "Please enter off-peak consumption!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter off-peak kWh"
                    disabled={disableForm}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Monthly Bill ($)"
                  name="monthlyBill"
                  rules={[
                    {
                      required: !disableForm,
                      message: "Please enter monthly bill!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter monthly bill"
                    disabled={disableForm}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal>

        <Space style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          For more accuracy, you can upload a SCADA_15 min dump energy consumption file.
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload SCADA File</Button>
          </Upload>
        </Space>
      </Card>
    </div>
  );
};

export default EnergyConsumptionTable;
