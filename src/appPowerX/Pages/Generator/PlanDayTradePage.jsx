/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Table,
  Row,
  Tooltip,
  Modal,
  Radio,
  Upload,
  message,
  Card,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useDispatch } from "react-redux";
import { addDayAheadData } from "../../Redux/slices/generator/dayAheadSliceG";
import { getAllProjectsById } from "../../Redux/slices/generator/portfolioSlice";

const generateTimeLabels = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hour = i.toString().padStart(2, "0");
      const minute = j.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

const PlanYourTradePage = () => {
  const [form] = Form.useForm();
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_id = user.id;
  const is_new_user = user?.is_new_user;
  const username = user?.company_representative;

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [generatorPortfolio, setGeneratorPortfolio] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
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

  const handleContinue = async () => {
    if (!fileUploaded) {
      // setIsModalVisible(true);

      // console.log("Selected State:", selectedState);
      // console.log("Selected Portfolio ID:", selectedPortfolioId);
      try {
        const dayAheadDemand = {
          model:
            selectedTechnology === "Solar" ? "solarportfolio" : "windportfolio",
          object_id: selectedPortfolioId,
          price: parseFloat(price),
          generation_data: tableData.map((item) => {
            let [hours, minutes] = item.time.split(":").map(Number); // Convert time to hours and minutes
            minutes += 15; // Add 15 minutes

            if (minutes >= 60) {
              hours += 1;
              minutes -= 60;
            }

            // Ensure hours do not exceed 23 (Reset to 00:00 if it becomes 24:00)
            if (hours >= 24) {
              hours = 0;
            }

            let end_time = `${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")}`; // Format time

            return {
              start_time: item.time,
              end_time: end_time,
              generation: item.demand,
            };
          }),
        };

        // console.log(dayAheadDemand);
        try {
          const res = await dispatch(addDayAheadData(dayAheadDemand)).unwrap();
          console.log("res", res);
          setIsModalVisible(false);
          message.success(res.message || "Data submitted successfully!");
          navigate("/px/generator/trading");
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        // console.log(error);
        message.error("Failed to submit data. Please try again.");
      }
    } else {
      navigate("/px/track-status");
    }
    // setIsModalVisible(true);
  };

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
  };

  const handleChange = (e) => {
    setSelectedTechnology(e.target.value);
  };

  useEffect(() => {
    if (is_new_user) {
      setIsInfoModalVisible(true);
    }
  }, [is_new_user]);

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };

  const showInfoModal = () => {
    setIsInfoModalVisible(true);
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
    const fetchData = async () => {
      try {
        const id = user_id;
        const res = await dispatch(getAllProjectsById(id)).unwrap();
        const flattenedPortfolio = [
          ...res.Solar.map((item) => ({ ...item, type: "Solar" })),
          ...res.Wind.map((item) => ({ ...item, type: "Wind" })),
          ...res.ESS.map((item) => ({ ...item, type: "ESS" })),
        ];
        setGeneratorPortfolio(flattenedPortfolio);
        // console.log(flattenedPortfolio);
      } catch (error) {
        // console.log("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [user_id, dispatch]);

  const handleStateChange = (value) => {
    setSelectedState(value);

    // Find the portfolio ID of the selected state
    const selectedPortfolio = generatorPortfolio.find(
      (item) => item.state === value
    );
    setSelectedPortfolioId(selectedPortfolio ? selectedPortfolio.id : null);
  };

  useEffect(() => {
    const allFilled = tableData.every((item) => item.demand !== null);
    setAllFieldsFilled(allFilled);
  }, [tableData]);

  const handleModalOk = () => {
    setShowTable(true); // Show the table after modal "Ok"
    setIsModalVisible(false);
  };

  // const handleModalOk = async () => {
  //   // console.log("Selected State:", selectedState);
  //   // console.log("Selected Portfolio ID:", selectedPortfolioId);
  //   try {
  //     const dayAheadDemand = {
  //       model: selectedTechnology === "Solar" ? "solarportfolio" : "windportfolio",
  //       object_id: selectedPortfolioId,
  //       price: parseFloat(price),
  //       generation_data: tableData.map(item => {
  //         let [hours, minutes] = item.time.split(":").map(Number); // Convert time to hours and minutes
  //         minutes += 15; // Add 15 minutes

  //         if (minutes >= 60) {
  //           hours += 1;
  //           minutes -= 60;
  //         }

  //         // Ensure hours do not exceed 23 (Reset to 00:00 if it becomes 24:00)
  //         if (hours >= 24) {
  //           hours = 0;
  //         }

  //         let end_time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`; // Format time

  //         return {
  //           start_time: item.time,
  //           end_time: end_time,
  //           generation: item.demand
  //         };
  //       })
  //     };

  //     // console.log(dayAheadDemand);

  //     const res = await dispatch(addDayAheadData(dayAheadDemand)).unwrap();
  //     // console.log('res', res);
  //     setIsModalVisible(false);
  //     navigate('/px/consumer/trading');
  //   } catch (error) {
  //     // console.log(error);
  //     message.error("Failed to submit data. Please try again.");
  //   }
  // };

  const handleFileUpload = (file) => {
    setUploadModal(true);
    const isExcel =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      message.error("Please upload a valid Excel file.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
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
      message.success(
        `${file.name} uploaded successfully, now you can check the status in 'Track Status' optionnnn`
      );
      setUploadModal(false);
      // message.success(`${file.name} uploaded successfully`);
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  const handleDownloadTemplate = () => {
    const formattedData = tableData.map((item, index) => ({
      "Time Interval":
        index < tableData.length - 1
          ? `${item.time} - ${tableData[index + 1].time}`
          : `${item.time} - 00:00`, // Last interval wraps around
      Generation: "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[cell]) {
        worksheet[cell].s = { font: { bold: true } };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "trade_template.xlsx");
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
          Generation
          <Tooltip title="Fill below to apply same demand for all time intervals">
            <Button
              onClick={() => handleFillBelow(part)}
              style={{ marginLeft: "10px", height: "10px" }}
              icon={<DownOutlined style={{ padding: "5px", height: "10px" }} />}
            ></Button>
          </Tooltip>
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
  const handleAddDetails = () => {
    setIsModalVisible(true); // Show the "Select Technology" modal
  };
  const [part1, part2, part3, part4, part5, part6] = splitData(tableData);

  const dummyConsumptionUnits = ["Unit 1", "Unit 2", "Unit 3"]; // Dummy data

  const consumptionUnits =
    Array.isArray(generatorPortfolio) && generatorPortfolio.length > 0
      ? generatorPortfolio
      : dummyConsumptionUnits;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plan Your Trade (96 time blocks)</h1>
      <Col span={24}>
        <Form.Item label="Select Portfolio">
          <Select
            value={selectedState || undefined} // Ensures placeholder is visible when nothing is selected
            onChange={handleStateChange}
            style={{ width: "70%", borderColor: "#669800" }}
            placeholder="Select Portfolio" // Placeholder text
          >
            {Array.isArray(generatorPortfolio) &&
              generatorPortfolio.map((item) => (
                <Select.Option key={item.id} value={item.state}>
                  {`${item.type}: State: ${item.state}, Connectivity: ${item.connectivity}, Available Capacity: ${item.available_capacity} MWh, Annual Generation Potential: ${item.annual_generation_potential}`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Col>
      <Row
        gutter={16}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        {/* Add Details Card */}
        <Col span={8}>
          <Card
            style={{
              width: 300,
              borderRadius: "12px",
              boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-2px)",
              transition: "all 0.3s ease-in-out",
              textAlign: "center",
            }}
          >
            <Col>
              <Tooltip title="Add details manually!" placement="bottom">
                {/* <Button onClick={() => setShowTable(!showTable)}>
                  {showTable ? "Add Details +" : "Add Details +"}
                </Button> */}
                <Button onClick={handleAddDetails}>Add Details +</Button>
              </Tooltip>
            </Col>
          </Card>
        </Col>

        {/* OR separator */}
        <Col
          span={2}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          <span>OR</span>
        </Col>

        {/* Upload Template Card */}
        <Col span={8}>
          <Card
            style={{
              width: 300,
              borderRadius: "12px",
              boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-2px)",
              transition: "all 0.3s ease-in-out",
              textAlign: "center",
            }}
          >
            <Row gutter={16} align="middle" justify="center">
              <Col>
                <Tooltip title="Download template!" placement="bottom">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadTemplate}
                  />
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Upload a bulk file!" placement="bottom">
                  <Button icon={<UploadOutlined />} onClick={handleFileUpload}>
                    Upload File
                  </Button>
                  {/* <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload> */}
                </Tooltip>
              </Col>
            </Row>
          </Card>
        </Col>
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
          title={
            !allFieldsFilled ? "Add details manually or upload the file" : ""
          }
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
        {/* Radio Group */}
        <Radio.Group onChange={handleChange} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="non_solar">Non solar</Radio>
        </Radio.Group>

        {/* Input field for price */}
        <div style={{ marginTop: "15px" }}>
          {selectedTechnology && (
            <div>
              <label style={{ fontWeight: "bold" }}>
                Enter {selectedTechnology} Price (INR/MWh):
              </label>
              <Input
                type="number"
                placeholder={`Enter ${selectedTechnology.toLowerCase()} price in INR/MWh`}
                value={price}
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
        </div>
      </Modal>
      <Modal
        title="Welcome"
        open={isInfoModalVisible}
        onOk={handleInfoModalOk}
        onCancel={() => setIsInfoModalVisible(false)} // Add onCancel handler
        okText="Got it"
        footer={[
          <Button key="submit" type="primary" onClick={handleInfoModalOk}>
            Got it
          </Button>,
        ]}
      >
        <p>Hi {username},</p>

        <p>Welcome to the powerX. Please follow these steps to proceed:</p>
        <ol>
          <li>Select the consumption unit </li>
          <li>
            Add your requirements by clicking the "Add Details +" button or
            Download template, fill it and upload the document
          </li>
          <li>Click on continue button</li>
          <li>Select the technology and enter the price</li>
          <li>Click on 'Ok' to proceed</li>
        </ol>
        <p>Thank you!</p>
      </Modal>
      <Modal
        title="Select Technologyyy"
        open={uploadModal}
        onCancel={() => setUploadModal(false)}
        footer={[
          <>
            <Upload beforeUpload={handleFileUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
            <Button
              onClick={() => setUploadModal(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </>,
        ]}
      >
        <Radio.Group
          onChange={(e) => setSelectedTechnology(e.target.value)}
          value={selectedTechnology}
        >
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
        </Radio.Group>

        <div style={{ marginTop: "15px" }}>
          {selectedTechnology === "Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>
                Enter Solar Price (INR/MWh):
              </label>
              <Input
                type="number"
                placeholder="Enter solar price in INR/MWh"
                value={price["Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, Solar: e.target.value })}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}

          {selectedTechnology === "Non-Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>
                Enter Non-Solar Price (INR/MWh):
              </label>
              <Input
                type="number"
                placeholder="Enter non-solar price in INR/MWh"
                value={price["Non-Solar"] || ""}
                min={0}
                onChange={(e) =>
                  setPrice({ ...price, "Non-Solar": e.target.value })
                }
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PlanYourTradePage;
