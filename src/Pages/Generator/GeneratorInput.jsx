import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import {
  Table,
  Typography,
  Card,
  Button,
  Upload,
  message,
  Tooltip,
  Col,
  Checkbox,
  Spin,
  Modal,
  InputNumber,
  Form,
  Row,
  Input,
  TimePicker,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "jspdf-autotable";
import { getAllProjectsById } from "../../Redux/Slices/Generator/portfolioSlice";
import moment from "moment";
import { getCapacitySizingData } from "../../Redux/Slices/Generator/capacitySizingSlice";
import { handleDownloadExcel } from "./CapacitySizingDownload";

const { Title } = Typography;

const GeneratorInput = () => {
  const [uploadedFileName, setUploadedFileName] = useState(""); // Remove localStorage dependency
  const [Structuredprojects, setStructuredProjects] = useState([]);
  const [checkPortfolio, setCheckPortfolio] = useState([]);
  const [base64CSVFile, setBase64CSVFile] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capacitySizingData, setCapacitySizingData] = useState(null);
  const [isForm, setForm] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [addDetailsModal, setAddDetailsModal] = useState(false);
  const [curtailmentInputs, setCurtailmentInputs] = useState({
    curtailment_selling_price: 3000,
    sell_curtailment_percentage: 0,
    annual_curtailment_limit: 0.35,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_id = user?.id;
  const { status, projects } = useSelector((state) => state.portfolio);
   const loadingRef = useRef(null); // Tracks current loading key
const [form] = Form.useForm();
  if (status === "idle") {
    dispatch(getAllProjectsById(user.id));
  }
  const handleRecordCheck = (recordId, recordType, isChecked) => {
    setCheckPortfolio((prev) => {
      const exists = prev.some(item => item.id === recordId && item.type === recordType);
      if (isChecked && !exists) {
        return [...prev, { id: recordId, type: recordType }];
      } else if (!isChecked && exists) {
        return prev.filter(item => !(item.id === recordId && item.type === recordType));
      }
      return prev;
    });
  };

  console.log("checkPortfolio", checkPortfolio);
  console.log("structuredProjects", Structuredprojects);
  
const handleFormSubmit = (values) => {
  // Save the form values to dataSource for use in modalData
  const formattedValues = {
    ...values,
    morningPeakStart: values.morningPeakStart?.format("HH:mm:ss"),
    // Do the same for all TimePickers
    eveningPeakStart: values.eveningPeakStart?.format("HH:mm:ss"),
    eveningPeakEnd: values.eveningPeakEnd?.format("HH:mm:ss"),
    morningPeakEnd: values.morningPeakEnd?.format("HH:mm:ss"),
  };
  setDataSource([{ key: 1, ...formattedValues }]);
    setAddDetailsModal(false);
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getCapacitySizingData(user_id));
        console.log('capacity', res.payload);
        setCapacitySizingData(res.payload);

      } catch (error) {
        setCapacitySizingData([]);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [])

  const renderLabelWithTooltip = (label, tooltipText, onClick) => (
    <span>
      {label}{" "}
      <Tooltip title={tooltipText}>
        <InfoCircleOutlined style={{ color: "black", marginLeft: "4px" }} />
      </Tooltip>
      <br />
      {onClick && (
        <Button size="small" style={{ marginLeft: "8px" }} onClick={onClick}>
          <DownOutlined />
        </Button>
      )}
    </span>
  );
  useEffect(() => {
    if (projects.Solar || projects.Wind || projects.ESS) {
      const flatProjects = [
        ...(projects.Solar || []).map((project) => ({ ...project, type: "Solar" })),
        ...(projects.Wind || []).map((project) => ({ ...project, type: "Wind" })),
        ...(projects.ESS || []).map((project) => ({ ...project, type: "ESS" })),
      ];
      setStructuredProjects(flatProjects);
    }
  }, [projects.Solar, projects.Wind, projects.ESS]);

  useEffect(() => {
    setUploadedFileName(""); // Clear uploaded file name on refresh
  }, []);

   const onDownload = async (record) => {
   
        loadingRef.current = record.key; // Set current loading key (no re-render)
  
        console.log("Download button clicked for record:", record.key);
        console.log("record", record);
        console.log("loadingRef", loadingRef.current);

        const updatedRecord = {
          combinationId: record.combination,
          solarCapacity: record.optimal_solar_capacity,
          windCapacity: record.optimal_wind_capacity,
          batteryCapacity: record.optimal_battery_capacity,
          perUnitCost: record.per_unit_cost,
          oaCost: record.oa_cost,
          finalCost: record.final_cost,
          annualDemandOffeset: record.annual_demand_offset,
          annualDemandMet: record.annual_demand_met,
          annualCurtailment: record.annual_curtailment,


        };
       
        await handleDownloadExcel(updatedRecord);
  
        loadingRef.current = null;
     
    };


  const columns = [
    {
      title: "Sr. No",
      key: "serialNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Technology",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Available Capacity",
      dataIndex: "available_capacity",
      key: "available_capacity",
      render: (text) => (text === "ESS" ? `${text} MWh` : `${text} MW`),
    },
    {
      title: "COD (Commercial Operation Date)",
      dataIndex: "cod",
      key: "cod",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => handleRecordCheck(record.id, record.type, e.target.checked)}
          checked={checkPortfolio.some(item => item.id === record.id && item.type === record.type)}
        />
      ),
    },
  ];


  const capacityColumns = [
    {
      title: "Sr. No.",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "record_name",
      key: "record_name",
      width: 50,
    },
    {
      title: "Combination ID",
      dataIndex: "combination",
      key: "combination",
      width: 150,
    },
    {
      title: "Optimal Solar Capacity (MW)",
      dataIndex: "optimal_solar_capacity",
      key: "optimal_solar_capacity",
    },
    {
      title: "Optimal Wind Capacity (MW)",
      dataIndex: "optimal_wind_capacity",
      key: "optimal_wind_capacity",
    },
    {
      title: "Optimal Battery Capacity (MWh)",
      dataIndex: "optimal_battery_capacity",
      key: "optimal_battery_capacity",
    },
    {
      title: "Per Unit Cost (INR/kWh)",
      dataIndex: "per_unit_cost",
      key: "per_unit_cost",
    },
    // {
    //   title: "OA Cost (INR/kWh)", // New column for OA Cost
    //   dataIndex: "oa_cost",
    //   key: "oa_cost",
    // },
    // {
    //   title: "Final Cost (INR/kWh)",
    //   dataIndex: "final_cost",
    //   key: "final_cost",
    // },
    {
      title: 'Annual Demand Offset(%)',
      dataIndex: 'annual_demand_offset',
      key: 'annual_demand_offset'
    },
    {
      title: 'Annual Demand Met (million units)',
      dataIndex: 'annual_demand_met',
      key: 'annual_demand_met'
    },
    {
      title: 'Annual Curtailment(%)',
      dataIndex: 'annual_curtailment',
      key: 'annual_curtailment'
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
          <Button
            type="link"
            icon={<DownloadOutlined style={{ color: "white" }} />}
            onClick={() => {
              console.log("Button clicked, record.key:", record.key);
              onDownload(record);
            }}
          >
            Download
          </Button>

        </div>
      ),
    },

  ];

  const handleRunOptimizer = async () => {
    // Check if either CSV or manual data is present
    if (!base64CSVFile && (!dataSource || dataSource.length === 0)) {
      message.error("Please upload a CSV file or add data manually to run the optimizer.");
      return;
    }

    if (checkPortfolio.length === 0) {
      message.error("Please select at least one portfolio to run the optimizer.");
      return;
    }

    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);

    // Filter by both id and type to avoid mismatches
    const solarPortfolio = Structuredprojects
      .filter((p) => p.type === "Solar" && checkPortfolio.some(sel => sel.id === p.id && sel.type === "Solar"))
      .map((p) => p.id);
    const windPortfolio = Structuredprojects
      .filter((p) => p.type === "Wind" && checkPortfolio.some(sel => sel.id === p.id && sel.type === "Wind"))
      .map((p) => p.id);
    const essPortfolio = Structuredprojects
      .filter((p) => p.type === "ESS" && checkPortfolio.some(sel => sel.id === p.id && sel.type === "ESS"))
      .map((p) => p.id);

    console.log("solarPortfolio", solarPortfolio);
    console.log("windPortfolio", windPortfolio);
    console.log("essPortfolio", essPortfolio);

    let manualData = {};
    // Use dataSource[0] if present (from Add Details modal)
    if (!base64CSVFile && dataSource.length > 0) {
      const row = dataSource[0];
      manualData = {
        annual_consumption: Number(row.annualConsumption),
        contracted_demand: Number(row.contractedDemand),
        morning_peak_hours_start: row.morningPeakStart,
        morning_peak_hours_end: row.morningPeakEnd,
        annual_morning_peak_hours_consumption: Number(row.annualMorningPeakConsumption),
        evening_peak_hours_start: row.eveningPeakStart,
        evening_peak_hours_end: row.eveningPeakEnd,
        annual_evening_peak_hours_consumption: Number(row.eveningPeakHourConsumption),
        peak_hours_availability_requirement: Number(row.peakHoursAvailability),
      };
    }

    // Build modalData based on input method
    const modalData = {
      user_id: user_id,
      solar_portfolio: solarPortfolio,
      wind_portfolio: windPortfolio,
      ess_portfolio: essPortfolio,
      ...curtailmentInputs,
      ...(base64CSVFile
        ? { csv_file: base64CSVFile }
        : manualData),
    };

    console.log("modalData", modalData);

    navigate("/generator/capacity-sizing-pattern", { state: { modalData } }); // Pass modalData to the next page
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleCSVUpload = async (file) => {
    if (!file.name.endsWith(".csv")) {
      message.error("Please upload a valid CSV file.");
      return false;
    }

    message.success(`${file.name} uploaded successfully`);
    setUploadedFileName(file.name); // Only set in state

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1];
      setBase64CSVFile(base64File);
    };
    reader.readAsDataURL(file);
    return false;
  };

