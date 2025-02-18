import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, Col, Table, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const PlanDayTradePage = () => {
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
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Generation",
      dataIndex: "generation",
      key: "generation",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },

  ];

  const tableData = [
    {
      key: "1",
      date: "18-05-25",
      generation: 200,
      price:'3 rs'
    },
    {
      key: "2",
      date: "20-05-25",
      generation: 200,
         price:'4 rs'
    },
    {
      key: "3",
      date: "25-05-25",
      generation: 100,
         price:'2 rs'
    },
    {
      key: "4",
      date: "28-05-25",
      generation: 150,
         price:'5 rs'
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
      {/* <h1>Plan Your Trade</h1> */}
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
        {/* <Select
          defaultValue="Solar"
          style={{ width: 120, marginLeft: "80%", marginBottom: "10px" }}
          onChange={handleChange}
        >
          <Option value="Solar">Solar</Option>
          <Option value="Non-solar">Non-solar</Option>
          <Option value="Hydro">Hydro</Option>
        </Select> */}

        {/* <Form.Item label={`Price for ${selectedTechnology}`} name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
          <Input placeholder="Enter price" />
        </Form.Item> */}

        <Form.Item
          
          name="demand"
          rules={[{ required: true, message: "Please input your demand!" }]}
          style={{ marginBottom: "10px" }}
        >
            <p style={{fontSize:'30px'}}>Enter Your Generation</p>
          {/* <Input placeholder="Enter demand" /> */}
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

export default  PlanDayTradePage 
  ;
