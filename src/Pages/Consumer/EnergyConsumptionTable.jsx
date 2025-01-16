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
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from '@ant-design/icons';

import {
  addConsumption,
  fetchMonthlyDataById,
} from "../../Redux/Slices/Consumer/monthlyConsumptionSlice";
import "../EnergyTable.css";

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

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  console.log("Re replacement", reReplacement);

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
    console.log(monthlyData);
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
      console.log(updatedDataSource);
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

  const handleFileUpload = (file, key) => {
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
    }
    return false; // Prevent automatic upload
  };

  const handleContinue = () => {
    setIsModalVisible(true);
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

      const response = await dispatch(addConsumption(values));

      console.log("resssss", response);

      message.success("Monthly data added successfully!");
      // Show the modal after saving data
    } catch (error) {
      message.error("Failed to add monthly data");
    } finally {
      setLoading(false);
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
    setDataSource(newData);
  };

  const handleFileUploadModal = (file) => {
    message.success(`${file.name} uploaded successfully`);
    setFileUploaded(true);
    setUploadedFileName(file.name);
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
          disabled={record.fileUploaded !== null}
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
          disabled={record.fileUploaded !== null}
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
          disabled={record.fileUploaded !== null}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "Monthly Bill ($)",
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
          disabled={record.fileUploaded !== null}
        />
      ),
    },
    {
      title: renderLabelWithTooltip(
        "File Upload",
        "The SCADA file uploaded for the corresponding month."
      ),
      dataIndex: "fileUploaded",
      key: "fileUploaded",
      render: (_, record) => (
        <div>
          {record.fileUploaded ? (
            <div>
              <span>{record.fileUploaded}</span>
              <Upload
                beforeUpload={(file) => handleFileUpload(file, record.key)}
                showUploadList={false}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ marginLeft: "60%" }}
                ></Button>
              </Upload>
            </div>
          ) : (
            <Upload
              beforeUpload={(file) => handleFileUpload(file, record.key)}
              showUploadList={false}
            >
              <Button
                style={{ marginLeft: "70px" }}
                icon={<UploadOutlined />}
              ></Button>
            </Upload>
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
        <p>Please fill the details for making your energy transition plan.</p>
        <Title level={3} style={{ textAlign: "center", marginTop: "10px" }}>
          Energy Consumption Data (12 Months)
        </Title>

        <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: "absolute", top: 120, right: 30 }}
          />
        </Tooltip>
        <Table
          dataSource={dataSource}
          columns={mergedColumns}
          pagination={false}
          bordered
          size="small"
          tableLayout="fixed"
        />

        {/* <Space style={{ marginTop: "20px", display: "flex" }}>
          For more accuracy, you can upload a SCADA_15 min dump energy consumption file.
          <Upload
            beforeUpload={(file) => handleFileUpload(file)}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} style={{ marginLeft: '10px' }}>Upload</Button>
          </Upload>
        </Space> */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={handleSave}
            disabled={!allFieldsFilled}
            loading={loading}
            style={{ marginRight: "10px" }}
          >
            Save
          </Button>
          <Button
            type="primary"
            onClick={handleContinue}
            disabled={!allFieldsFilled}
            style={{ marginRight: "10px" }}
          >
            Continue
          </Button>
        </div>
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
            <Button onClick={handleSkip} style={{ marginRight: "10px" }}>
              Skip
            </Button>
          )}
          {fileUploaded && (
            <Button type="primary" onClick={handleSkip}>
              Continue
            </Button>
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
        <p>Hi</p>

        <p>Welcome to the EXG. Please follow these steps to proceed:</p>
        <ol>
          <li>
            Add your requirements by clicking the "Add Requirement +" button.
          </li>
          <li>Fill in the details shown in the form.</li>
          <li>Use the tooltip option for each field for more information.</li>
          <li>You can add multiple requirements (demands).</li>
          <li>
            To continue, select a requirement and click the "Continue" button.
          </li>
        </ol>
        <p>Thank you!</p>
      </Modal>
    </div>
  );
};

export default EnergyConsumptionTable;
