/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Col, Table, Row, Tooltip, Modal, Checkbox, Upload, message, Card, Select, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, DownloadOutlined, DownOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { addDayAheadData } from "../../Redux/slices/consumer/dayAheadSlice";
import { fetchRequirements } from "../../Redux/slices/consumer/consumerRequirementSlice";
import { fetchHolidayList } from "../../Redux/slices/consumer/holidayListSlice";
import { Line } from "react-chartjs-2";
import { decryptData } from "../../../Utils/cryptoHelper";

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
  const [selectedTechnology, setSelectedTechnology] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [price, setPrice] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const userData = decryptData(localStorage.getItem('user'));
  const user= userData?.user;
  // const user = JSON.parse(localStorage.getItem('user')).user;
  const user_id = user.id;
  const is_new_user = user?.is_new_user;
  const username = user?.company_representative;

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [consumerRequirement, setConsumerRequirement] = useState([]);
  const [isTableShow,setTableShow]=useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
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
const [uploadModal,setUploadModal]=useState(false);

useEffect(() => {
  const fetchHolidayData = async () => {
    try {
      const res = await dispatch(fetchHolidayList());
      setDisabledDates(["2025-06-20"]);
      // setDisabledDates(res.payload);
   // console.log("Holiday List:", res);
    } catch (error) {
      // console.error("Error fetching holiday list:", error);
    }
  };
  fetchHolidayData();
}, [dispatch]);

const GenerationLineChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.start_time),
    datasets: [
      {
        label: 'Demand (MWh)',
        data: data.map((item) => Number(item.generation)),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Start Time' },
        ticks: { maxTicksLimit: 12 },
      },
      y: {
        title: { display: true, text: 'Demand (MWh)' },
        beginAtZero: true,
      },
    },
  };

  return <div style={{ height: 300 }}><Line data={chartData} options={options} /></div>;
};


const handleContinue = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  if (disabledDates.includes(tomorrowFormatted)) {
    message.error("Tomorrow is a holiday. You cannot add data.");
    return;
  }

  if (!selectedRequirementId) {
    message.error("Please select a consumption unit.");
    return;
  }

  if (!allFieldsFilled) {
    message.error("Please fill all fields or upload a file.");
    return;
  }

  // console.log('table data', tableData);

  // ✅ Create generationData for graph
  const demandData = tableData.map(item => {
    let [hours, minutes] = item.time.split(":").map(Number);
    minutes += 15;

    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }

    if (hours >= 24) hours = 0;

    const end_time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return {
      start_time: item.time,
      end_time,
      generation: item.demand
    };
  });

// console.log('generation data',demandData);


  // ✅ Show confirmation modal with chart
  Modal.confirm({
    title: 'Are you sure you want to submit the data?',
    content: <GenerationLineChart data={demandData} />,
    width: 850,
    okText: 'Yes',
    cancelText: 'No',
    centered: true,
    onOk: async () => {
      try {
        const dayAheadDemand = {
          requirement: selectedRequirementId,
          demand_data: tableData.map(item => {
            let [hours, minutes] = item.time.split(":").map(Number);
            minutes += 15;
            if (minutes >= 60) {
              hours += 1;
              minutes -= 60;
            }
            if (hours >= 24) hours = 0;

            const end_time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

            return {
              start_time: item.time,
              end_time,
              demand: item.demand
            };
          }),
          price: (Array.isArray(selectedTechnology) ? selectedTechnology : [selectedTechnology]).reduce((acc, tech) => {
            acc[tech] = parseFloat(price[tech]);
            return acc;
          }, {})
        };

        // console.log('demand data', dayAheadDemand?.demand_data);

        const res = await dispatch(addDayAheadData(dayAheadDemand)).unwrap();
        // const res = null;

        if (res && res.status === 201) {
          message.success(res.data.message || "Data uploaded successfully");
          navigate('/px/track-status');
        } else {
          message.error("Failed to submit data. Please try again.");
        }
      } catch (error) {
        message.error("Failed to submit data. Please try again.");
      }
    }
  });
};


  
// console.log('selectedRequirementId',selectedRequirementId);

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
  };

  const handleChange = (value) => {
    setSelectedTechnology(value);
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


// console.log('consumer requirement',consumerRequirement);

const handleInputChange = (value, key) => {
  const newData = [...tableData];
  const index = newData.findIndex((item) => key === item.key);

  // Find the selected requirement by ID
  const selectedRequirement = consumerRequirement.find(
    (item) => item.id === selectedRequirementId
  );

  const contractedDemand = selectedRequirement?.contracted_demand;
  const numericValue = Number(value);

  // Show warning if demand exceeds contracted demand
  if (contractedDemand && numericValue > contractedDemand) {
    const modal = Modal.warning({
      title: 'Warning',
      content: `Entered demand (${numericValue}) exceeds contracted demand (${contractedDemand}).`,
      okButtonProps: { style: { display: 'none' } },
    });

    setTimeout(() => {
      modal.destroy();
    }, 3000); // Auto-close after 3 seconds
  }

  if (index > -1) {
    newData[index].demand = value;
    setTableData(newData);
  }

  // console.log('new data', newData);
};




  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = user_id;
        const res = await dispatch(fetchRequirements(id)); // Wait for API response
        const states = res.payload.map(item => item.state);
        setConsumerRequirement(res.payload);
        // console.log(res.payload);
      } catch (error) {
        // console.log("Error fetching consumer requirements:", error);
      }
    };
    fetchData();
  }, [user_id, dispatch]);

  const handleStateChange = (value) => {
    setSelectedState(value);

    // Find the requirement ID of the selected state
    const selectedRequirement = consumerRequirement.find(item => item.id === value);
    setSelectedRequirementId(selectedRequirement ? selectedRequirement.id : null);
  };

  useEffect(() => {
    const allFilled = tableData.every((item) => item.demand !== null);
 // console.log('all fields filled', allFilled);
    
    setAllFieldsFilled(allFilled);
  }, [tableData]);

  const handleModalOk = () => {
 // console.log('all fields filled', allFieldsFilled);
 // console.log('sss');
    
    setShowTable(true); // Show the table after modal "Ok"
    setIsModalVisible(false);
  };
  

