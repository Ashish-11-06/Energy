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

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
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

          // Dispatch the uploadCSV thunk and wait for the result
          await dispatch(
            uploadCSV({ requirement_id: requirementId, file: base64File })
          );

          // Mark action as completed only if upload succeeds
          setIsActionCompleted(true);
          handleToggleDetails();
        } catch (error) {
          console.error("Error processing the file:", error);
          message.error(
            "An error occurred while processing the file. Please try again."
          );
        }
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
    setShowFileUploadTable(
      (prevShowFileUploadTable) => !prevShowFileUploadTable
    );
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

  const handleYearChange = (year) => {
    console.log("Selected Year:", year);
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
          marginTop: "90%",
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

  const generateYears = () => {
    return Array.from({ length: 30000 - 2000 + 1 }, (_, i) => 2000 + i);
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
      width: 250,
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
      with: 300,
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
      width: 180,
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

  const renderSixMonthTables = () => {
    const firstHalf = dataSource.slice(0, 6);
    const secondHalf = dataSource.slice(6, 12);

    return (
      <Row gutter={16}>
        <Col span={12}>
          <Table
            dataSource={firstHalf}
            columns={columns}
            pagination={false}
            bordered
            size="small"
            tableLayout="fixed"
            style={{ marginTop: "20px" }}
          />
        </Col>
        <Col span={12}>
          <Table
            dataSource={secondHalf}
            columns={columns}
            pagination={false}
            bordered
            size="small"
            tableLayout="fixed"
            style={{ marginTop: "20px" }}
          />
        </Col>
      </Row>
    );
  };

  const renderSixMonthFileUploadTables = () => {
    const firstHalf = dataSource.slice(0, 6);
    const secondHalf = dataSource.slice(6, 12);

    return (
      <Row gutter={16}>
        <Col span={12}>
          <Table
            dataSource={firstHalf}
            columns={fileUploadColumns}
            pagination={false}
            bordered
            size="small"
            tableLayout="fixed"
            style={{ marginTop: "20px" }}
          />
        </Col>
        <Col span={12}>
          <Table
            dataSource={secondHalf}
            columns={fileUploadColumns}
            pagination={false}
            bordered
            size="small"
            tableLayout="fixed"
            style={{ marginTop: "20px" }}
          />
        </Col>
      </Row>
    );
  };

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
        <span>
  <Row justify="center" align="middle" style={{ width: '100%' }}>
    <Col xs={24} sm={12} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
      <h2 style={{ textAlign: "center", marginTop: "10px", transform: 'translateX(120px)' }}>
        Energy Consumption Data (12 Months)
      </h2>
    </Col>
    <Col xs={24} sm={12} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
      {generateYears() && (
        <Select
          style={{
            width: 150,
            border: "1px solid #669800",
            borderRadius: "5px",
            transform: 'translateX(-20px)',
          }}
          placeholder="Select Year"
          onChange={handleYearChange}
        >
          {generateYears().map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      )}
    </Col>
  </Row>
</span>
        
       
        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  <p style={{ margin: 0 }}>
   {`(`} Provide / Upload / Amend your energy consumption data for the last 12 months. {`)`}
  </p>
  
</span>

        {/* <div style={{ display: "flex", alignItems: "center", gap: "15px" }}> */}
        <Row style={{marginTop:'3%'}}>
          <Col span={6}>
            <Tooltip title="Add details manually">
              <Button onClick={handleToggleDetails} icon={<FileAddOutlined />}>
                {showTable ? "Add Details " : "Add Details "}
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
                    icon={<FileExcelOutlined style={{ marginTop: "5px" }} />}
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
                icon={<FileTextOutlined style={{ marginTop: "5px" }} />}
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
                  icon={<FileImageOutlined style={{ marginTop: "5px" }} />}
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
                transform: "translateX(-108px)",
                marginLeft: "86%",
                marginBottom: "-40px",
              }}
            >
              {saveSuccess && (
                <span style={{ color: "green" }}>Data saved successfully!</span>
              )}
              {saveError && (
                <span style={{ color: "red" }}>Failed to save data!</span>
              )}
              <Tooltip title="Save the entered/updated data">
                <Button
                  type="primary"
                  onClick={handleSave}
                  disabled={!allFieldsFilled}
                  loading={loading}
                  style={{ marginRight: "10px" }}
                >
                  Save
                </Button>
              </Tooltip>
            </div>
          </>
        )}
        {showFileUploadTable && renderSixMonthFileUploadTables()}
        <Tooltip
          title={
            !isActionCompleted
              ? "Please fill the details or upload any file"
              : "Proceed to the next step"
          }
          placement="top"
        >
          <Button
            type="primary"
            onClick={handleContinue}
            disabled={!isActionCompleted} // Enable only if an action is completed
            style={{ marginLeft: "86%", marginTop: "8px" }}
          >
            Continue {`>>`}
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
        <ol>
       <li> <strong>Add Details:</strong> Click the "Add Details" button to open a table where you can enter the data month by month.</li>

<li><strong>Upload CSV File:</strong> Download the CSV template, fill it with the required information, and upload the completed file in the specified format.</li>

<li><strong>Upload Bill:</strong> Upload monthly bills for all 12 months.</li>

<li><strong>Upload SCADA File:</strong> For more accurate data, you can upload a SCADA file with 15-minute interval dumps.</li>
</ol>
      </Modal>
    </div>
  );
};

export default EnergyConsumptionTable;
