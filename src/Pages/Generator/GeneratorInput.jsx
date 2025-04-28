import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "jspdf-autotable";
import { getAllProjectsById } from "../../Redux/Slices/Generator/portfolioSlice";
import moment from "moment";
import { getCapacitySizingData } from "../../Redux/Slices/Generator/capacitySizingSlice";
import { handleDownloadPdf } from "./CapacitySizingDownload";

const { Title } = Typography;

const GeneratorInput = () => {
  const [uploadedFileName, setUploadedFileName] = useState(""); // Remove localStorage dependency
  const [Structuredprojects, setStructuredProjects] = useState([]);
  const [checkPortfolio, setCheckPortfolio] = useState([]);
  const [base64CSVFile, setBase64CSVFile] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capacitySizingData, setCapacitySizingData] = useState(null);
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

  if (status === "idle") {
    dispatch(getAllProjectsById(user.id));
  }

  const handleRecordCheck = (recordId, isChecked) => {
    setCheckPortfolio((prev) =>
      isChecked ? [...prev, recordId] : prev.filter((id) => id !== recordId)
    );
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
          onChange={(e) => handleRecordCheck(record.id, e.target.checked)}
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
    {
      title: "OA Cost (INR/kWh)", // New column for OA Cost
      dataIndex: "oa_cost",
      key: "oa_cost",
    },
    {
      title: "Final Cost (INR/kWh)",
      dataIndex: "final_cost",
      key: "final_cost",
    },
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
            onClick={() => handleDownloadPdf(record)}
          >
            Download
          </Button>

        </div>
      ),
    },

  ];

  const handleRunOptimizer = async () => {
    if (!base64CSVFile) {
      message.error("Please upload a CSV file to run the optimizer.");
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

    const solarPortfolio = Structuredprojects.filter(
      (p) => p.type === "Solar" && checkPortfolio.includes(p.id)
    ).map((p) => p.id);
    const windPortfolio = Structuredprojects.filter(
      (p) => p.type === "Wind" && checkPortfolio.includes(p.id)
    ).map((p) => p.id);
    const essPortfolio = Structuredprojects.filter(
      (p) => p.type === "ESS" && checkPortfolio.includes(p.id)
    ).map((p) => p.id);

    const modalData = {
      user_id: user_id,
      solar_portfolio: solarPortfolio,
      wind_portfolio: windPortfolio,
      ess_portfolio: essPortfolio,
      csv_file: base64CSVFile,
      ...curtailmentInputs, // Include additional inputs
    };

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
            <div style={{ display: "flex", alignItems: "center" }}>
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

            </div>
            {uploadedFileName && <div style={{ margin: "10px", color: 'GrayText' }}>Uploaded File: {uploadedFileName}</div>}
          </Row>


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
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <Button onClick={handleRunOptimizer}>
              Run Optimizer
            </Button>
          </div>
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
        title="Additional Inputs"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Maximum limit for excess energy (%)">
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={curtailmentInputs.annual_curtailment_limit}
              onChange={(value) =>
                setCurtailmentInputs((prev) => ({
                  ...prev,
                  annual_curtailment_limit: value,
                }))
              }
              style={{ width: "100%" }}
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