const handleTableShow = () => {
  renderTable();
}

const handleFileUpload = (file) => {
  const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    message.error("Please upload a valid Excel file.");
    return false;
  }

  // console.log('all fields filled', allFieldsFilled);
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Validate file format
    if (!jsonData[0] || jsonData[0][0] !== "Time Interval" || jsonData[0][1] !== "Demand") {
      message.error("Invalid file format. Please use the correct template.");
      return;
    }

    // Convert file to base64
    const base64Reader = new FileReader();
    base64Reader.onload = async (event) => {
      const base64File = event.target.result.split(",")[1]; // Extract base64 string

      // Prepare data for API
      const demandData = jsonData.slice(1).map((row) => {
        const [start, end] = row[0]?.split(" - ") || [];
        return {
          start_time: start,
          end_time: end,
          demand: row[1] || null,
        };
      });

      const dayAheadDemand = {
        requirement: selectedRequirementId,
        file: base64File, // Include base64 file
        price: (Array.isArray(selectedTechnology) ? selectedTechnology : [selectedTechnology]).reduce((acc, tech) => {
          acc[tech] = parseFloat(price[tech]);
          return acc;
        }, {}),
      };

      try {
        const res = await dispatch(addDayAheadData(dayAheadDemand)).unwrap();
        // console.log('res at 271',res);
        
        if (res && res.status === 201) {
          message.success(res.data.message || "File uploaded successfully.");
          navigate('/px/track-status');
        } else {
          message.error("Failed to upload file. Please try again.");
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to upload file. Please try again.");
      }
    };

    base64Reader.readAsDataURL(file); // Read file as base64
  };

  reader.readAsArrayBuffer(file);
  return false; // Prevent automatic upload
};

