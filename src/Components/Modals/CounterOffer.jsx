import moment from "moment"; // Ensure moment is imported
import { Modal, Button, Typography, Row, Col, DatePicker, Select, InputNumber, message } from "antd";
import React, { useState } from "react"; // Import useState along with React
import { useDispatch } from "react-redux";
import { updateTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const TermsDetailModal = ({
  visible,
  onCancel,
  data,
  selectedDemandId,
}) => {
  const [ppaTerm, setPpaTerm] = useState(20);
  const [lockInPeriod, setLockInPeriod] = useState(10);
  const [minimumSupply, setMinimumSupply] = useState(18);
  const [contractedEnergy, setContractedEnergy] = useState(20);
  const [paymentSecurityType, setPaymentSecurityType] = useState("Bank Guarantee");
  const [paymentSecurityDays, setPaymentSecurityDays] = useState(30);

  const dispatch = useDispatch();

  // Initialize the commencement date using moment
  const [commencementDate, setCommencementDate] = useState(() => {
    const date = data.commencement_of_supply || data.cod;
    return date ? moment(date, "YYYY-MM-DD").format("DD-MM-YYYY") : "";
  });  

  const user = JSON.parse(localStorage.getItem("user")).user; // Get the user from local storage
const userId = user.id;

  // Handle the DatePicker change event
  const handleDateChange = (date) => {
    setCommencementDate(date);
  };

  console.log(commencementDate);
  // Handle form submission
  const handleContinue = async () => {

    const termSheetId = data.id;

    const termsData = {
      // from_whom: user.user_category,
      requirement_id: selectedDemandId,
      combination: data.combination.combination || data.combination,
      term_of_ppa: ppaTerm,
      lock_in_period: lockInPeriod,
      commencement_of_supply: commencementDate ? moment(commencementDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,      // Format date using moment
      contracted_energy: contractedEnergy,
      minimum_supply_obligation: minimumSupply,
      payment_security_type: paymentSecurityType,
      payment_security_day: paymentSecurityDays,
    };

    try {
      console.log('Updating terms and conditions:', termsData, userId, termSheetId);
      // Dispatching the action to add Terms and Conditions
      await dispatch(updateTermsAndConditions({ userId, termSheetId, termsData })).unwrap();
      message.success("Terms and Conditions added successfully.");
      onCancel(); // Close the modal
    } catch (error) {
      message.error("Failed to add Terms and Conditions.");
    }
  };

  return (
    <Modal
      title={<Text style={{ color: "#001529", fontSize: "18px" }}>Quotation</Text>}
      visible={visible}
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
 placeholder={
    data.cod || data.commencement_of_supply
      ? moment(data.cod || data.commencement_of_supply, "YYYY-MM-DD").format("DD-MM-YYYY")
      : "Select Date"
  } 
            format="DD-MM-YYYY" // Format the date
              // value={commencementDate} // Use moment date here
              onChange={handleDateChange} // Update the state on date change
              style={{ width: "100%" }}
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
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Payment Security Days:</strong>
            <InputNumber
              min={1}
              value={paymentSecurityDays}
              onChange={(value) => setPaymentSecurityDays(value)}
              style={{ width: "100%" }}
            />
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Button
            block
            onClick={() => {}}
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid #E6E8F1`,
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
          Continue
        </Button>
      </Row>
    </Modal>
  );
};

export default TermsDetailModal;
