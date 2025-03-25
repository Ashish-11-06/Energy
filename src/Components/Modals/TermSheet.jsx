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
import { addTermsAndConditions, updateTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const TermSheet = ({
  visible,
  onCancel,
  data,
  selectedDemandId,
}) => {
  const [ppaTerm, setPpaTerm] = useState();
  const [lockInPeriod, setLockInPeriod] = useState();
  const [minimumSupply, setMinimumSupply] = useState();
  const [contractedEnergy, setContractedEnergy] = useState();
  const [paymentSecurityType, setPaymentSecurityType] = useState();
  const [paymentSecurityDays, setPaymentSecurityDays] = useState(); // New state
  const [offerTariff, setOfferTariff] = useState();
  const [solarCapacity, setSolarCapacity] = useState(50);
  const [windCapacity, setWindCapacity] = useState(30);
  const [essCapacity, setEssCapacity] = useState(20);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")).user;

  // console.log(JSON.stringify(data, null, 2)); // Pretty print with 2 spaces for indentation

  const handleChatWithExpert = () => {
    navigate("/chat-page");
  };

  const handleSendToIPPs = () => {
    message.success("Your request has been sent to IPPs.");
    onCancel();
  };

  // console.log(user);

  const handleContinue = async () => {
    // Create termsData with only updated fields
    const termsData = {
        term_of_ppa: ppaTerm ?? data.term_of_ppa,
        lock_in_period: lockInPeriod ?? data.lock_in_period,
        minimum_supply_obligation: minimumSupply ?? data.minimum_supply_obligation,
        contracted_energy: contractedEnergy ?? data.contracted_energy,
        payment_security_type: paymentSecurityType ?? data.payment_security_type,
        payment_security_day: paymentSecurityDays ?? data.payment_security_day,
        offer_tariff: offerTariff ?? data.offer_tarrif,
        consumer: data.consumer, // Always include consumer if needed
        from_whom: data.from_whom, // Always include the user category
        requirement_id: data.requirement?.[0]?.rq_id, // Always include requirement ID
        combination: data.combination, // Always include combination
        commencement_of_supply: data.commencement_of_supply, // Always include supply date
      };
  
    try {
      const userId = user.id; // User ID
      const termSheetId = data.id; // Term Sheet ID
  
      // console.log("Updated termsData:", termsData); // Log the updated data for debugging
  
      // Dispatch the updated data
      await dispatch(updateTermsAndConditions({ userId, termSheetId, termsData })).unwrap();
  
      message.success({
        content: "Terms and Conditions added successfully.",
        duration: 7, // Show success message for 7 seconds
      });
      onCancel(); // Close the modal
    } catch (error) {
      console.error("Error updating Terms and Conditions:", error);
      message.error({
        content: error?.message || "Failed to add Terms and Conditions.",
        duration: 7, // Show error message for 7 seconds
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
        <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
          Standard Terms Sheet
        </Title>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Term of PPA (years):</strong>
              <InputNumber
                min={1}
                value={data.term_of_ppa}
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
                value={data.lock_in_period}
                onChange={(value) => setLockInPeriod(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Commencement of Supply:</strong>
              <DatePicker
                value={data.commencement_of_supply ? moment(data.commencement_of_supply, "YYYY-MM-DD") : moment("2024-08-31", "YYYY-MM-DD")}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Contracted Energy (million units):</strong>
              <InputNumber
                min={1}
                value={data.contracted_energy}
                onChange={(value) => setContractedEnergy(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Offer Tariff (INR/MW) :</strong>
              <InputNumber
                min={1}
                value={data.offer_tarrif} // Use data.per_unit_cost if available, fallback to offerTariff
                onChange={(value) => setOfferTariff(value)} // Update state when changed
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>

          <Col span={12}>
            <Typography.Paragraph>
              <strong>Minimum Supply Obligation (million units):</strong>
              <InputNumber
                min={1}
                value={data.minimum_supply_obligation}
                onChange={(value) => setMinimumSupply(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Payment Security Type:</strong>
              <Select
                value={data.payment_security_type}
                onChange={(value) => setPaymentSecurityType(value)}
                style={{ width: "100%" }}
              >
                <Option value="Bank Guarantee">Bank Guarantee</Option>
                <Option value="Cash Deposit">Cash Deposit</Option>
                <Option value="Letter of Credit">Letter of Credit</Option>
              </Select>
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Payment Security Days:</strong>
              <InputNumber
                min={1}
                value={data.payment_security_day}
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
                border: "1px solid #E6E8F1", // Fix syntax error
                color: "#001529",
                fontSize: "14px",
              }}
            >
              Chat with Expert
            </Button>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            style={{
              backgroundColor: "#669800",
              borderColor: "#669800",
              fontSize: "16px",
              padding: "10px 20px",
            }}
            onClick={handleContinue}
          >
            {user.user_category === "Generator" ? "send to consumer" : "Send to IPPs"}
          </Button>
        </Row>
      </Modal>

      <SummaryOfferModal
        visible={false}
        onCancel={() => { }}
        offerDetails={{}}
      />
    </>
  );
};

export default TermSheet;