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
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  DownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

import {
  addConsumption,
  fetchMonthlyDataById,
} from "../../Redux/Slices/Consumer/monthlyConsumptionSlice";
import "../EnergyTable.css";
import { consumptionBill } from "../../Redux/Slices/Consumer/monthlyConsumptionBillSlice";
import { addScada } from "../../Redux/Slices/Consumer/uploadScadaSlice";
import { uploadCSV } from "../../Redux/Slices/Consumer/uploadCSVFileSlice";

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

const EnergyConsumptionTable = () => {
  const location = useLocation();
  const { requirementId, reReplacement } = location.state || {}; // Destructure state to get `requirementId` and `annualSaving`
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [showTable, setShowTable] = useState(false); // State to control table visibility
  const [activeButton, setActiveButton] = useState(null); // State to control active button
  const [isActionCompleted, setIsActionCompleted] = useState(false); // State to track if any action is completed
  const [showFileUploadTable, setShowFileUploadTable] = useState(false); // State to control file upload table visibility
  const [saveSuccess, setSaveSuccess] = useState(false); // State to track save success
  const [saveError, setSaveError] = useState(false); // State to track save error

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const handleDownloadTemplate = () => {
    // Logic to download the CSV template
    const link = document.createElement("a");
    link.href = "/src/assets/csvFormat.csv"; // Update with the actual path to your template
    link.download = "template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleDetails = () => {
    setShowTable((prevShowTable) => !prevShowTable);
    setShowFileUploadTable(false); // Close file upload table
    setActiveButton("details");
    setIsActionCompleted(true); // Mark action as completed
  };

  const handleScadaUpload = async (file) => {
    message.success(`${file.name} uploaded successfully`);
    setFileUploaded(true);
    setUploadedFileName(file.name);
    setIsActionCompleted(true); // Mark action as completed

    // Convert file to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

      // Dispatch the addScada thunk with the required format
      await dispatch(
        addScada({
          id: requirementId,
          file: base64File,
        })
      );
    };
    reader.readAsDataURL(file); // Read the file as a Base64 string

    return false; // Prevent automatic upload
  };

  const handleCSVUpload = async (file) => {
    // Validate the CSV file format
    const isValidFormat = file.name.endsWith(".csv");
    if (!isValidFormat) {
      message.error("Please upload a valid CSV file.");
      return false;
    }

    message.success(`${file.name} uploaded successfully`);
    setUploadedFileName(file.name); // Set the latest uploaded file name
    setIsActionCompleted(true); // Mark action as completed

    // Convert file to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

      // Parse CSV data and update dataSource
      const csvData = atob(base64File);
      const parsedData = csvData.split("\n").map((row) => row.split(","));
      const updatedDataSource = dataSource.map((item, index) => {
        const row = parsedData[index + 1]; // Skip header row
        return row
          ? {
              ...item,
              monthlyConsumption: parseFloat(row[1]),
              peakConsumption: parseFloat(row[2]),
              offPeakConsumption: parseFloat(row[3]),
              monthlyBill: parseFloat(row[4]),
            }
          : item;
      });
      setDataSource(updatedDataSource);

      // Dispatch the uploadCSV thunk
      await dispatch(
        uploadCSV({ requirement_id: requirementId, file: base64File })
      );
    };
    reader.readAsDataURL(file); // Read the file as a Base64 string

    return false; // Prevent automatic upload
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const [dataSource, setDataSource] = useState(
    Array.from({ length: 12 }, (_, index) => ({
      key: index,
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][index],
      monthlyConsumption: null,
      peakConsumption: null,
      offPeakConsumption: null,
      monthlyBill: null,
      fileUploaded: null,
    }))
  );

  const monthlyData = useSelector(
    (state) => state.monthlyData?.monthlyData || []
  );

  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadMonthlyFile, setUploadMonthlyFile] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch monthly data when requirementId changes
  useEffect(() => {
    if (requirementId) {
      dispatch(fetchMonthlyDataById(requirementId));
    }
  }, [requirementId, dispatch]);

  // Update dataSource when monthlyData is fetched
  useEffect(() => {
    //   console.log(monthlyData);
    if (monthlyData.length > 0) {
      const updatedDataSource = dataSource.map((item) => {
        const data = monthlyData.find((data) => data.month === item.month);
        return data
          ? {
              ...item,
              monthlyConsumption: data.monthly_consumption,
              peakConsumption: data.peak_consumption,
              offPeakConsumption: data.off_peak_consumption,
              monthlyBill: data.monthly_bill_amount,
            }
          : item;
      });
      setDataSource(updatedDataSource);
      // console.log(updatedDataSource);
    }
  }, [monthlyData]);

  // Check if all fields are filled
  useEffect(() => {
    const allFilled = dataSource.every(
      (item) =>
        (item.monthlyConsumption !== null &&
          item.peakConsumption !== null &&
          item.offPeakConsumption !== null &&
          item.monthlyBill !== null) ||
        item.fileUploaded !== null
    );
    setAllFieldsFilled(allFilled);
  }, [dataSource]);

  const handleInputChange = (value, key, dataIndex) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        [dataIndex]: value,
        fileUploaded: null,
      });
      setDataSource(newData);
    }
  };

  const handleToggleFileUploadTable = () => {
    setShowFileUploadTable((prevShowFileUploadTable) => !prevShowFileUploadTable);
    setShowTable(false); // Close details table
    setActiveButton("bill");
    setIsActionCompleted(true); // Mark action as completed
  };

  const handleFileUpload = async (file, key) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        fileUploaded: file.name,
        monthlyConsumption: null,
        peakConsumption: null,
        offPeakConsumption: null,
        monthlyBill: null,
      });
      setDataSource(newData);
      message.success(`${file.name} uploaded successfully`);
      setUploadMonthlyFile(file.name);
      setIsActionCompleted(true); // Mark action as completed

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

        // Dispatch the consumptionBill thunk with the required format
        await dispatch(
          consumptionBill({
            requirement: requirementId,
            month: item.month,
            bill_file: base64File,
          })
        );
      };
      reader.readAsDataURL(file); // Read the file as a Base64 string
    }
    return false; // Prevent automatic upload
  };

  const handleContinue = () => {
    // setIsModalVisible(true);
    navigate("/consumer/consumption-pattern", {
      state: { requirementId, reReplacement },
    });
  };

  const handleSkip = () => {
    navigate("/consumer/consumption-pattern", {
      state: { requirementId, reReplacement },
    });
  };

  const handleSave = async () => {
    if (!allFieldsFilled) {
      message.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const values = dataSource.map((item) => ({
        requirement: requirementId,
        month: item.month,
        monthly_consumption: item.monthlyConsumption,
        peak_consumption: item.peakConsumption,
        off_peak_consumption: item.offPeakConsumption,
        monthly_bill_amount: item.monthlyBill,
      }));
      // Call the API to add the requirement
      console.log(values);

      const response = await dispatch(addConsumption(values)).unwrap();

      console.log("resssss", response);

      message.success({
        content: "Monthly data added successfully!",
        style: {
          position: "absolute",
          bottom: "0px",
          marginTop:'90%',
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        },
      });

      // Show the modal after saving data
      setSaveSuccess(true); // Set save success to true
      setSaveError(false); // Reset save error
    } catch (error) {
      // ...existing code...
      message.error("Failed to add monthly data");
      setSaveError(true); // Set save error to true
    } finally {
      setLoading(false);
      // message.success("Monthly data added successfully!");
     

    }
  };

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000); // Hide success message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => {
        setSaveError(false);
      }, 3000); // Hide error message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [saveError]);

  const handleFillBelow = (dataIndex) => {
    const newData = [...dataSource];
    const firstValue = newData[0][dataIndex];
    newData.forEach((item, index) => {
      if (index > 0) {
        item[dataIndex] = firstValue;
      }
    });
    setDataSource(newData);
  };

  const handleImageUpload = async (file) => {
    message.success(`${file.name} uploaded successfully`);
    // Add your image upload handling logic here
    return false; // Prevent automatic upload
  };

  const handleScada = () => {
    message.success("success");
  };

  const handleFileUploadModal = async (file) => {
    message.success(`${file.name} uploaded successfully`);
    setFileUploaded(true);
    setUploadedFileName(file.name);

    // Convert file to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

      // Dispatch the addScada thunk with the required format
      await dispatch(
        addScada({
          id: requirementId,
          file: base64File,
        })
      );
    };
    reader.readAsDataURL(file); // Read the file as a Base64 string

    return false; // Prevent automatic upload
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Consumption (MWh)",
        "Total energy consumed during the month in megawatt-hours.",
        () => handleFillBelow("monthlyConsumption")
      ),
      dataIndex: "monthlyConsumption",
      key: "monthlyConsumption",
      editable: true,
      render: (_, record) => (
        <InputNumber
          value={record.monthlyConsumption}
          onChange={(value) =>
            handleInputChange(value, record.key, "monthlyConsumption")
          }
          style={{ width: "100%" }}
          min={0}
          // disabled={record.fileUploaded !== null}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "Peak Consumption (MWh)",
        "Energy consumption during peak hours in megawatt-hours.",
        () => handleFillBelow("peakConsumption")
      ),
      dataIndex: "peakConsumption",
      key: "peakConsumption",
      editable: true,
      render: (_, record) => (
        <InputNumber
          value={record.peakConsumption}
          onChange={(value) =>
            handleInputChange(value, record.key, "peakConsumption")
          }
          style={{ width: "100%" }}
          min={0}
          // disabled={record.fileUploaded !== null}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "Off-Peak Consumption (MWh)",
        "Energy consumption during off-peak hours in megawatt-hours.",
        () => handleFillBelow("offPeakConsumption")
      ),
      dataIndex: "offPeakConsumption",
      key: "offPeakConsumption",
      editable: true,
      render: (_, record) => (
        <InputNumber
          value={record.offPeakConsumption}
          onChange={(value) =>
            handleInputChange(value, record.key, "offPeakConsumption")
          }
          style={{ width: "100%" }}
          min={0}
          // disabled={record.fileUploaded !== null}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Bill (INR)",
        "The total cost of energy consumed during the month.",
        () => handleFillBelow("monthlyBill")
      ),
      dataIndex: "monthlyBill",
      key: "monthlyBill",
      editable: true,
      render: (_, record) => (
        <InputNumber
          value={record.monthlyBill}
          onChange={(value) =>
            handleInputChange(value, record.key, "monthlyBill")
          }
          style={{ width: "100%" }}
          min={0}
          // disabled={record.fileUploaded !== null}
        />
      ),
    },
  ];

  const fileUploadColumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Upload File",
      dataIndex: "fileUpload",
      key: "fileUpload",
      render: (_, record) => (
        <div>
          <Upload
            beforeUpload={(file) => handleFileUpload(file, record.key)}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}></Button>
          </Upload>
          {record.fileUploaded && (
            <div style={{ marginTop: "10px" }}>
              <span>Uploaded File: {record.fileUploaded}</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleInputChange,
      }),
    };
  });

  return (
    <div className="energy-table-container" style={{ padding: "20px" }}>
      <Card style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/*<p>Please fill the details for making your energy transition plan.</p> */}
        <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: "absolute", marginLeft: "95%", right: 30 }}
          />
        </Tooltip>
        <Title level={3} style={{ textAlign: "center", marginTop: "10px" }}>
          Energy Consumption Data (12 Months)
        </Title>
