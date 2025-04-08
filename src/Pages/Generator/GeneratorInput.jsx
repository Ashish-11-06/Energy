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
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllProjectsById } from "../../Redux/Slices/Generator/portfolioSlice";
import moment from "moment";

const { Title } = Typography;

const GeneratorInput = () => {
  const [uploadedFileName, setUploadedFileName] = useState(""); // Remove localStorage dependency
  const [Structuredprojects, setStructuredProjects] = useState([]);
  const [checkPortfolio, setCheckPortfolio] = useState([]);
  const [base64CSVFile, setBase64CSVFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => handleRecordCheck(record.id, e.target.checked)}
        />
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
    <div style={{ justifyContent: "center", width: "100%", alignItems: "center" }}>
      <Card style={{ marginTop: "20px", width: "100%", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px", backgroundColor: "#fff" }}>
        <Col span={24}>
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
            <Title level={4} style={{ color: "#669800", marginLeft: "20px" }}>
              Upload the Demand data
            </Title>
          </div>
          {uploadedFileName && <div style={{ marginTop: "10px" }}>Uploaded File: {uploadedFileName}</div>}
        </Col>
      </Card>
      <Card style={{ marginTop: "20px", width: "100%", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px", backgroundColor: "#fff" }}>
        <p>Select the portfolios to be processed in the model execution and run the Optimizer Model</p>
        <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "60px" }}>
          <Table
            dataSource={Structuredprojects.map((project, index) => ({ ...project, key: index }))}
            columns={columns}
            pagination={false}
            bordered
            style={{ marginTop: "20px" }}
            loading={status === "loading"}
          />
        </div>
        <Button
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          onClick={handleRunOptimizer}
        >
          Run Optimizer
        </Button>
      </Card>
      <Modal
        title="Additional Inputs"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
        <Form.Item label="Maximum limit for excess energy">
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
      {isLoading && <Spin size="large" style={{ display: "block", margin: "20px auto" }} />}
    </div>
  );
};

export default GeneratorInput;
