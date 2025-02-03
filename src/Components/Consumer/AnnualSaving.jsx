import React, { useState } from "react";
import { Button, Card, Typography, Space, message } from "antd";
import './AnnualSaving.css';

const { Title, Text } = Typography;

const AnnualSaving = (data) => {
  const [showReport, setShowReport] = useState(false);

  const handleDownloadReport = () => {

    // console.log('dd');
    // Data to be downloaded
    const reportData = data;

    // Create a Blob with the report data
    const blob = new Blob([reportData], { type: "text/plain" });
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.href = URL.createObjectURL(blob);
    link.download = "AnnualSavingReport.txt";

    // Append link to the document and click it
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);

    setShowReport(true);
    message.success("Report downloaded successfully!");
  };

  const handleChatWithExpert = () => {
    message.success("Chat with expert initiated!");
  };

  return (
    <div className="annual-saving-container">
      <Title level={3} className="text-center">
        Annual Saving
      </Title>

      <Space direction="vertical" size="large" className="w-100">
        <Card bordered={false} className="custom-card">
          <Text className="custom-label">Potential Annual Saving (INR):</Text>
          <div className="amount-box">
            <Text className="amount">₹500,000</Text>
          </div>
        </Card>

        <Card bordered={false} className="custom-card">
          <Text className="custom-label">Potential RE Replacement %:</Text>
          <div className="amount-box">
            <Text className="amount">25%</Text>
          </div>
        </Card>

        <Space wrap className="actions">
          <Button type="primary" onClick={handleDownloadReport}>
            Download Report
          </Button>
          <Button type="default" onClick={handleChatWithExpert}>
            Chat with Expert
          </Button>
        </Space>

        {showReport && (
          <div className="report-message">
            <Text>Report has been downloaded!</Text>
          </div>
        )}
      </Space>
    </div>
  );
};

export default AnnualSaving;