<p>Provide / Upload / Amend your energy consumption data for the last 12 months.</p>
        {/* <div style={{ display: "flex", alignItems: "center", gap: "15px" }}> */}
        <Row>
          <Col span={6}>
            <Tooltip title="Add details manually">
              <Button onClick={handleToggleDetails}>
                {showTable ? "Add Details +" : "Add Details +"}
              </Button>
            </Tooltip>
          </Col>

          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Upload beforeUpload={handleCSVUpload} showUploadList={false}>
                <Tooltip title="Upload a CSV file">
                  <Button
                    onClick={() => handleButtonClick("csv")}
                    style={{ padding: "5px" }}
                    icon={<UploadOutlined style={{ marginTop: "5px" }} />}
                  >
                    Upload CSV file
                  </Button>
                </Tooltip>
              </Upload>
              <Tooltip title="Download a CSV file">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                  style={{ marginLeft: "10px" }}
                ></Button>
              </Tooltip>
            </div>
            {activeButton === "csv" && uploadedFileName && (
              <div style={{ marginTop: "10px" }}>
                <span>Uploaded File: {uploadedFileName}</span>
              </div>
            )}
          </Col>

          <Col span={6}>
            <Tooltip title="Upload your monthly electricity bill">
              <Button
                onClick={handleToggleFileUploadTable}
                style={{ marginLeft: "50px", padding: "5px" }}
                icon={<UploadOutlined style={{ marginTop: "5px" }} />}
              >
                Upload Bill
              </Button>
            </Tooltip>
            {activeButton === "bill" && fileUploaded && (
              <div style={{ marginTop: "10px" }}>
                <span>Uploaded File: {uploadedFileName}</span>
              </div>
            )}
          </Col>

          <Col span={6}>
            <Tooltip title="Upload a SCADA file">
              <Upload showUploadList={false} beforeUpload={handleScadaUpload}>
                <Button
                  onClick={() => handleButtonClick("scada")}
                  style={{ padding: "5px" }}
                  icon={<UploadOutlined style={{ marginTop: "5px" }} />}
                >
                  Upload SCADA file
                </Button>
              </Upload>
              {activeButton === "scada" && fileUploaded && (
                <div style={{ marginTop: "10px" }}>
                  <span>Uploaded File: {uploadedFileName}</span>
                </div>
              )}
            </Tooltip>
          </Col>
        </Row>
        {/* </div> */}

        {showTable && (
          <>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
              size="small"
              tableLayout="fixed"
              style={{ marginTop: "20px" }}
            />
            <div
              style={{
               
                marginTop: "30px",
                transform: 'translateX(-108px)',
                marginLeft: '86%',
                marginBottom: '-40px'
              }}
            >
              {saveSuccess && (
                <span style={{ color: "green"}}>
                  Data saved successfully!
                </span>
              )}
              {saveError && (
                <span style={{ color: "red"}}>
                  Failed to save data!
                </span>
              )}
              <Button
                type="primary"
                onClick={handleSave}
                disabled={!allFieldsFilled}
                loading={loading}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              
            </div>
          </>
        )}

        {showFileUploadTable && (
          <Table
            dataSource={dataSource}
            columns={fileUploadColumns}
            pagination={false}
            bordered
            size="small"
            tableLayout="fixed"
            style={{ marginTop: "20px" }}
          />
        )}
        <Tooltip
          title={
            !isActionCompleted
              ? "Please fill the details or upload any file"
              : ""
          }
          placement="top"
        >
          <Button
            type="primary"
            onClick={handleContinue}
            disabled={!isActionCompleted} // Enable only if an action is completed
            style={{ marginLeft: "86%" , marginTop: "8px"}}
          >
            Continue
          </Button>
        </Tooltip>
      </Card>

      <Modal
        title="Upload SCADA File"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <span>
          {" "}
          For more accuracy, you can upload a SCADA_15 min dump energy
          consumption file.
        </span>
        <Upload
          style={{ marginLeft: "5%" }}
          beforeUpload={handleFileUploadModal}
          showUploadList={false}
        >
          <Button style={{ marginLeft: "5%" }} icon={<UploadOutlined />}>
            Upload File
          </Button>
        </Upload>
        {fileUploaded && (
          <div style={{ marginTop: "10px" }}>
            <span>Uploaded File: {uploadedFileName}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          {!fileUploaded && (
            <Button
              onClick={() => setIsModalVisible(false)}
              // onClick={handleSkip}
              style={{ marginRight: "10px" }}
            >
              Back
            </Button>
          )}
          {fileUploaded && (
            <Button type="primary" onClick={handleSkip}>
              Continue
            </Button>
          )}
        </div>
        <button onClick={handleSkip}>Skip</button>
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
        <p>Hi</p>

        <p>Please follow these steps to proceed:</p>
      </Modal>
    </div>
  );
};

export default EnergyConsumptionTable;