// console.log('all fields filled', allFieldsFilled);

  const handleDownloadTemplate = () => {
    // Modify time format for the template
    const formattedData = tableData.map((item, index) => ({
      "Time Interval": index < tableData.length - 1 
        ? `${item.time} - ${tableData[index + 1].time}`
        : `${item.time} - 00:00`, // Last interval wraps around
      "Demand": ''
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
    // Make column headers bold
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[cell]) {
        worksheet[cell].s = { font: { bold: true } };
      }
    }
  
    // Create workbook and download file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Consumer_dayahead_trade_template.xlsx');
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
          <Tooltip title="Fill below to apply same demand for all time intervals">
          <Button onClick={() => handleFillBelow(part)} style={{ marginLeft: '10px', height: '10px' }} icon={<DownOutlined style={{ padding: '5px', height: '10px' }} />}>
          </Button>
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

  // const handleUploadFile=()=>{
  //   setUploadModal(true);
  // }
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

  const dummyConsumptionUnits = ["Unit 1", "Unit 2", "Unit 3"]; // Dummy data

  const consumptionUnits = consumerRequirement && consumerRequirement.length > 0
    ? consumerRequirement
    : dummyConsumptionUnits;

  const handleAddDetails = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    if (disabledDates.includes(tomorrowFormatted)) {
      message.error("Tomorrow is a holiday. You cannot add data.");
      return;
    }

    setIsModalVisible(true); // Show the "Select Technology" modal
  };

  const handleUploadFile = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    if (disabledDates.includes(tomorrowFormatted)) {
      message.error("Tomorrow is a holiday. You cannot add data.");
      return;
    }

    setUploadModal(true); // Show the upload modal
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
      Plan Your Trade (96 time blocks)
      </h1>
      {/* <h1>Plan Your Trade (96 time blocks)</h1> */}
      <Col span={24}>
      <Form.Item label="Select Consumption Unit">
  <Select
    value={selectedState || undefined} // Ensures placeholder is visible when nothing is selected
    onChange={handleStateChange}
    style={{ width: "70%", borderColor: "#669800" }}
    placeholder="Select Consumption Unit" // Placeholder text
  >
    {consumerRequirement.map(item => (
      <Select.Option key={item.id} value={item.id}>
        {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

      </Col>
      <Row gutter={16} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", marginLeft: "5%", marginRight: "5%" }}>

        {/* Add Details Card */}
        <Col span={8}>
          <Card
            style={{
              width: 300,
              borderRadius: "12px",
              boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-2px)",
              transition: "all 0.3s ease-in-out",
              textAlign: "center"
            }}
          >
            <Col>
              <Tooltip title="Add details manually!" placement="bottom">
                {/* <Button onClick={() => setShowTable(!showTable)}>
                  {showTable ? "Add  Details +" : "Add Details +"}
                </Button> */}
                <Button onClick={handleAddDetails}>Add Details +</Button>
              </Tooltip>
            </Col>
          </Card>
        </Col>

        {/* OR separator */}
        <Col span={2} style={{ textAlign: "center", fontWeight: "bold", marginRight: "10px" }}>
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
              textAlign: "center"
            }}
          >
            <Row gutter={16} align="middle" justify="center">
              <Col>
                <Tooltip title="Download template!" placement="bottom">
                  <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} />
                </Tooltip>
              </Col>
              <Col>
                <Tooltip title="Upload a bulk file!" placement="bottom">
                <Button icon={<UploadOutlined />} onClick={handleUploadFile}>Upload File</Button>
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
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Radio Group */}
        <Radio.Group onChange={(e) => setSelectedTechnology(e.target.value)} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
        </Radio.Group>

        {/* Input fields for price */}
        <div style={{ marginTop: "15px" }}>
          {selectedTechnology === "Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Solar Price (INR/MWh):</label>
              <Input
                type="number"
                placeholder="Enter solar price in INR/MWh"
                value={price["Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Solar": e.target.value })}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
          
          {selectedTechnology === "Non-Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Non-Solar Price (INR/kWh):</label>
              <Input
                type="number"
                placeholder="Enter non-solar price in INR/MWh"
                value={price["Non-Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Non-Solar": e.target.value })}
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
          <li>Add your requirements by clicking the "Add Details +" button or Download template, fill  it and upload the document</li>
          <li>Click on continue button</li>
          <li>Select the technology and enter the price</li>
          <li>Click on 'Ok' to proceed</li>
        </ol>
        <p>Thank you!</p>
      </Modal>
      <Modal title="Upload File"
        open={uploadModal}
       
        onCancel={() => setUploadModal(false)} 
    
        footer={[
          <>

          <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload>
                  <Button onClick={() => setUploadModal(false)} style={{marginLeft:'10px'}}>Cancel</Button>
                  </>
        ]}
        >
          <Radio.Group onChange={(e) => setSelectedTechnology(e.target.value)} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
        </Radio.Group>

        <div style={{ marginTop: "15px" }}>
          {selectedTechnology === "Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Solar Price:</label>
              <Input
                type="number"
                placeholder="Enter solar price in INR"
                value={price["Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Solar": e.target.value })}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
          
          {selectedTechnology === "Non-Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Non-Solar Price:</label>
              <Input
                type="number"
                placeholder="Enter non-solar price in INR"
                value={price["Non-Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Non-Solar": e.target.value })}
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