const handleDetails = () => {
  setForm((prevShowTable) => !prevShowTable);
  setAddDetailsModal(true);
  // When showing the form, ensure only one row exists
  setDataSource((prevDataSource) => {
    if (prevDataSource.length === 0) {
      return [{
        key: 1,
        annualConsumption: null,
        contractedDemand: null,
        morningPeakStart: null,
        morningPeakEnd: null,
        annualMorningPeakConsumption: null,
        eveningPeakStart: null,
        eveningPeakEnd: null,
        eveningPeakHourConsumption: null,
        peakHoursAvailability: null,
      }];
    } else if (prevDataSource.length > 1) {
      // If more than one row exists, keep only the first
      return [prevDataSource[0]];
    }
    return prevDataSource;
  });
}

const EditableCell = ({ value, onChange, onBlur }) => {
  const [tempValue, setTempValue] = useState(value);
console.log('vale',value);


  const handleBlur = () => {
    onChange(tempValue);
    onBlur();
  };

  return (
    <InputNumber
      value={tempValue}
      onChange={(value) => setTempValue(value)} // Update local state
      onFocus={(e) => e.target.select()} // Select the input value on focus
      onBlur={handleBlur} // Update main state on blur
      style={{ width: "100%" }}
      min={0}
    />
  );
};

  const handleDownloadTemplate = () => {
    const rows = Array.from({ length: 8760 }, (_, i) => `${i + 1},`).join("\n");
    const csvContent = "Hour,Expected Demand\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ justifyContent: "center", width: "100%", alignItems: "center", padding: "20px" }}>


      <Card style={{ width: "100%", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px", marginBottom: "20px" }}>
        <h2 style={{ marginRight: "20px" }}>
          Capacity Sizing
        </h2>
          <Row style={{ color: 'GrayText' }}>
              <p >Note: Go with one of the following option to proceed

                <ol style={{ marginTop: 0 }}>
                    <li>
                    <strong>Upload CSV File:</strong> Download the CSV template, fill it
                    with the required information, and upload the completed file in the
                    specified format.
                  </li>
                  <li>
                    {" "}
                    <strong>Add Details:</strong> Click the "Add Details" button to open
                    a form where you can enter the data manually.
                  </li>
                </ol></p>
            </Row>
        <div style={{ color: "#669800", marginBottom: "30px" }}>
          <Row span={24} >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title level={5} style={{ color: "#669800" }}>
                Upload the Demand data
              </Title>
            </div>
            {/* {uploadedFileName && <div style={{ marginTop: "10px" }}>Uploaded File: {uploadedFileName}</div>} */}
          </Row>
          <Row span={24}>
            {/* <div style={{ display: "flex", alignItems: "center" }}> */}
              <Col span={9}>
              <Tooltip title="Download a CSV file">
                <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} style={{ marginRight: "20px", height: "30px", width: 40 }} />
              </Tooltip>
              <Upload beforeUpload={handleCSVUpload} showUploadList={false}>
                <Tooltip title="Upload a CSV file">
                  <Button style={{ padding: "5px" }} icon={<FileExcelOutlined />}>
                    Upload CSV file
                  </Button>
                </Tooltip>
              </Upload>
              </Col>
              <Col span={2} style={{ display: "flex", justifyContent: "center" }}>
              {"OR"}
              </Col>
              <Col span={12} style={{ display: "flex", justifyContent: "flex-start" }}>  
              <Tooltip title="Add details manually">
              <Button onClick={handleDetails}>Add Details</Button>
              </Tooltip>
              </Col>

            {/* </div> */}
            {uploadedFileName && <div style={{ margin: "10px", color: 'GrayText' }}>Uploaded File: {uploadedFileName}</div>}
          </Row>

          {/* {isForm && ( 
           <Row span={24} style={{ marginTop: "20px" }}>
                <Table
                  columns={vcolumns}
                  dataSource={dataSource.length > 0 ? [dataSource[0]] : [{
                    key: 1,
                    annualConsumption: null,
                    contractedDemand: null,
                    morningPeakStart: null,
                    morningPeakEnd: null,
                    annualMorningPeakConsumption: null,
                    eveningPeakStart: null,
                    eveningPeakEnd: null,
                    eveningPeakHourConsumption: null,
                    peakHoursAvailability: null,
                  }]}
                  pagination={false}
                  bordered
                  size="small"
                  tableLayout="fixed"
                />
               
            </Row>
            )} */}

            
        </div>
        <p>Select the portfolios to be processed in the model execution and run the Optimizer Model.</p>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table
            dataSource={Structuredprojects.map((project, index) => ({ ...project, key: index }))}
            columns={columns}
            pagination={false}
            bordered
            // style={{ marginTop: "20px" }}
            loading={status === "loading"}
          />
        </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <Button onClick={handleRunOptimizer}>
              Run Optimizer
            </Button>
          </div>

      </Card>
      <Card>
        {/* <Row span={24} > */}
        <Title level={5} style={{ color: "#669800", marginTop: "10px" }}>
          Saved Optimization data
        </Title>
        <div style={{ display: "flex", direction: 'column', alignItems: "center" }}>

          <br />
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>

            <Spin spinning={capacitySizingData === null || capacitySizingData === undefined}>
              <Table
                dataSource={Array.isArray(capacitySizingData) ? capacitySizingData.map((project, index) => ({
                  ...project,
                  key: index + 1
                })) : []}
                columns={capacityColumns}
                pagination={false}
                bordered
                size="small"
                // locale={{
                //   emptyText: "No data available"
                // }}
              />
            </Spin>

          </div>


        </div>

        {/* </Row> */}
      </Card>
     <Modal
  // title="Add Details"
  open={addDetailsModal}
  onCancel={() => setAddDetailsModal(false)}
  footer={null}
  width={800}
>
  <Title level={4} style={{ textAlign: "center", color:'669800' }}>
    Add Details
  </Title>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleFormSubmit}
    initialValues={{}} // Optional: preset form values
  >
    <Row gutter={16}>
      {/* Annual Consumption */}
      <Col span={12}>
        <Form.Item 
        rules={[
          {
            required: true,
            message: 'Please input the annual consumption!',
          }
        ]}
        label="Annual Consumption (MWh)" name="annualConsumption">
          <Input />
        </Form.Item>
      </Col>

      {/* Contracted Demand */}
      <Col span={12}>
        <Form.Item
         rules={[
          {
            required: true,
            message: 'Please input the Contracted Demand!',
          }
        ]}
          label={renderLabelWithTooltip(
            "Contracted Demand (MW)",
            "Total energy consumed during the month in megawatt-hours."
          )}
          name="contractedDemand"
        >
          <Input />
        </Form.Item>
      </Col>

      {/* Morning Peak Start */}
<Col span={12}>
  <Form.Item
    rules={[
      {
        required: true,
        message: 'Please input the Morning Peak Start time!',
      }
    ]}
    label={renderLabelWithTooltip(
      "Morning Peak hours Start (HH:mm:ss)",
      "Energy consumption during peak hours in megawatt-hours."
    )}
    name="morningPeakStart"
  >
    <TimePicker
      format="HH:mm:ss"
      placeholder="HH:mm:ss"
      showNow={false}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
      style={{ width: "100%" }}
    />
  </Form.Item>
</Col>

      {/* Morning Peak End */}
      <Col span={12}>
        <Form.Item
         rules={[
          {
            required: true,
            message: 'Please input the Morning Peak End time!',
          }
        ]}
          label={renderLabelWithTooltip(
            "Morning Peak hours End (HH:mm:ss)",
            "Energy consumption during off-peak hours in megawatt-hours."
          )}
          name="morningPeakEnd"
        >
 <TimePicker
      format="HH:mm:ss"
      placeholder="HH:mm:ss"
      showNow={false}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
      style={{ width: "100%" }}
    />
        </Form.Item>
      </Col>

      {/* Annual Morning Peak Consumption */}
     
      <Col span={12}>
        <Form.Item
         rules={[
          {
            required: true,
            message: 'Please input the aAnnual Morning Peak Consumption!',
          }
        ]}
          label={renderLabelWithTooltip(
            "Annual Morning peak hours consumption (MWh)",
            "Energy consumption during off-peak hours in megawatt-hours."
          )}
          name="annualMorningPeakConsumption"
        >
          <Input />
        </Form.Item>
      </Col>
   <Col span={12}>
        <Form.Item
        rules={[
            {
              required: true,
              message: "Please input the annual evening peak hours consumption!",
            },
        ]}
          label={renderLabelWithTooltip(
            "Annual Evening peak hours consumption (MWh)",
            "Energy consumption during off-peak hours in megawatt-hours."
          )}
          name="eveningPeakHourConsumption"
        >
          <Input />
        </Form.Item>
      </Col>
      {/* Evening Peak Start */}
      <Col span={12}>
        <Form.Item
         rules={[
          {
            required: true,
            message: 'Please input the Evening Peak Start time!',
          }
        ]}
          label={renderLabelWithTooltip(
            "Evening Peak hours Start (HH:mm:ss)",
            "Energy consumption during off-peak hours in megawatt-hours."
          )}
          name="eveningPeakStart"
        >
 <TimePicker
      format="HH:mm:ss"
      placeholder="HH:mm:ss"
      showNow={false}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
      style={{ width: "100%" }}
    />
        </Form.Item>
      </Col>
   

      {/* Evening Peak End */}
      <Col span={12}>
 <Form.Item
  rules={[
          {
            required: true,
            message: 'Please input the Evening Peak End time!',
          }
        ]}
  label={renderLabelWithTooltip(
    "Evening Peak hours end (HH:mm:ss)",
    "Energy consumption during off-peak hours in megawatt-hours."
  )}
  name="eveningPeakEnd"
>
 <TimePicker
      format="HH:mm:ss"
      placeholder="HH:mm:ss"
      showNow={false}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
      style={{ width: "100%" }}
    />
</Form.Item>
</Col>

      {/* Annual Evening Peak Consumption */}
   

      {/* Peak Hours Availability Requirement */}
      <Col span={12}>
        <Form.Item
         rules={[
          {
            required: true,
            message: 'Please input the Peak Hours Availability Requirement!',
          }
        ]}
          label={renderLabelWithTooltip(
            "Peak hours availability requirement (%)",
            "Energy consumption during off-peak hours in megawatt-hours."
          )}
          name="peakHoursAvailability"
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ float: "right" }}>
        Submit
      </Button>
    </Form.Item>
  </Form>
