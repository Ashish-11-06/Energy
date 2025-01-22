import React, { useState } from "react";
import {
  Modal,
  Button,
  Typography,
  Row,
  Col,
  DatePicker,
  Select,
  InputNumber,
  message,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SummaryOfferModal from "./SummaryOfferModal";
import { useDispatch } from "react-redux";
import { addTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const RequestForQuotationModal = ({
  visible,
  onCancel,
  type,
  data,
  selectedDemandId,
}) => {
  const [ppaTerm, setPpaTerm] = useState(20);
  const [lockInPeriod, setLockInPeriod] = useState(10);
  const [minimumSupply, setMinimumSupply] = useState(18);
  const [contractedEnergy, setContractedEnergy] = useState(20);
  const [paymentSecurityType, setPaymentSecurityType] = useState("Bank Guarantee");
  const [paymentSecurityDays, setPaymentSecurityDays] = useState(30); // New state
  const [offerTariff, setOfferTariff] = useState(3.5);
  const [solarCapacity, setSolarCapacity] = useState(50);
  const [windCapacity, setWindCapacity] = useState(30);
  const [essCapacity, setEssCapacity] = useState(20);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")).user;

  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };

  const handleSendToIPPs = () => {
    message.success("Your request has been sent to IPPs.");
    onCancel();
  };

  const handleContinue = async () => {
    const termsData = {
      from_whom: user.user_category,
      requirement_id: selectedDemandId,
      combination: data.combination,
      term_of_ppa: ppaTerm,
      lock_in_period: lockInPeriod,
      commencement_of_supply: moment(data.cod).format("YYYY-MM-DD"), // Ensure date format is YYYY-MM-DD
      contracted_energy: contractedEnergy,
      minimum_supply_obligation: minimumSupply,
      payment_security_type: paymentSecurityType,
      payment_security_day: paymentSecurityDays, // Add to termsData
    };
    try {
      // Wait for the dispatch to resolve
      await dispatch(addTermsAndConditions(termsData)).unwrap(); // Use .unwrap() if using Redux Toolkit
      message.success({
        content: "Terms and Conditions added successfully.",
        duration: 7, // Show for 7 seconds
      });
      onCancel(); // Close the modal
    } catch (error) {
      // Show error message
      message.error({
        content: error || "Failed to add Terms and Conditions.",
        duration: 7, // Show for 7 seconds
      });
    }
  
  };

  return (
    <>
      <Modal
        title={<Text style={{ color: "#001529", fontSize: "18px" }}>Quotation</Text>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
       <p><strong> Offer Tariff (INR/MW): </strong>{data.perUnitCost}</p>
        <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
          Standard Terms Sheet
        </Title>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
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
                style={{ width: "100%" }}
                format="DD/MM/YYYY" // Set the display format to DD/MM/YYYY
                disabledDate={(current) => {
                  // Disable today and all past dates
                  return current && current <= moment().endOf('day');
                }}
                value={data.cod ? moment(data.cod, "YYYY-MM-DD") : moment("2024-08-31", "YYYY-MM-DD")} // Update date format
                onChange={(date) => data.cod = date ? date.format("YYYY-MM-DD") : null} // Update data.cod on change
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
          {/* <Col span={12}>
            <Typography.Paragraph>
              <strong>Offer Tariff (INR/Mw):</strong>
              <InputNumber
                min={1}
                value={data.perUnitCost}
                onChange={(value) => setContractedEnergy(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col> */}
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
         
        </Row>
        <Col span={12}>
            <Typography.Paragraph>
              <strong>Payment Security Days:</strong>
              <InputNumber
                min={1}
                value={paymentSecurityDays}
                onChange={(value) => setPaymentSecurityDays(value)} // New input field
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
        <Col span={12}>
            <Button
              block
              onClick={handleChatWithExpert}
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid #E6E8F1`,
                color: "#001529",
                fontSize: "14px",
                marginTop:'6%'
              }}
            >
              Need Assistance ?
            </Button>
          </Col>

        <Row justify="end" style={{ marginTop: "20px" }}>
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
        visible={false}
        onCancel={() => {}}
        offerDetails={{}}
      />
    </>
  );
};

export default RequestForQuotationModal;
