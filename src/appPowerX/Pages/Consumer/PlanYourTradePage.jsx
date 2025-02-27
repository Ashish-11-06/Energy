import React, { useState, useEffect } from "react";
import { Form, Input, Button, Col, Table, Row, Tooltip, Modal, Radio, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const generateTimeLabels = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

const PlanYourTradePage = () => {
  const [form] = Form.useForm();
  const [selectedTechnology, setSelectedTechnology] = useState("Solar");
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState(
    generateTimeLabels().map((time, index) => ({
      key: index,
      time,
      demand: null,
    }))
  );
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleContinue = () => {
    setIsModalVisible(true);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleChange = (value) => {
    setSelectedTechnology(value);
  };

  const handleInputChange = (value, key) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index].demand = value;
      setTableData(newData);
    }
  };

  useEffect(() => {
    const allFilled = tableData.every((item) => item.demand !== null);
    setAllFieldsFilled(allFilled);
  }, [tableData]);

  const handleModalOk = () => {
    localStorage.setItem("tradeData", JSON.stringify(tableData));
    localStorage.setItem("selectedTechnology", selectedTechnology);
    localStorage.setItem("navigationSource", "PlanYourTradePage");
    navigate('/px/consumer/trading');
  };

  const handleFileUpload = (file) => {
    message.success(`${file.name} uploaded successfully`);
    setFileUploaded(true);
    setAllFieldsFilled(true);
    return false; // Prevent automatic upload
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
      render: (_, record) => (
        <Input
          value={record.demand}
          onChange={(e) => handleInputChange(e.target.value, record.key)}
        />
      ),
    },
  ];

  const renderTable = (data) => (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      size="small"
      style={{ marginBottom: "20px" }}
    />
  );

  const splitData = (data) => {
    const sixth = Math.ceil(data.length / 6);
    return [
      data.slice(0, sixth),
      data.slice(sixth, sixth * 2),
      data.slice(sixth * 2, sixth * 3),
      data.slice(sixth * 3, sixth * 4),
      data.slice(sixth * 4, sixth * 5),
      data.slice(sixth * 5),
    ];
  };

  const [part1, part2, part3, part4, part5, part6] = splitData(tableData);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plan Your Trade</h1>
      <Row gutter={16} style={{ marginBottom: "20px" ,marginLeft:'20%', marginRight:'15%'}}>
        <Col>
        <Tooltip title="Add details manually!" placement="bottom">
          <Button onClick={() => setShowTable(!showTable)}>
            {showTable ? "Add Details" : "Add Details"}
          </Button>
          </Tooltip>
        </Col>
        <span style={{marginTop:'10px', fontWeight:'bold',marginLeft:'20px',marginRight:'20px'}}>OR</span>
        <Col>
        <Tooltip title="Upload a bulk file for 96 blocks in a day!" placement="bottom">
          <Upload beforeUpload={handleFileUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
          </Tooltip>
        </Col>
      </Row>
      {showTable && (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>{renderTable(part1)}</Col>
            <Col span={4}>{renderTable(part2)}</Col>
            <Col span={4}>{renderTable(part3)}</Col>
            <Col span={4}>{renderTable(part4)}</Col>

            <Col span={4}>{renderTable(part5)}</Col>
            <Col span={4}>{renderTable(part6)}</Col>
          </Row>
        </Form>
      )}
      <Form.Item>
        <Tooltip
          title={!allFieldsFilled ? "Add details manually or upload the file" : ""}
          placement="top"
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "85%" }}
            onClick={handleContinue}
            disabled={!allFieldsFilled}
          >
            Continue
          </Button>
        </Tooltip>
      </Form.Item>
      <Modal
        title="Select Technology"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Radio.Group onChange={(e) => setSelectedTechnology(e.target.value)} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
          <Radio value="Hydro">Hydro</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default PlanYourTradePage;
