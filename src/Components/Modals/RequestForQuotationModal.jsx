import React, { useState } from "react";
import { Modal, Button, Typography, Row, Col, DatePicker, Select, InputNumber, message } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SummaryOfferModal from "./SummaryOfferModal"; // Import SummaryOfferModal

const { Title, Text } = Typography;
const { Option } = Select;

const RequestForQuotationModal = ({ visible, onCancel, type }) => {
  const [ppaTerm, setPpaTerm] = useState(20); // Default value for Term of PPA
  const [lockInPeriod, setLockInPeriod] = useState(10); // Default value for Lock-in Period
  const [minimumSupply, setMinimumSupply] = useState(18); // Default value for Minimum Supply
  const [contractedEnergy, setContractedEnergy] = useState(20); // Default value for Contracted Energy
  const [paymentSecurityType, setPaymentSecurityType] = useState("Bank Guarantee"); // Default value for Payment Security Type
  const [offerTariff, setOfferTariff] = useState(3.5); // Default value for Offer Tariff
  const [solarCapacity, setSolarCapacity] = useState(50); // Default value for Solar Capacity
  const [windCapacity, setWindCapacity] = useState(30); // Default value for Wind Capacity
  const [essCapacity, setEssCapacity] = useState(20); // Default value for ESS Capacity
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false); // State for Summary Offer Modal

  const navigate = useNavigate(); // Use navigate hook for routing

  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page"); // Navigate to the chat page
  };

  const handleSendToIPPs = () => {
    // Display a success message
    message.success("Your request has been sent to IPPs.");

    // Close the modal
    onCancel();
  };

  const handleContinue = () => {
    // Display the Summary Offer modal
    setIsSummaryModalVisible(true);
  };

  const handleSummaryModalCancel = () => {
    setIsSummaryModalVisible(false);
  };

  return (
    <>
      <Modal
        title={<Text style={{ color: "#001529", fontSize: "18px" }}>Request for Quotation</Text>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
          Standard Terms Sheet
        </Title>

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          {type === "generator" && (
            <Col span={12}>
              <Typography.Paragraph>
                <strong>Offer Tariff (INR/KWH):</strong>
                <InputNumber
                  min={0.1}
                  step={0.1}
                  value={offerTariff}
                  onChange={(value) => setOfferTariff(value)}
                  style={{ width: "100%" }}
                />
              </Typography.Paragraph>
            </Col>
          )}
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Term of PPA (years):</strong>
              <InputNumber
                min={1}
                value={ppaTerm}
                onChange={(value) => setPpaTerm(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Lock-in Period (years):</strong>
              <InputNumber
                min={1}
                value={lockInPeriod}
                onChange={(value) => setLockInPeriod(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Commencement of Supply:</strong>
              <DatePicker
                value={moment("2024-08-31", "YYYY-MM-DD")}
                style={{ width: "100%" }}
                disabled
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Contracted Energy (million units):</strong>
              <InputNumber
                min={1}
                value={contractedEnergy}
                onChange={(value) => setContractedEnergy(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          {type !== "generator" && (
            <Col span={12}>
              <Typography.Paragraph>
                <strong>Minimum Supply Obligation (million units):</strong>
                <InputNumber
                  min={1}
                  value={minimumSupply}
                  onChange={(value) => setMinimumSupply(value)}
                  style={{ width: "100%" }}
                />
              </Typography.Paragraph>
            </Col>
          )}
          {type !== "generator" && (
            <>
              <Col span={12}>
                <Typography.Paragraph>
                  <strong>Payment Security (days):</strong>
                  <InputNumber
                    min={1}
                    value={10}
                    disabled
                    style={{ width: "100%" }}
                  />
                </Typography.Paragraph>
              </Col>
              <Col span={12}>
                {/* Empty Col for layout */}
              </Col>
              <Col span={12}>
                <Typography.Paragraph>
                  <strong>Payment Security Type:</strong>
                  <Select
                    value={paymentSecurityType}
                    onChange={(value) => setPaymentSecurityType(value)}
                    style={{ width: "100%" }}
                  >
                    <Option value="Bank Guarantee">Bank Guarantee</Option>
                    <Option value="Cash Deposit">Cash Deposit</Option>
                    <Option value="Letter of Credit">Letter of Credit</Option>
                  </Select>
                </Typography.Paragraph>
              </Col>
            </>
          )}
        </Row>

        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Button block style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#001529", fontSize: "14px" }}>
              Download Other Terms & Conditions
            </Button>
          </Col>
          <Col span={12}>
            <Button block onClick={handleChatWithExpert} style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#001529", fontSize: "14px" }}>
              Chat with Expert
            </Button>
          </Col>
        </Row>

        <Row justify="space-between" style={{ marginTop: "20px" }}>
          {type !== "generator" && (
            <Button style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#669800", fontSize: "14px" }}>
              Counter Offer
            </Button>
          )}
          <Button
            type="primary"
            style={{
              backgroundColor: "#669800",
              borderColor: "#669800",
              fontSize: "16px",
              padding: "10px 20px",
              float: 'right'
            }}
            onClick={type === "generator" ? handleContinue : handleSendToIPPs} // Handle the send to IPPs or continue click
          >
            {type === "generator" ? "Continue" : "Send to IPPs"}
          </Button>
        </Row>
      </Modal>

      <SummaryOfferModal
        visible={isSummaryModalVisible}
        onCancel={handleSummaryModalCancel}
        offerDetails={{
          offerTariff,
          ppaTerm,
          lockInPeriod,
          commencementOfSupply: "2024-08-31",
          contractedEnergy,
          solarCapacity,
          windCapacity,
          essCapacity
        }}
      />
    </>
  );
};

export default RequestForQuotationModal;
