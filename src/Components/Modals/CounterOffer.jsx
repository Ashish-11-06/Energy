import moment from "moment"; // Ensure moment is imported
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
  Tooltip,
} from "antd";
import React, { useState,useEffect } from "react"; // Import useState along with React
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";
import { addStatus } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";
import chat from "../../assets/need.png";
import { negotiateTariff } from "../../Redux/Slices/Consumer/negotiateTariffSlice";
const { Title, Text } = Typography;
const { Option } = Select;

const CounterOffer = ({ visible, onCancel, data, selectedDemandId,fromTransaction }) => {
  console.log(fromTransaction);
  console.log(data);
  const term_sheet_id=data.id;
  
  // console.log(data);
  const [ppaTerm, setPpaTerm] = useState(data.term_of_ppa);
  const [lockInPeriod, setLockInPeriod] = useState(data.lock_in_period);
  // const [commencementOfSupply,setCommencementOfSupply ] = useState(data.commencement_of_supply);
  const navigate = useNavigate();
  const [contractedEnergy, setContractedEnergy] = useState(
    data.contracted_energy
  );
  const [minimumSupply, setMinimumSupply] = useState(data.minimum_supply_obligation);
  const [paymentSecurityType, setPaymentSecurityType] = useState(
    data.payment_security_type
  );
  const [paymentSecurityDays, setPaymentSecurityDays] = useState(
    data.payment_security_day
  );
  const [tarrifModal, setTarrifModal] = useState(false);
  const dispatch = useDispatch();
  const [offerTariff, setOfferTariff] = useState(data.offer_tariff); // state for storing the tariff value

  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = user.user_category;
let temp='';
  if(user_category =='Consumer') {
    temp="IPP"
  } else {
    temp="Consumer"
  }

  useEffect(() => {
    // Update minimumSupply to 80% of contractedEnergy and keep 2 decimal places
    setMinimumSupply(((contractedEnergy * 80) / 100).toFixed(2));
  }, [contractedEnergy]);
  

  // Initialize the commencement date using moment
  const [commencementDate, setCommencementDate] = useState(() => {
    const date = data.commencement_of_supply || data.cod;
    return date ? moment(date, "YYYY-MM-DD").format("DD-MM-YYYY") : "";
  });

  const userId = user.id;

  // Handle the DatePicker change event
  const handleDateChange = (date) => {
    setCommencementDate(date);
  };

  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };

  const handleTarrif = async () => {
    console.log("modal");
    setTarrifModal(true);
  };

  const onTarrifCancel = () => {
    setTarrifModal(false);
  };

  const handleTarrifOk = (value) => {
    setOfferTariff(value);
    const data = {
      user_id: userId,
      terms_sheet_id: term_sheet_id,
      offer_tariff: offerTariff
    };
  console.log(data);  
    try {
      const response = dispatch(negotiateTariff(data));  
      console.log("Response:", response);
      message.success("Tariff negotiated ");
      updateStatus("Accepted");
    } catch (error) {
      console.error("Error negotiating tariff:", error);
    }
    setTarrifModal(false);
  };

  // console.log(data);

  const handleStatusUpdate = async (action) => {
    console.log(action);
    console.log(user.id);
    console.log(data.id);
  
    // If action is 'rejected', show a confirmation popup
    if (action === "Rejected") {
      Modal.confirm({
        title: "Confirm Rejection",
        content: "Are you sure, you want to reject this request?",
        okText: "Yes, Reject",
        cancelText: "Cancel",
        onOk: async () => {
          await updateStatus(action);
        },
      });
    } else {
      await updateStatus(action);
    }
  };

  const updateStatus = async (action) => {
    try {
      const statusData = { action: action };
  
      const res = await dispatch(
        addStatus({ user_id: user.id, term_id: data.id, statusData })
      );
  
      message.success(`Status updated to ${action}`);
      onCancel();
    } catch (error) {
      console.log(error);
      message.error("Failed to update status");
    }
  };

  // const handleStatusUpdate = async (action) => {
  //   console.log(action);
  //   console.log(user.id);
  //   console.log(data.id);
  //   try {
  //     const statusData = {
  //       action: action,
  //     };
  //     const res = await dispatch(
  //       addStatus({ user_id: user.id, term_id: data.id, statusData })
  //     );

  //     message.success(`Status updated to ${action}`);
  //     onCancel();
  //   } catch (error) {
  //     console.log(error);
      
  //     // message.error("Failed to update status");
  //   }
  // };

  const handleTariffChange = (value) => {
    setOfferTariff(value); // Update the offer tariff value in the state
  };

  // console.log(commencementDate);
  // Handle form submission
  const handleContinue = async () => {
    const termSheetId = data.id;

    const termsData = {
      // from_whom: user.user_category,
      requirement_id: selectedDemandId,
      // combination: data.combination.combination || data.combination,
      term_of_ppa: ppaTerm,
      lock_in_period: lockInPeriod,
      commencement_of_supply: commencementDate
        ? moment(commencementDate, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null, // Format date using moment
      contracted_energy: contractedEnergy,
      minimum_supply_obligation: minimumSupply,
      payment_security_type: paymentSecurityType,
      payment_security_day: paymentSecurityDays,
    };

    try {
      console.log(
        "Updating terms and conditions:",
        termsData,
        userId,
        termSheetId
      );
      // Dispatching the action to add Terms and Conditions
      await dispatch(
        updateTermsAndConditions({ userId, termSheetId, termsData })
      ).unwrap();
      message.success("Terms and Conditions added successfully.");
      onCancel(); // Close the modal
    } catch (error) {
      message.error("Failed to add Terms and Conditions.");
    }
  };

  return (
    <div>
      <Modal
        title={
          <Text style={{ color: "#001529", fontSize: "18px" }}>Quotation</Text>
        }
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <p style={{ margin: 0 }}>
            Offer Tariff: <strong>{data?.offer_tariff ? data?.offer_tariff : 0}</strong> INR/kWh
          </p>
          {!fromTransaction ?(
            <>
          <Button style={{ marginLeft: "auto" }} onClick={handleTarrif}>
            Negotiate Tariff
          </Button>
          </>
          ): null}
        </span>

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
                disabled={fromTransaction}
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
                disabled={fromTransaction}
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
                    ? moment(
                        data.cod || data.commencement_of_supply,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")
                    : "Select Date"
                }
                format="DD-MM-YYYY" // Format the date
                // value={commencementDate} // Use moment date here
                onChange={handleDateChange} // Update the state on date change
                disabled={fromTransaction}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Annual Contracted Energy (million units):</strong>
              <InputNumber
                min={0}
                value={contractedEnergy}
                onChange={(value) => setContractedEnergy(value)}
                disabled={fromTransaction}
                style={{ width: "100%",color:"black" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Minimum Supply Obligation (million units):</strong>
              <InputNumber
                min={0}
                value={minimumSupply}
                onChange={(value) => setMinimumSupply(value)}
                disabled={fromTransaction}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Payment Security Type:</strong>
              <Select
                value={paymentSecurityType}
                disabled={fromTransaction}
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
                disabled={fromTransaction}
                onChange={(value) => setPaymentSecurityDays(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          {/* <Col span={12}>
            <Button
              block
              onClick={handleChatWithExpert}
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid #E6E8F1`,
                color: "#001529",
                fontSize: "14px",
              }}
            >
              <img
                src={chat} // Use your imported chat image
                alt="Chat"
                style={{ width: "15px", height: "15px" }}
              />
              Need Assistance?
            </Button>
          </Col> */}
        </Row>

        <Row justify="end" style={{ marginTop: "20px" }}>
          {/* <Button
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
        </Button> */}

          {user_category === "Consumer" 
          &&
          data?.generator_status !== "Rejected" &&
          data?.generator_status !== "Accepted" 
          ? (
            <>
              {(data?.from_whom === "Consumer" &&
                data?.count % 2 === 0 &&
                data?.count <= 4)                
                ||
              (data?.from_whom === "Generator" &&
                data?.count % 2 === 1 &&
                data?.count <= 4) ? (
                <>
                  <Button onClick={() => handleStatusUpdate("Rejected")}>
                    Reject
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={handleTarrif}
                  >
                    Accept
                  </Button>

                  {data?.count === 4 ? (
                    <Tooltip title="You have reached the limit for counter offers">
                      <Button style={{ marginLeft: "10px" }} disabled>
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : data?.count === 3 ? (
                    <Tooltip title={`This is your last chance to send offer to ${temp}, for this demand`}>
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                      >
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : data?.count === 2 ? (
                    <Tooltip title={`You have received a counter offer from ${temp}`}>
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                      >
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      style={{ marginLeft: "10px" }}
                      onClick={handleContinue}
                    >
                      Counter Offer
                    </Button>
                  )}
                </>
              ) : (
                <p style={{ color: "#9A8406" }}>
                  {!fromTransaction ? (
                 <p> You have sent an offer to IPP. Please wait for their decision.</p>
                ) :null}
                </p>
              )}
            </>
          ) : null}


          {!fromTransaction && user_category === "Generator"
          &&
          data?.consumer_status !== "Rejected" &&
          data?.consumer_status !== "Accepted"
           ? (
            <>
              {(data?.from_whom === "Generator" &&
                data?.count % 2 === 0 &&
                data?.count < 4) ||
              (data?.from_whom === "Consumer" &&
                data?.count % 2 === 1 &&
                data?.count < 4) ? (
                <>
                  <Button onClick={() => handleStatusUpdate("Rejected")}>
                    Reject
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={handleTarrif}
                  >
                    Accept
                  </Button>
                  {data?.count === 4 ? (
                    <Tooltip title="You have reached the limit for counter offers">
                      <Button style={{ marginLeft: "10px" }} disabled>
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : data?.count === 3 ? (
                    <Tooltip title={`This is your last chance to send offer to ${temp} for this demand`}>
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                      >
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : data?.count === 2 ? (
                    <Tooltip title={`You have received counter offer from ${temp}`}>
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                      >
                        Counter Offer
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      style={{ marginLeft: "10px" }}
                      onClick={handleContinue}
                    >
                      Counter Offer
                    </Button>
                  )}
                </>
              ) : (
                <p style={{ color: "#9A8406" }}>
                  You have sent an offer to Consumer. Please wait for their
                  decision.
                </p>
              )}
            </>
          ) : null} 


      
        </Row>
        <Modal
          title={"Negotiate Tariff"}
          open={tarrifModal}
          onCancel={onTarrifCancel} // The close (✖) icon will still work
          footer={null} // Removes the Cancel and OK buttons
        >
          <p>{`(If you negotiate the tariff, you can't change the terms and conditions. It will accept and offer tariff send to ${temp})`}</p>
          <InputNumber
            style={{ width: "60%" }}
            value={offerTariff}
            onChange={handleTariffChange}
            placeholder="Enter the tariff value in INR/KWh"
          />
          <Button onClick={handleTarrifOk} style={{ marginLeft: "5%" }}>
            Send
          </Button>
        </Modal>
      </Modal>
    </div>
  );
};

export default CounterOffer;
