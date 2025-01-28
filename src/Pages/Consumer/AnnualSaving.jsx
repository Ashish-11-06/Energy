import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Typography, Card, Space, Modal, Tooltip, Col, Row } from "antd";
import { fetchReport } from "../../Redux/Slices/Consumer/downloadReportSlice";
const { Title, Text } = Typography;
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  FileExcelOutlined,
  MessageOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import chat from '../../assets/need-assistance.jpeg';
const AnnualSvg = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [annualSavingResponse, setAnnualSavingResponse] = useState(null); // State for annual saving response
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Dispatch function from Redux
  const [reportResponse, setReportResponse] = useState(null);

  const location = useLocation();
  const { requirementId } = location.state || {}; // Destructure state to get `requirementId`
  // const {reqId}=location.state || {};
  const userData = useState(JSON.parse(localStorage.getItem("user")).user);
  console.log(userData[0]?.id);
  const userId = userData[0]?.id;


  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        requirement_id: requirementId,
      };
      setLoading(true);
      try {
        const response = await dispatch(FetchAnnualSaving(data)).unwrap(); // Use .unwrap() to handle data directly
        setAnnualSavingResponse(response); // Set the full response
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message || "Failed to fetch annual savings.");
        message.error(err.message || "Failed to fetch annual savings."); // Show error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, requirementId]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Make sure to pass `requirementId` and `userId` properly
        const response = await dispatch(
          fetchReport({ requirementId, userId })
        ).unwrap();
        setReportResponse(response);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch report.");
        message.error(err.message || "Failed to fetch report.");
      } finally {
        setLoading(false);
      }
    };

    if (requirementId && userId) {
      fetchReportData();
    }
  }, [dispatch, requirementId, userId]);

  const generatePDF = (reportData) => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text("Annual Savings Report", 105, 20, { align: "center" });
  
    // Background Section
    doc.setFontSize(12);
    doc.text("Background", 14, 30);
    doc.setFontSize(10);
    doc.text(reportData.consumer_company_name, 14, 40);
    doc.text(
      `${reportData.consumption_unit_name}, ${reportData.state}`,
      14,
      50
    );
    doc.text(
      `Connected Voltage: ${reportData.connected_voltage} kV, ${reportData.tariff_category}`,
      14,
      60
    );
    doc.text(
      `Annual Electricity Consumption: ${reportData.annual_electricity_consumption} MWh`,
      14,
      70
    );
    doc.text(`Contracted Demand: ${reportData.contracted_demand} MW`, 14, 80);
  
    // Analysis Section Header
    doc.setFontSize(12);
    doc.text("Analysis", 14, 95);
  
    // Table Column Headers
    const tableColumnHeaders = ["Particulars", "Units", "Value"];
    const tableRows = [
      [
        "Your Electricity Tariff (Energy charge as per regulations)",
        "INR/kWh",
        reportData.electricity_tariff,
      ],
      ["Potential RE Tariff Available (A)", "INR/kWh", reportData.potential_re_tariff],
      ["ISTS Charges (B)", "INR/kWh", reportData.ISTS_charges],
      ["State Charges (C)", "INR/kWh", reportData.state_charges],
      [
        "Per Unit Savings Potential (A - B - C)",
        "INR/kWh",
        reportData.per_unit_savings_potential,
      ],
      [
        "Potential RE Replacement",
        "%",
        reportData.potential_re_replacement,
      ],
      [
        "Total Savings",
        "INR crore",
        reportData.total_savings,
      ],
    ];
  
    // Draw Table
    doc.autoTable({
      startY: 100,
      head: [tableColumnHeaders],
      body: tableRows,
      styles: { fontSize: 10, cellPadding: 2 },
    });
  
    // Group Captive Requirements Section
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(
      "Group Captive Requirements: You can hold 26% equity in the project and consume electricity under",
      14,
      finalY
    );
    doc.text(
      "group captive route in Open Access. You pay the required ISTS and State charges without",
      14,
      finalY + 10
    );
    doc.text(
      "Cross Subsidy surcharge and Additional Surcharge.",
      14,
      finalY + 20
    );
  
    // Final Notes
    doc.setFont("helvetica", "bold");
    doc.text(
      "This savings is based on average available industry offers on the platform. To start your energy",
      14,
      finalY + 40
    );
    doc.text(
      "transition and to know your exact savings, subscribe to EXG Global – EXT platform.",
      14,
      finalY + 50
    );
  
    // Save the PDF
    doc.save("annual_savings_report.pdf");
  };
  
  

  // Handle download report
  const handleDownloadReport = () => {
    console.log("download");

    if (!reportResponse) {
      message.error("No report data available.");
      return;
    }

    try {
      generatePDF(reportResponse); // Pass the report data to generate the PDF
    } catch (error) {
      console.log(error);
      message.error("Failed to generate report.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin tip="Loading..." />
      </div>
    );
  }

  // Conditional rendering to ensure data is available
  const annualSaving = annualSavingResponse
    ? annualSavingResponse.annual_savings
    : null;
  const averageSavings = annualSavingResponse
    ? annualSavingResponse.average_savings
    : null;
  const reReplacement = annualSavingResponse
    ? annualSavingResponse.re_replacement
    : null;

  //console.log('RE replacement', reReplacement);

  const handleContinue = () => {
    navigate("/consumer/subscription-plan", {
      state: { requirementId, reReplacement },
    });
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#F5F6FB",
          padding: "20px",
          border: "2px solid #6698005c",
          borderRadius: "5px",
        }}
      >
        {error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          <>
            <div className="annual-saving-container">
              <Title
                level={3}
                className="text-center"
                style={{ marginLeft: "40%", marginBottom: "3%" }}
              >
                Annual Savings
              </Title>

              {/* <Tooltip title="Help">
        <Button
          shape="circle"
          icon={<QuestionCircleOutlined />}
          onClick={showInfoModal}
          style={{ position: 'absolute', top: 120, right: 30 }}
        />
      </Tooltip> */}

              <Space direction="vertical" size="large" className="w-100">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong> Potential Savings :</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: "20px" }}>
                      {annualSaving ? annualSaving.toLocaleString() : "0"} <span style={{fontSize:'16px'}}>INR</span>
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>
                      Average Savings (For your Industry Category):
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: "20px" }}>
                      {annualSaving ? averageSavings.toLocaleString() : "0"} <span style={{fontSize:'16px'}}>INR</span>
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Potential RE Replacement:</Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: "20px" }}>
                      {reReplacement ? reReplacement : "0"}%
                    </Text>
                  </Col>
                </Row>

                <Space wrap className="actions">
                  <Button type="primary" onClick={handleDownloadReport}  icon={<FileTextOutlined style={{ marginTop: "5px" }}/>}>
                    Download Report
                  </Button>
                  <Button
                    type="default"
                    onClick={handleChatWithExpert}
                    style={{ marginLeft: "600px" }}
                    // icon={<MessageOutlined/>}
                    
                  >
                    <img src={chat} alt="" style={{width:'27px',height:'27px'}}/>
                    Need Assistance ?
                  </Button>
                  {/* subscription journey is remaining
                  {`(to get quotation from IPP)`} */}
                </Space>
              </Space>
            </div>
          </>
        )}
      </div>

      <Tooltip title="To further explore, subscribe to our plan">
        <Button
          type="primary"
          style={{
            marginTop: "20px",
            backgroundColor: "#669800",
            borderColor: "#669800",
            fontSize: "16px",
            padding: "0 30px",
          }}
          onClick={handleContinue}
        >
          {/* Subscribe */}
          Continue
        </Button>
      </Tooltip>

      {/* <Modal
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
          <li>Add your requirements by clicking the "Add Requirement +" button.</li>
          <li>Fill in the details shown in the form.</li>
          <li>Use the tooltip option for each field for more information.</li>
          <li>You can add multiple requirements (demands).</li>
          <li>To continue, select a requirement and click the "Continue" button.</li>
        </ol>
        <p>Thank you!</p>
      </Modal> */}
    </main>
  );
};

export default AnnualSvg;
