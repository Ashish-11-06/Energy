import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, Col, Table, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const PlanYourTradePage = () => {
  const [form] = Form.useForm();
  const [selectedTechnology, setSelectedTechnology] = useState("Solar");
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const [selectedType, setSelectedType] = useState("Solar");
  const handleChange = (value) => {
    setSelectedType(value);
  };

  const handleTechnologyChange = (value) => {
    setSelectedTechnology(value);
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Demand",
      dataIndex: "demand",
      key: "demand",
    },
  ];

  const tableData = [
    {
      key: "1",
      time: "00:00 AM",
      demand: 1500,
    },
    {
      key: "2",
      time: "01:00 AM",
      demand: 1400,
    },
    {
      key: "3",
      time: "02:00 AM",
      demand: 1300,
    },
    {
      key: "4",
      time: "03:00 AM",
      demand: 1200,
    },
    {
      key: "5",
      time: "04:00 AM",
      demand: 1100,
    },
    {
      key: "6",
      time: "05:00 AM",
      demand: 1050,
    },
  ];
  const uploadProps = {
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plan Your Trade</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* <Form.Item label="Enter Your Demand" name="demand" rules={[{ required: true, message: 'Please input your demand!' }]}>
          <Input placeholder="Enter demand" />
        </Form.Item> */}
        {/* 
        <Form.Item label="Select Technology" name="technology" rules={[{ required: true, message: 'Please select a technology!' }]}>
          <Select defaultValue="Solar" onChange={handleTechnologyChange}>
            <Option value="Solar">Solar</Option>
            <Option value="Non-solar">Non-solar</Option>
            <Option value="Hydro">Hydro</Option>
          </Select>
        </Form.Item> */}
        <Select
          defaultValue="Solar"
          style={{ width: 120, marginLeft: "80%", marginBottom: "10px" }}
          onChange={handleChange}
        >
          <Option value="Solar">Solar</Option>
          <Option value="Non-solar">Non-solar</Option>
          <Option value="Hydro">Hydro</Option>
        </Select>

        {/* <Form.Item label={`Price for ${selectedTechnology}`} name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
          <Input placeholder="Enter price" />
        </Form.Item> */}

        <Form.Item
          label="Enter Your Demand"
          name="demand"
          rules={[{ required: true, message: "Please input your demand!" }]}
          style={{ marginBottom: "10px", width: "20%" }}
        >
          <Input placeholder="Enter demand" />
        </Form.Item>

        <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        {/* Table and Upload button in the same row */}
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            style={{
              width: '100%', // Set width to 100% so it fills the column
              height: '400px',
              overflowY: 'auto', // Makes the table scrollable
            }}
          />
        </Col>
        
        <Col span={12}>
          <Form.Item label="Bulk Upload" name="upload">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginLeft: "80%" }}>
            Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PlanYourTradePage;
