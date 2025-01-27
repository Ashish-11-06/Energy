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

  // const {userId}=location.id || {};
  // console.log(userId);

  // console.log(requirementId, "requirementId");

  // Fetch annual saving data
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal

  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };
  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
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
    doc.text("Annual Savings Report", 14, 22);
  
    // Content
    doc.setFontSize(12);
    doc.text(
      `Consumer Company Name: ${reportData.consumer_company_name}`,
      14,
      30
    );
    doc.text(`Consumption Unit: ${reportData.consumption_unit_name}`, 14, 40);
    doc.text(`Connected Voltage: ${reportData.connected_voltage} kV`, 14, 50);
    doc.text(`Tariff Category: ${reportData.tariff_category}`, 14, 60);
    doc.text(
      `Annual Electricity Consumption: ${reportData.annual_electricity_consumption} kWh`,
      14,
      70
    );
    doc.text(`Contracted Demand: ${reportData.contracted_demand} kW`, 14, 80);
    doc.text(
      `Electricity Tariff: ₹${reportData.electricity_tariff}/kWh`,
      14,
      90
    );
    doc.text(
      `Potential RE Tariff: ₹${reportData.potential_re_tariff}/kWh`,
      14,
      100
    );
    doc.text(`ISTS Charges: ₹${reportData.ISTS_charges}/kWh`, 14, 110);
    doc.text(`State Charges: ₹${reportData.state_charges}/kWh`, 14, 120);
    doc.text(
      `Per Unit Savings Potential: ₹${reportData.per_unit_savings_potential}`,
      14,
      130
    );
    doc.text(
      `Potential RE Replacement: ${reportData.potential_re_replacement}%`,
      14,
      140
    );
    doc.text(
      `Total Savings: ₹${reportData.total_savings.toLocaleString()}`,
      14,
      150
    );
    doc.text(
      `Group Captive Requirements: You can hold 26% equity in the project and consumer electricity under `,
      14,
      165
    );
    doc.text(
      `group captive route in Open Access. You pay the required ISTS and State charges without
      `,
      14,
      175
    );
    doc.text(
      `Cross Subsidy surcharge and Additional Surcharge 
      `,
      14,
      185
    );
  
    // Set font to bold for the last text
    doc.setFont('helvetica', 'bold');
    doc.text(
      `This savings is based on average available industry offers on the platform, to start your energy `,
      14,
      205
    );
    doc.setFont('helvetica', 'bold');
    doc.text(
      `transition and to know your exact savings, subscribe to EXG Global – EXT platform. `,
      14,
      215
    );
  
    // Trigger the download
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
    navigate("/consumer/energy-consumption-table", {
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
                      {annualSaving ? annualSaving.toLocaleString() : "0"} INR
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>
                      Average Savings (For your Industry Category):
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ fontSize: "20px" }}>
                      {annualSaving ? averageSavings.toLocaleString() : "0"} INR
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
                  <Button type="primary" onClick={handleDownloadReport}>
                    Download Report
                  </Button>
                  <Button
                    type="default"
                    onClick={handleChatWithExpert}
                    style={{ marginLeft: "600px" }}
                  >
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
