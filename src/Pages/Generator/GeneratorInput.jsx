/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Typography,
  Card,
  Button,
  Upload,
  message,
  Space,
  InputNumber,
  Tooltip,
  Modal,
  Row,
  Col,
  Select,
  Checkbox,
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { data, useLocation, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";

import {
  addConsumption,
  fetchMonthlyDataById,
} from "../../Redux/Slices/Consumer/monthlyConsumptionSlice";
import "../EnergyTable.css";
import { consumptionBill } from "../../Redux/Slices/Consumer/monthlyConsumptionBillSlice";
import { addScada } from "../../Redux/Slices/Consumer/uploadScadaSlice";
import { uploadCSV } from "../../Redux/Slices/Consumer/uploadCSVFileSlice";
import { getAllProjectsById } from "../../Redux/Slices/Generator/portfolioSlice";
import moment from "moment";
import { fetchCapacitySizing } from "../../Redux/Slices/Generator/capacitySizingSlice";

const { Title } = Typography;

// Function to render a label with a tooltip
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

const GeneratorInput = () => {
  const location = useLocation();
  const requirementId = localStorage.getItem("selectedRequirementId") || 26; // Destructure state to get `requirementId` and `annualSavin
  const [activeButton, setActiveButton] = useState(null); // State to control active button
  const currentYear = new Date().getFullYear(); // Get the current year
  const lastYear = currentYear - 1; // Calculate the last year
  const [uploadedFileName, setUploadedFileName] = useState(localStorage.getItem("uploadedFileName") || ""); // Load from localStorage
  const [uploadMonthlyFile, setUploadMonthlyFile] = useState("");
  const [Structuredprojects, setStructuredProjects] = useState([]); // Local state for flattened projects
const [checkPortfolio, setCheckPortfolio] = useState([]); // Ensure it's initialized as an array
const [base64CSVFile, setBase64CSVFile] = useState(""); // State to store Base64 CSV file
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")).user;
console.log(user);
const user_id=user?.id;
  const { status, projects } = useSelector((state) => state.portfolio);

  if (status === "idle") {
    dispatch(getAllProjectsById(user.id)); // Fetch projects
  }

  const handleRecordCheck = (recordId, isChecked) => {
    setCheckPortfolio((prev) =>
      Array.isArray(prev) // Ensure `prev` is an array
        ? isChecked
          ? [...prev, recordId] // Add the ID if checked
          : prev.filter((id) => id !== recordId) // Remove the ID if unchecked
        : [] // Fallback to an empty array if `prev` is not an array
    );
  };

  useEffect(() => {
    if (projects.Solar || projects.Wind || projects.ESS) {
      const flatProjects = [
        ...(projects.Solar || []).map((project) => ({
          ...project,
          type: "Solar",
        })),
        ...(projects.Wind || []).map((project) => ({
          ...project,
          type: "Wind",
        })),
        ...(projects.ESS || []).map((project) => ({ ...project, type: "ESS" })),
      ];
      setStructuredProjects(flatProjects); // Update local state with flattened data
    }
  }, [projects.Solar, projects.Wind, projects.ESS]);

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
      render: (text) => {
        return text === "ESS" ? `${text} MWh` : `${text} MW`;
      },
    },
    {
      title: "COD (Commercial Operation Date)",
      dataIndex: "cod",
      key: "cod",
      render: (text) => moment(text).format("DD-MM-YYYY"), // Format date
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Checkbox
          onChange={(e) => handleRecordCheck(record.id, e.target.checked)}
          style={{ border: "green" }}
        />
      ),
    },
  ];
  
  // console.log(checkPortfolio);
 const handleRunOptimizer = async () => {
  if (!Array.isArray(checkPortfolio)) {
    console.error("checkPortfolio is not an array");
    message.error("An error occurred. Please try again.");
    return;
  }

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
  };

  try {
    const response = await dispatch(fetchCapacitySizing(modalData)).unwrap();
    if (response && response.combinations) {
      console.log("Navigating to /generator/combination-pattern"); // Debugging log
      navigate("/generator/capacity-sizing-pattern", { state: { data: response } }); // Pass response as state
    } else {
      message.error("No combinations found. Please check your input.");
    }
  } catch (error) {
    console.error("Error running optimizer:", error);
    message.error("An error occurred while running the optimizer. Please try again.");
  }
}; 
  const handleCSVUpload = async (file) => {
    try {
      // Validate the CSV file format
      const isValidFormat = file.name.endsWith(".csv");
      if (!isValidFormat) {
        message.error("Please upload a valid CSV file.");
        return false;
      }

      // Display a success message for file selection
      message.success(`${file.name} uploaded successfully`);
      setUploadedFileName(file.name); // Set the latest uploaded file name
      localStorage.setItem("uploadedFileName", file.name); // Save to localStorage

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix
        setBase64CSVFile(base64File); // Store Base64-encoded CSV file
      };

      reader.readAsDataURL(file); // Read the file as a Base64 string
      return false; // Prevent automatic upload
    } catch (error) {
      console.error("Error uploading the file:", error);
      message.error(
        "An error occurred during the upload process. Please try again."
      );
      return false;
    }
  };

  useEffect(() => {
    // Clear uploaded file name on refresh
    return () => {
      localStorage.removeItem("uploadedFileName");
    };
  }, []);

  const handleDownloadTemplate = () => {
    // Logic to download the CSV template
    const link = document.createElement("a");
    link.href = "/src/assets/csvFormat.csv"; // Update with the actual path to your template
    link.download = "template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadButtonRef = React.createRef(); // Replace findDOMNode with ref

  return (
    <div
      style={{
       
        justifyContent: "center",
        width: "100%",
        alignItems: "center",
      }}
    >
       <Card
        style={{
          marginTop: "20px",
          width: "100%",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Col span={24}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Download a CSV file">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
                style={{
                  marginRight: "20px",
                  zIndex: 100,
                  height: "30px",
                  width: 40,
                }}
              ></Button>
            </Tooltip>
            <Upload
              ref={uploadButtonRef} // Add ref directly to the Upload component
              beforeUpload={handleCSVUpload}
              showUploadList={false}
            >
              <Tooltip title="Upload a CSV file">
                <Button
                  style={{ padding: "5px", zIndex: 100 }}
                  icon={<FileExcelOutlined style={{ marginTop: "5px" }} />}
                >
                  Upload CSV file
                </Button>
              </Tooltip>
            </Upload>
            <Title level={4} style={{ color: "#669800", background:'#f8f8f8', marginBottom: "10px", padding: '10px',marginLeft:'20px' }}>
            {/* Choose the portfolios to be processed in the model execution. */}
            Upload the consumption data
            </Title>
          </div>
          {activeButton === "csv" && uploadedFileName && (
            <div style={{ marginTop: "10px" }}>
              <span>Uploaded File: {uploadedFileName}</span>
            </div>
          )}
       
        </Col>
      </Card>
      <Card style={{
          marginTop: "20px",
          width: "100%",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}>
          <span><p>Select the portfolios to be processed in the model execution and run the Optimizer Model</p>
          {/* <h2>Available Generation Portfolio</h2> */}
          <Button style={{ position: 'absolute', right: '0' }} onClick={handleRunOptimizer}>
  Run Optimizer
</Button>
</span>
        <Table
          dataSource={Structuredprojects.map((project, index) => ({
            ...project,
            key: index,
          }))}
          columns={columns}
          pagination={false}
          bordered
          style={{marginTop:'60px'}}
          loading={status === "loading"}
        />
      </Card>
     
     
    </div>
  );
};

export default GeneratorInput;