</Modal>

      <Modal
        title="Additional Inputs"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          {/* <Form.Item label="Maximum limit for excess energy (%)">
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={curtailmentInputs.annual_curtailment_limit}
              onChange={(value) =>
                setCurtailmentInputs((prev) => ({
                  ...prev,
                  annual_curtailment_limits: value,
                }))
              }
              style={{ width: "100%" }}
            />
          </Form.Item> */}
          <Form.Item label="Maximum limit for excess energy (%)">
  <InputNumber
    min={0}
    max={100}
    step={1}
    value={
      curtailmentInputs.annual_curtailment_limit != null
        ? curtailmentInputs.annual_curtailment_limit * 100
        : null
    }
    onChange={(value) =>
      setCurtailmentInputs((prev) => ({
        ...prev,
        annual_curtailment_limit: value / 100,
      }))
    }
    style={{ width: "100%" }}
    formatter={(value) => `${value}`}
    parser={(value) => value.replace('%', '')}
  />
</Form.Item>

          <Form.Item label="Selling price of excess energy (INR/MWh)">
            <InputNumber
              min={0}
              value={curtailmentInputs.curtailment_selling_price}
              onChange={(value) =>
                setCurtailmentInputs((prev) => ({
                  ...prev,
                  curtailment_selling_price: value,
                }))
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Percentage of excess energy sold(%)">
            <InputNumber
              min={0}
              max={100}
              value={curtailmentInputs.sell_curtailment_percentage}
              onChange={(value) =>
                setCurtailmentInputs((prev) => ({
                  ...prev,
                  sell_curtailment_percentage: value,
                }))
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* {isLoading && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />} */}
    </div>
  );
};

export default GeneratorInput;
