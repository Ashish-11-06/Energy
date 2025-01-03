import React, { useState } from "react";
import { Modal, Button, Typography, Row, Col, DatePicker, Select, InputNumber, message } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SummaryOfferModal from "./SummaryOfferModal";
import RequestedIPP from "../../Pages/Consumer/RequestedIPP";

const { Title, Text } = Typography;
const { Option } = Select;

const CounterOfferModal = ({ visible, onCancel, onSubmit }) => (
  <Modal
    title={<Text style={{ color: "#001529", fontSize: "18px" }}>Submit Counter Offer</Text>}
    open={visible}
    onCancel={onCancel}
    footer={null}
    width={600}
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
      <Col span={12}>
        <Typography.Paragraph>
          <strong>Per Unit Cost:</strong>
          <InputNumber
            min={0.1}
            step={0.1}
            placeholder="Enter Per Unit Cost"
            style={{ width: "100%" }}
          />
        </Typography.Paragraph>
      </Col>
      <Col span={12}>
        <Typography.Paragraph>
          <strong>Offer Tariff (INR/KWH):</strong>
          <InputNumber
            min={0.1}
            step={0.1}
            placeholder="Enter Offer Tariff"
            style={{ width: "100%" }}
          />
        </Typography.Paragraph>
      </Col>
      <Col span={12}>
        <Typography.Paragraph>
          <strong>Term of PPA (years):</strong>
          <InputNumber
            min={1}
            placeholder="Enter PPA Term"
            style={{ width: "100%" }}
          />
        </Typography.Paragraph>
      </Col>
      <Col span={12}>
        <Typography.Paragraph>
          <strong>Lock-in Period (years):</strong>
          <InputNumber
            min={1}
            placeholder="Enter Lock-in Period"
            style={{ width: "100%" }}
          />
        </Typography.Paragraph>
      </Col>
      <Col span={12}>
        <Typography.Paragraph>
          <strong>Contracted Energy (million units):</strong>
          <InputNumber
            min={1}
            placeholder="Enter Contracted Energy"
            style={{ width: "100%" }}
          />
        </Typography.Paragraph>
      </Col>
    </Row>
    <Row justify="end" style={{ marginTop: "20px" }}>
      <Button
        style={{ marginRight: "10px" }}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        onClick={onSubmit}
        style={{ backgroundColor: "#669800", borderColor: "#669800" }}
      >
        Submit
      </Button>
    </Row>
  </Modal>
);

const RequestForQuotationModal = ({ visible,ipp, onCancel, type }) => {
  const [ppaTerm, setPpaTerm] = useState(20);
  const [lockInPeriod, setLockInPeriod] = useState(10);
  const [minimumSupply, setMinimumSupply] = useState(18);
  const [contractedEnergy, setContractedEnergy] = useState(20);
  const [paymentSecurityType, setPaymentSecurityType] = useState("Bank Guarantee");
  const [offerTariff, setOfferTariff] = useState(3.5);
  const [solarCapacity, setSolarCapacity] = useState(50);
  const [windCapacity, setWindCapacity] = useState(30);
  const [essCapacity, setEssCapacity] = useState(20);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [isCounterOfferModalVisible, setIsCounterOfferModalVisible] = useState(false);
  const [isCounterOfferDisabled, setIsCounterOfferDisabled] = useState(false); // New state for disabling button

  const navigate = useNavigate();
console.log("Requested Modal IPP",ipp);


  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };

  const handleSendToIPPs = () => {
    message.success("Your request has been sent to IPPs.");
   
    return <RequestedIPP ipp={ipp} />;
    onCancel();
  };

  const handleContinue = () => {
    setIsSummaryModalVisible(true);
  };

  const handleSummaryModalCancel = () => {
    setIsSummaryModalVisible(false);
  };

  const handleCounterOffer = () => {
    setIsCounterOfferModalVisible(true);
  };

  const handleCounterOfferSubmit = () => {
    message.success("Counter offer submitted successfully.");
    setIsCounterOfferModalVisible(false);
    setIsCounterOfferDisabled(true); // Disable the button after submission
  };

  const handleCounterOfferCancel = () => {
    setIsCounterOfferModalVisible(false);
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
          Standard Terms Sheet hello
        </Title>
        {/* Existing form */}
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
            <Button
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid #E6E8F1`,
                color: "#669800",
                fontSize: "14px",
              }}
              onClick={handleCounterOffer}
              disabled={isCounterOfferDisabled} // Disable button after submission
            >
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
            }}
            onClick={type === "generator" ? handleContinue : handleSendToIPPs}
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
          essCapacity,
        }}
      />

      <CounterOfferModal
        visible={isCounterOfferModalVisible}
        onCancel={handleCounterOfferCancel}
        onSubmit={handleCounterOfferSubmit}
      />
    </>
  );
};

export default RequestForQuotationModal;
