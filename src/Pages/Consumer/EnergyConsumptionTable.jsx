/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useMemo } from "react";
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
import { data, useLocation, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";


import {
  addConsumption,
  fetchMonthlyDataById,
} from "../../Redux/Slices/Consumer/monthlyConsumptionSlice";
import "../EnergyTable.css";
import { consumptionBill } from "../../Redux/Slices/Consumer/monthlyConsumptionBillSlice";
import { addScada } from "../../Redux/Slices/Consumer/uploadScadaSlice";
import { uploadCSV } from "../../Redux/Slices/Consumer/uploadCSVFileSlice";



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
  const { reReplacement } = location.state || {};
  const requirementId = localStorage.getItem('selectedRequirementId') // Destructure state to get `requirementId` and `annualSaving`
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [showTable, setShowTable] = useState(false); // State to control table visibility
  const [activeButton, setActiveButton] = useState(null); // State to control active button
  const [isActionCompleted, setIsActionCompleted] = useState(false); // State to track if any action is completed
  const [showFileUploadTable, setShowFileUploadTable] = useState(false); // State to control file upload table visibility
  const [saveSuccess, setSaveSuccess] = useState(false); // State to track save success
  const [saveError, setSaveError] = useState(false); // State to track save error
  const [temp, setTemp] = useState('');
  const user = JSON.parse(localStorage.getItem("user")).user;
  const [buttonDisable, setButtonDisable] = useState(false);
  const currentYear = new Date().getFullYear(); // Get the current year
  const lastYear = currentYear - 1; // Calculate the last year
  const lastYearCurrentYear = `${lastYear}-${currentYear.toString().slice(-2)}`
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadMonthlyFile, setUploadMonthlyFile] = useState("");
  const [scadaFileUpload, setScadaFileUpload] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fieldsupdated, setFieldsUpdated] = useState(false); // State to track if fields are updated
  const [enterDataUploadFailed, setEnterDataUploadFailed] = useState(false); // State to track CSV upload failure

  // console.log(isActionCompleted);

  // console.log(user.role);

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };
  // const handleDownloadTemplate = () => {
  //   // Logic to download the CSV template
  //   const link = document.createElement("a");
  //   link.href = "/assets/csvFormat.csv"; // Update with the actual path to your template
  //   link.download = "template.csv";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownloadTemplate = () => {
    // Define the headers and rows
    const headers = [
      "Month",
      "Monthly Consumption (MWh)",
      "Peak Consumption (MWh)",
      "Off Peak Consumption (MWh)",
      "Monthly Bill Amount (INR cr)"
    ];
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    csvContent += months.map(month => `${month},,,,`).join("\n");
  
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "12monthdatatemplate.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };
  

  const handleToggleDetails = () => {

    setShowTable((prevShowTable) => !prevShowTable);
    setShowFileUploadTable(false); // Close file upload table
    setActiveButton("details");
  };

  const handleScadaUpload = async (file) => {

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
    message.success(`${file.name} uploaded successfully`);
    setScadaFileUpload(true);
    setFileUploaded(true);
    setUploadedFileName(file.name);
    setIsActionCompleted(true); // Mark action as completed
    { dataSource && showTable }

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
      // message.success(`${file.name} uploaded successfully`);
      setUploadedFileName(file.name); // Set the latest uploaded file name

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

          // Parse CSV data and update dataSource
          // const csvData = atob(base64File);
          // const parsedData = csvData.split("\n").map((row) => row.split(","));
          // const updatedDataSource = dataSource.map((item, index) => {
          //   const row = parsedData[index + 1]; // Skip header row
          //   return row
          //     ? {
          //       ...item,
          //       monthlyConsumption: parseFloat(row[1]),
          //       peakConsumption: parseFloat(row[2]), 
          //       offPeakConsumption: parseFloat(row[3]),
          //       monthlyBill: parseFloat(row[4]),
          //     }
          //     : item;
          // });

          // setDataSource(updatedDataSource);

          // Dispatch the uploadCSV thunk and wait for the result
         const response = await dispatch(
            uploadCSV({ requirement_id: requirementId, file: base64File })
          ).unwrap();
          // console.log("CSV upload response:", response);

          // Mark action as completed only if upload succeeds
          setIsActionCompleted(true);
          handleToggleDetails();
        } catch (error) {
          // console.error("Error processing the file:", error);
          message.error(
            error.message || error ||
            "An error occurred while processing the file. Please try again."
          );
        }
      };

      reader.readAsDataURL(file); // Read the file as a Base64 string
      return false; // Prevent automatic upload
    } catch (error) {
      // console.error("Error uploading the file:", error);
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


  const memoizedDataSource = useMemo(() => dataSource, [dataSource]);

  // console.log(dataSource);
  const monthlyData = useSelector(
    (state) => state.monthlyData?.monthlyData || []
  );


  // Fetch monthly data when requirementId changes
  // Fetch monthly data when requirementId changes
  useEffect(() => {
    const fetchData = async () => {
      if (requirementId) {
        try {
          const response = await dispatch(fetchMonthlyDataById(requirementId)).unwrap();
          const temp = response.length;
          

        let allFieldsValid = true;

        for (let item of response) {
          // Check each key except 'monthlyBill'
          const { monthly_consumption, peak_consumption, off_peak_consumption } = item;
          if (
            monthly_consumption === null ||
            peak_consumption === null ||
            off_peak_consumption === null
          ) {
            // console.log("Invalid data found:", item);
            allFieldsValid = false;
            break;
          }
        }
        

        setFieldsUpdated(allFieldsValid);  

          setTemp(response.length)
          if (temp > 0) {
            setShowTable(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [requirementId, dispatch, isActionCompleted, enterDataUploadFailed]);

  // Update dataSource when monthlyData is fetched
  useEffect(() => {
    //// console.log(monthlyData);
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
      if (monthlyData.length > 1) {
        setShowTable(true);
      }
    }
  }, [monthlyData]);



  const handleInputChange = (value, key, dataIndex) => {
    setDataSource((prevDataSource) => {
      const newDataSource = [...prevDataSource];
      const rowIndex = newDataSource.findIndex((item) => item.key === key);
      if (rowIndex !== -1) {
        newDataSource[rowIndex] = {
          ...newDataSource[rowIndex],
          [dataIndex]: value,
        };
      }
      return newDataSource;
    });
  };

  const handleToggleFileUploadTable = () => {
    setButtonDisable(true);
    setShowFileUploadTable(
      (prevShowFileUploadTable) => !prevShowFileUploadTable
    );
    setShowTable(false); // Close details table
    // setActiveButton("bill");
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
   // console.log('newData',newData);
      
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
      // console.log(values);

      const response = await dispatch(addConsumption(values)).unwrap();

   // console.log("resssss", response);
      setFieldsUpdated(response.fields_updated); 

      message.success({
        content: response.message || "Monthly data added successfully!",
        style: {
          position: "absolute",
          bottom: "-40px",
          // marginTop: "90%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        },
      });

      // Show the modal after saving data
      setSaveSuccess(true); // Set save success to true
      setTimeout(() => setSaveSuccess(false), 3000);
      setSaveError(false); // Reset save error
      
    } catch (error) {
      // ...existing code...
      message.error("Failed to add monthly data");
      setSaveError(true); // Set save error to true
      setTimeout(() => setSaveError(false), 3000);
      setEnterDataUploadFailed(true); // Set data upload failure state
    } finally {
      setLoading(false);
      // message.success("Monthly data added successfully!");
    }
  };

  const handleFillBelow = (dataIndex) => {
    const newData = [...dataSource];
    const firstValue = newData[0][dataIndex];
    newData.forEach((item, index) => {
      if (index > 0) {
        item[dataIndex] = firstValue;
      }
    });
 // console.log('fill below fun',newData);
    
    setDataSource(newData);
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

  const vcolumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Consumption (MWh)",
        "Total energy consumed during the month in megawatt-hours.",
      ),
      dataIndex: "monthlyConsumption",
      key: "monthlyConsumption",
      // width: 250,
    },
    {
      title: renderLabelWithTooltip(
        "Peak Consumption (MWh)",
        "Energy consumption during peak hours in megawatt-hours.",
      ),
      dataIndex: "peakConsumption",
      key: "peakConsumption",
    },
    {
      title: renderLabelWithTooltip(
        "Off-Peak Consumption (MWh)",
        "Energy consumption during off-peak hours in megawatt-hours.",
      ),
      dataIndex: "offPeakConsumption",
      key: "offPeakConsumption",
      with: 300,
      editable: true,
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Bill (INR lakhs)",
        "The total cost of energy consumed during the month.",
      ),
      dataIndex: "monthlyBill",
      key: "monthlyBill",
      editable: true,
      width: 180,
    },
  ];

  const EditableCell = ({ value, onChange, onBlur }) => {
    const [tempValue, setTempValue] = useState(value);
  
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
  

  const columns = useMemo(() => [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 150,
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
        <EditableCell
          value={record.monthlyConsumption}
          onChange={(value) => handleInputChange(value, record.key, "monthlyConsumption")}
          onBlur={() => {}}
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
        <EditableCell
          value={record.peakConsumption}
          onChange={(value) => handleInputChange(value, record.key, "peakConsumption")}
          onBlur={() => {}}
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
        <EditableCell
          value={record.offPeakConsumption}
          onChange={(value) => handleInputChange(value, record.key, "offPeakConsumption")}
          onBlur={() => {}}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Bill (INR lakhs)",
        "The total cost of energy consumed during the month.",
        () => handleFillBelow("monthlyBill")
      ),
      dataIndex: "monthlyBill",
      key: "monthlyBill",
      editable: true,
      render: (_, record) => (
        <EditableCell
          value={record.monthlyBill}
          onChange={(value) => handleInputChange(value, record.key, "monthlyBill")}
          onBlur={() => {}}
        />
      ),
    },
  ], [handleInputChange]);

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


  const renderSixMonthFileUploadTables = () => {
    const firstHalf = dataSource.slice(0, 6);
    const secondHalf = dataSource.slice(6, 12);

    return (
      <Row gutter={16}>
        <p style={{ marginTop: '3%' }}>If you upload bills, it may take 1-2 days for your data to reflect. Please allow this time for processing.</p>
        <Row>
          <Col span={11} style={{ marginRight: '10px' }}>
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
      </Row>
    );
  };

  return (
    <div className="energy-table-container" >
      <Card style={{ maxWidth: "100%", margin: "0 auto", backgroundColor: "#f0f2f5" }}>
        {/*<p>Please fill the details for making your energy transition plan.</p> */}
        <div
          style={{
            border: "1px solid #6698005c",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
          }}
        >
          <Tooltip title="Help">
            <Button
              shape="circle"
              icon={<QuestionCircleOutlined />}
              onClick={showInfoModal}
              style={{ position: "absolute", marginLeft: "95%", right: 30 }}
            />
          </Tooltip>
          <span
            style={{
              width: "100%",
              border: "2px solidrgb(185, 63, 7)",
            }}
          >
            <Row justify="center" align="middle" style={{ width: "100%" }}>
              <Col
                xs={24}
                sm={12}
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    transform: "translateX(235px)",
                  }}
                >
                  Energy Consumption Data (12 Months) {lastYearCurrentYear}
                </h2>
              </Col>
              <Col
                xs={24}
                sm={12}
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >

              </Col>
            </Row>
          </span>

          {(user.role !== "view") ? (<>
            <span
              style={{
                // display: "flex",
                // justifyContent: "space-between",
                // alignItems: "center",
                // width: "100%",
                marginLeft: "210"
              }}
            >
              <p style={{ margin: 0 }}>
                {`(`}Please enter/upload data📂.{`)`}
              </p>
            </span>

            <Row style={{ color: 'GrayText' }}>
              <p >Note: Go with one of the following option to proceed

                <ol style={{ marginTop: 0 }}>
                  <li>
                    {" "}
                    <strong>Add Details:</strong> Click the "Add Details" button to open
                    a table where you can enter the data manually
                  </li>

                  <li>
                    <strong>Upload CSV File:</strong> Download the CSV template, fill it
                    with the required information, and upload the completed file in the
                    specified format.
                  </li>

                  <li>
                    <strong>Upload Bill:</strong> Upload monthly bills for all 12
                    months.
                  </li>

                  <li>
                    <strong>Upload SCADA File:</strong> For more accurate data, you can
                    upload a SCADA file with 15-minute interval dumps.
                  </li>
                </ol></p>
            </Row>
            <Row style={{ marginTop: "3%" }}>
              <Col span={6}>
                <Tooltip title="Add details manually">
                  <Button onClick={handleToggleDetails} icon={<FileAddOutlined />} >
                    {dataSource && showTable ? "Add Details " : "Add Details "}
                  </Button>
                </Tooltip>

                <span
                  style={{ fontWeight: "bold", fontSize: "16px", paddingTop: "4px", marginLeft: "20px" }}
                >
                  OR
                </span>
              </Col>

              <Col span={6}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Upload beforeUpload={handleCSVUpload} showUploadList={false}>
                    <Tooltip title="Upload a CSV file">
                      <Button
                        onClick={() => handleButtonClick("csv")}
                        style={{ padding: "5px", zIndex: 100 }}
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
                      style={{ marginLeft: "10px", zIndex: 100 }}
                    ></Button>
                  </Tooltip>
                  <span
                    style={{ fontWeight: "bold", fontSize: "16px", paddingTop: "4px", marginLeft: "20px" }}
                  >
                    OR
                  </span>
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
                <span
                  style={{ fontWeight: "bold", fontSize: "16px", paddingTop: "4px", marginLeft: "20px" }}
                >
                  OR
                </span>
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
          </>
          )
            : (
              <>

                <Table
                  dataSource={dataSource}
                  columns={vcolumns}
                  pagination={false}
                  bordered
                  size="small"
                  tableLayout="fixed"

                  style={{
                    marginTop: "20px",

                  }}
                />

              </>
            )
          }
        </div>

        <div
          style={{
            border: "1px solid #6698005c",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            marginTop: "20px",
            borderRadius: "5px",
          }}

        >
          {/* </div> */}
          {showTable && (
            <>
              <Table
                rowKey="key"
                dataSource={memoizedDataSource}
                columns={columns}
                pagination={false}
                bordered
                size="small"
                tableLayout="fixed"
                style={{ marginTop: "20px" }}
                components={{
                  body: {
                    row: ({ children, ...restProps }) => {
                      const index = restProps["data-row-key"];
                      return (
                        <tr
                          {...restProps}
                          style={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e0e0e054",
                          }}
                        >
                          {children}
                        </tr>
                      );
                    },
                  },
                }}
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

          {(user.role !== "view") ? (

            <>
              <Tooltip
                title={
                  (monthlyData.length < 1 && !scadaFileUpload && !dataSource || !fieldsupdated )
                    ? "Please fill the complete details or upload a file"
                    : "Proceed to the next step"
                }
                placement="top"
              >

                <Button
                  type="primary"
                  onClick={handleContinue}
                  disabled={monthlyData.length < 1 && !scadaFileUpload && !dataSource || !fieldsupdated } // Enable only if an action is completed
                  style={{ marginLeft: "86%", marginTop: "8px" }}
                >
                  Continue {`>>`}
                </Button>

              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip
                title={
                  monthlyData.length < 1 && !scadaFileUpload && !dataSource
                    ? "consumptions are not availble to proceed"
                    : "Proceed to the next step"
                }
                placement="top"
              >
                {temp > 0 ? (
                  <Button
                    type="primary"
                    onClick={handleContinue}
                    disabled={monthlyData.length < 1 && !scadaFileUpload && !dataSource } // Enable only if an action is completed
                    style={{ marginLeft: "86%", marginTop: "8px" }}
                  >
                    Continue {`>>`}
                  </Button>
                ) : (

                  <Button
                    type="primary"
                    onClick={handleContinue}
                    style={{ marginLeft: "86%", marginTop: "8px" }}
                    disabled={monthlyData.length < 1 && !scadaFileUpload && !dataSource }
                  >
                    Continue {`>>`}
                  </Button>
                )}
              </Tooltip>
            </>
          )}
        </div>



      </Card>

      <Modal
        title="Upload SCADA File"
        open={isModalVisible}
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
          <li>
            {" "}
            <strong>Add Details:</strong> Click the "Add Details" button to open
            a table where you can enter the data manually
          </li>

          <li>
            <strong>Upload CSV File:</strong> Download the CSV template, fill it
            with the required information, and upload the completed file in the
            specified format.
          </li>

          <li>
            <strong>Upload Bill:</strong> Upload monthly bills for all 12
            months.
          </li>

          <li>
            <strong>Upload SCADA File:</strong> For more accurate data, you can
            upload a SCADA file with 15-minute interval dumps.
          </li>
        </ol>
      </Modal>
    </div>
  );
};

export default EnergyConsumptionTable
