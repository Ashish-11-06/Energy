import React, { useState } from "react";
import { Button, Card, Typography, Space, message } from "antd";
import './AnnualSaving.css';

const { Title, Text } = Typography;

const AnnualSaving = () => {
  const [showReport, setShowReport] = useState(false);

  const handleDownloadReport = () => {
    setShowReport(true);
    message.info("Report download initiated!");
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
            <Text className="amount">₹500,000</Text> {/* Example amount */}
          </div>
        </Card>

        <Card bordered={false} className="custom-card">
          <Text className="custom-label">Potential RE Replacement %:</Text>
          <div className="amount-box">
            <Text className="amount">25%</Text> {/* Example value */}
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
            <Text>Report is downloading...</Text>
          </div>
        )}
      </Space>
    </div>
  );
};

export default AnnualSaving;
