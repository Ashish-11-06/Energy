import React, { useState, useEffect } from "react";
import { Form, Input, Button, Col, Table, Row, Tooltip, Modal, Radio, Upload, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, DownloadOutlined, DownOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';

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

const PlanDayTradePage = () => {
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
    navigate('/px/generator/trading');
  };

  const handleFileUpload = (file) => {
    const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      message.error("Please upload a valid Excel file.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const updatedData = tableData.map((item, index) => ({
        ...item,
        demand: jsonData[index + 1] ? jsonData[index + 1][1] : null,
      }));

      setTableData(updatedData);
      setFileUploaded(true);
      setAllFieldsFilled(true);
      message.success(`${file.name} uploaded successfully`);
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData.map(item => ({ Time: item.time, Demand: '' })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'trade_template.xlsx');
  };

  const handleFillBelow = (part) => {
    const newData = [...tableData];
    const firstValue = newData[part[0].key].demand;
    part.forEach((item, index) => {
      if (index > 0) {
        newData[item.key].demand = firstValue;
      }
    });
    setTableData(newData);
  };

  const columns = (part) => [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: (
        <div>
          Demand
          <Button onClick={() => handleFillBelow(part)} style={{ marginLeft: '10px',height:'10px' }} icon={<DownOutlined style={{padding:'5px',height:'10px'}}/>}>
            
          </Button>
        </div>
      ),
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

  const renderTable = (data, partIndex) => (
    <div>
      <Table
        columns={columns(data)}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: "20px" }}
      />
    </div>
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
      <h1>Plan Your Trade (96 time blocks)</h1>
      <Row gutter={16} style={{ marginBottom: "20px" ,marginLeft:'20%', marginRight:'15%'}}>
      <Card
      style={{
        width: 300,
        borderRadius: "12px",
        boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-2px)",
        transition: "all 0.3s ease-in-out",
        textAlign:'center'
      }}
      
    >
      <Col>
        <Tooltip title="Add details manually!" placement="bottom">
          <Button onClick={() => setShowTable(!showTable)}>
            {showTable ? "Add Details +" : "Add Details +"}
          </Button>
        </Tooltip>
      </Col>
    </Card>
        <span style={{marginTop:'30px', fontWeight:'bold',marginLeft:'20px',marginRight:'20px'}}>OR</span>
        <Card span={10}   style={{
        width: 300,
        borderRadius: "12px",
        boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-2px)",
        transition: "all 0.3s ease-in-out",
        textAlign:'center'

      }}>
      <Row gutter={16} align="middle">
        <Col>
          <Tooltip title="Download template!" placement="bottom">
            <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} />
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title="Upload a bulk file!" placement="bottom">
            <Upload beforeUpload={handleFileUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Tooltip>
        </Col>
      </Row>
    </Card>
      </Row>
      {showTable && (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>{renderTable(part1, 1)}</Col>
            <Col span={4}>{renderTable(part2, 2)}</Col>
            <Col span={4}>{renderTable(part3, 3)}</Col>
            <Col span={4}>{renderTable(part4, 4)}</Col>
            <Col span={4}>{renderTable(part5, 5)}</Col>
            <Col span={4}>{renderTable(part6, 6)}</Col>
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

export default PlanDayTradePage;
