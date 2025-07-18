/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
  Collapse,
  Card, // Import Collapse component
} from "antd";
import React, { useState, useEffect } from "react"; // Import useState along with React
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";
import { addStatus } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";
import chat from "../../assets/need.png";
import { negotiateTariff } from "../../Redux/Slices/Consumer/negotiateTariffSlice";
import AgreementModal from "./AgreementModal";
import { decryptData } from "../../Utils/cryptoHelper";
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const CounterOffer = ({ visible, onCancel, data, selectedDemandId, fromTransaction,requirementContent ,combinationContent}) => {
  // console.log('comb',combinationContent);
  // console.log('data',data);
  // console.log(combinationContent)
  const term_sheet_id = data.id;
  const downloadable = data?.downloadable;

  // console.log(downloadable);
  const [ppaTerm, setPpaTerm] = useState(data.term_of_ppa);
  const [lockInPeriod, setLockInPeriod] = useState(data.lock_in_period);
  // const [commencementOfSupply,setCommencementOfSupply ] = useState(data.commencement_of_supply);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFieldEdited, setIsFieldEdited] = useState(false); // Track if any field is edited
  const [consumerDetailsVisible, setConsumerDetailsVisible] = useState(false); // State to toggle consumer details
     const userr = decryptData(localStorage.getItem('user'));
    const userData= userr?.user;
  // const userData = JSON.parse(localStorage.getItem('user')).user;
// console.log(userData?.role);
const role=userData?.role;
  const subscription = decryptData(localStorage.getItem("subscriptionPlanValidity"))

  const activeSubscription = subscription?.status === "active";
  const showModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
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

  // const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = userData.user_category;
  let temp = '';
  if (user_category == 'Consumer') {
    temp = "IPP"
  } else {
    temp = "Consumer"
  }

  // useEffect(() => {
  //   // Update minimumSupply to 80% of contractedEnergy and keep 2 decimal places
  //   setMinimumSupply(((contractedEnergy * 80) / 100).toFixed(2));
  // }, [contractedEnergy]);


  // Initialize the commencement date using moment
  const [commencementDate, setCommencementDate] = useState(() => {
    const date = data.commencement_of_supply || data.cod;
    return date ? moment(date, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
  });

  // console.log(commencementDate);
  
  const userId = userData.id;

  // Handle the DatePicker change event
  const handleDateChange = (date) => {
    if (date) {
      setCommencementDate(moment(date).format("YYYY-MM-DD")); // Ensure correct format
      // console.log("Selected Date:", moment(date).format("YYYY-MM-DD"));
      const formattedDate = moment(date).format("YYYY-MM-DD");
      // console.log("Formatted Date:", formattedDate); // Log the formatted date
    }
  };

  const handleChatWithExpert = () => {
    navigate("/chat-page");
  };

  const handleTarrif = async () => {
    // console.log("modal");
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
    // console.log(data);  
    try {
      const response = dispatch(negotiateTariff(data));
      // console.log("Response:", response);
      message.success("Tariff negotiated ");
      updateStatus("Accepted");
    } catch (error) {
      message.error(error);
      // console.error("Error negotiating tariff:", error);
    }
    setTarrifModal(false);
  };

  // console.log(data);

  const handleStatusUpdate = async (action) => {
    // console.log(action);
    // console.log(user.id);
    // console.log(data.id);

    // If action is 'rejected', show a confirmation popup
    if (action === "Rejected") {
      Modal.confirm({
        title: "Confirm Rejection",
        content: "Are you sure, you want to reject this request?",
        okText: "Yes, Reject",
        cancelText: data?.count === 4 ? "Counter Offer" : "Counter Offer",
        cancelButtonProps: { disabled: data?.count === 4 }, // Disable the button when count is 4
        onOk: async () => {
          await updateStatus(action);
        },
        onCancel: () => { 
          setModalVisible(false); // Close the confirm reject modal
        },
        onClose: () => {
          setModalVisible(false); // Handle the cross button close
        },
        closable: true, // Add close button to the modal
      });
    } else {
      await updateStatus(action);
    }
    if (action === "Withdraw") {
      await updateStatus(action);
      return; // Exit early to prevent showing other buttons
    }
  };

  const updateStatus = async (action) => {
    try {
      const statusData = { action: action };

      const res = await dispatch(
        addStatus({ user_id: userData.id, term_id: data.id, statusData })
      );

      message.success(`Status updated to ${action}`);
      onCancel();
    } catch (error) {
   // console.log(error);
      message.error("Failed to update status");
    }
  };

  const handleTariffChange = (value) => {
    setOfferTariff(value); // Update the offer tariff value in the state
  };

  // console.log(commencementDate);
  // Handle form submission
  const handleContinue = async () => {
    // console.log('clicked');
    
    const termSheetId = data.id;

    const termsData = {
      // from_whom: user.user_category,
      requirement_id: selectedDemandId,
      // combination: data.combination.combination || data.combination,
      term_of_ppa: ppaTerm,
      lock_in_period: lockInPeriod,
      commencement_of_supply: commencementDate, // Use the correctly formatted date
      // commencement_of_supply: commencementDate && moment.isMoment(commencementDate)
      //   ? commencementDate.format("YYYY-MM-DD")
      //   : moment(commencementDate, "DD-MM-YYYY").format("YYYY-MM-DD"),    
      contracted_energy: contractedEnergy,
      minimum_supply_obligation: minimumSupply,
      payment_security_type: paymentSecurityType,
      payment_security_day: paymentSecurityDays,
    };
    // console.log("Final Commencement Date:", commencementDate);

    try {
   // console.log(
      //   "Updating terms and conditions:",
      //   termsData,
      //   userId,
      //   termSheetId
      // );
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

  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setIsFieldEdited(true); // Mark as edited when any field changes
  };

  const toggleConsumerDetails = () => {
    setConsumerDetailsVisible(!consumerDetailsVisible);
  };
//// console.log(moment(commencementDate, "DD-MM-YYYY").format("YYYY-MM-DD"));
// console.log(commencementDate)
// console.log(moment(commencementDate, "DD-MM-YYYY").format("YYYY-MM-DD"))
// console.log("Final Commencement Date:", commencementDate);

const handleAccept = async () => {
  if (user_category === "Consumer") {
    try {
      const data = {
        user_id: userId,
        terms_sheet_id: term_sheet_id,
        offer_tariff: offerTariff,
      };
      await dispatch(negotiateTariff(data));
      message.success("Offer accepted successfully.");
      updateStatus("Accepted");
    } catch (error) {
      message.error("Failed to accept the offer.");
    }
  } else {
    setTarrifModal(true); // Open modal for other user categories
  }
};

  return (
    <div>
      <Modal
        title={
          <Text style={{ color: "#001529", fontSize: "18px" }}>Quotation</Text>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
      {/* <div style={{ maxHeight: '70vh', overflowY: 'auto' }}> */}
      <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <p style={{ margin: 0,fontSize: "16px" }}>
            Offer Tariff: <strong>{data?.offer_tariff ? data?.offer_tariff : 0}</strong> INR/kWh
          </p>
          {!fromTransaction ? (
            <>
              {(data?.generator_status !== "Rejected" && data?.generator_status !== "Accepted") || (data?.consumer_status !== "Rejected" && data?.consumer_status !== "Accepted") && (
                <>
                  {((data?.from_whom === "Consumer" || data?.from_whom === "Generator" &&
                    data?.count % 2 === 0 &&
                    data?.count <= 4) ||
                    (data?.from_whom === "Generator" &&
                      data?.count % 2 === 1 &&
                      data?.count <= 4)) && (
                      <Button style={{ marginLeft: "auto" }} onClick={handleTarrif}>
                        Negotiate Tariff
                      </Button>
                    )}
                </>
              )}
            </>
          ) : null}
        </span>

        {data?.tariff_status === "Accepted" && (
  <Card  bordered={false} style={{ marginBottom: 16 }}>
    <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
      Combinantion Details
    </Title>
    <Row justify="space-between">
      <Col>
        <p style={{ margin: 0, fontSize: "16px" }}>
          Solar: <strong>{data?.c_optimal_solar_capacity || 0}</strong> MW
        </p>
      </Col>
      <Col>
        <p style={{ margin: 0, fontSize: "16px" }}>
          Wind: <strong>{data?.c_optimal_wind_capacity || 0}</strong> MW
        </p>
      </Col>
      <Col>
        <p style={{ margin: 0, fontSize: "16px" }}>
          Battery: <strong>{data?.c_optimal_battery_capacity || 0}</strong> MWh
        </p>
      </Col>
    </Row>
  </Card>
)}

        <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
          Standard Terms Sheet
        </Title>

        {/* Consumer or Combination Details Section */}
        {!fromTransaction && ( // Fix the missing closing parenthesis
          <Collapse defaultActiveKey={["1"]} accordion>
            <Panel
              header={user_category === "Consumer" ? "Combination Details" : "Demand Details"}
              key="1"
              style={{ backgroundColor: "#f0f2f5", fontWeight: "bold" }}
            >
              {user_category === "Consumer" && combinationContent ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Combination:</strong> {combinationContent.combination}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Final Cost:</strong> {combinationContent.final_cost} INR/kWh
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Optimal Solar Capacity:</strong> {combinationContent.optimal_solar_capacity} MW
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Optimal Wind Capacity:</strong> {combinationContent.optimal_wind_capacity} MW
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Optimal Battery Capacity:</strong> {combinationContent.optimal_battery_capacity} MWh
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Optimal Per Unit Cost:</strong> {combinationContent.per_unit_cost} INR/kWh
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>RE Replacement:</strong> {combinationContent.re_replacement}%
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                  <Typography.Paragraph>
                    <strong>State:</strong>{" "}
                    {combinationContent.state &&
                      Object.entries(
                        JSON.parse(combinationContent.state.replace(/'/g, '"')) // Replace single quotes with double quotes
                      )
                        .map(([key, value]) => `${key.replace('_', ' ')} - ${value}`)
                        .join(', ')}
                  </Typography.Paragraph>
                  </Col>
                </Row>
              ) : user_category === "Consumer" ? (
                <Typography.Paragraph>
                  <strong>No combination details available.</strong>
                </Typography.Paragraph>
              ) : (
                <Row gutter={16}>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Contracted Demand:</strong> {requirementContent?.rq_contracted_demand} MW
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Industry:</strong> {requirementContent?.rq_industry}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Procurement Date:</strong> {requirementContent?.rq_procurement_date}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Site:</strong> {requirementContent?.rq_site}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>State:</strong> {requirementContent?.rq_state}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Tariff Category:</strong> {requirementContent?.rq_tariff_category}
                    </Typography.Paragraph>
                  </Col>
                  <Col span={12}>
                    <Typography.Paragraph>
                      <strong>Voltage Level:</strong> {requirementContent?.rq_voltage_level} kV
                    </Typography.Paragraph>
                  </Col>
                </Row>
              )}
            </Panel>
          </Collapse>
        )}

        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Term of PPA (years):</strong>
              <InputNumber
                min={1} // Updated to prevent 0 or negative values
                value={ppaTerm}
                disabled={fromTransaction}
                onChange={handleFieldChange(setPpaTerm)} // Use handleFieldChange
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Lock-in Period (years):</strong>
              <InputNumber
                min={1} // Updated to prevent 0 or negative values
                value={lockInPeriod}
                disabled={fromTransaction}
                onChange={handleFieldChange(setLockInPeriod)} // Use handleFieldChange
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
                onChange={(date) => {
                  handleDateChange(date);
                  setIsFieldEdited(true); // Mark as edited
                }} // Update the state on date change
                disabled={fromTransaction}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Annual Contracted Energy (million units):</strong>
              <InputNumber
                min={1} // Updated to prevent 0 or negative values
                value={contractedEnergy}
                onChange={handleFieldChange(setContractedEnergy)} // Use handleFieldChange
                disabled={fromTransaction}
                style={{ width: "100%", color: "black" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Minimum Supply Obligation (million units):</strong>
              <InputNumber
                min={1} // Updated to prevent 0 or negative values
                value={minimumSupply}
                onChange={handleFieldChange(setMinimumSupply)} // Use handleFieldChange
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
                onChange={(value) => {
                  setPaymentSecurityType(value);
                  setIsFieldEdited(true); // Mark as edited
                }}
                style={{ width: "100%" }}
              >
                <Option value="Bank Guarantee">Bank Guarantee</Option>
                <Option value="Cash Deposit">Cash Deposit</Option>
                <Option value="Letter of Credit">Letter of Credit</Option>
                <Option value="None">None</Option>
              </Select>
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Payment Security Days:</strong>
              <InputNumber
                min={1} // Updated to prevent 0 or negative values
                value={paymentSecurityDays}
                disabled={fromTransaction}
                onChange={handleFieldChange(setPaymentSecurityDays)} // Use handleFieldChange
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          {/* <Button
                      // style={{
                      //   color: "#ff5858",
                      //   borderColor: "#ff5858",
                      //   backgroundColor: "transparent",
                      // }}
                      className="red-btn"
                      onClick={() => handleStatusUpdate("Rejected")}
                      // disabled={isFieldEdited}
                    >
                      Reject
                    </Button> */}
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

          {user_category === "Consumer" && role !== 'View'
          //  && activeSubscription
            &&
            data?.generator_status !== "Rejected" &&
            data?.generator_status !== "Accepted" &&
            data?.generator_status !== "Withdrawn" ? ( // Hide buttons if status is "Withdraw"
              <>
              
                {(data?.from_whom === "Consumer" &&
                  data?.count % 2 === 0 &&
                  data?.count <= 4)
                  ||
                  (data?.from_whom === "Generator" &&
                    data?.count % 2 === 1 &&
                    data?.count <= 4) ? (
                  <>
                  
                    <Button
                      // style={{
                      //   color: "#ff5858",
                      //   borderColor: "#ff5858",
                      //   backgroundColor: "transparent",
                      // }}
                      className="red-btn"
                      onClick={() => handleStatusUpdate("Rejected")}
                      disabled={isFieldEdited}
                    >
                      Reject
                    </Button>


                    <Button
                      style={{ marginLeft: "10px" }}
                      onClick={handleAccept}
                      disabled={isFieldEdited}
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
                          disabled={data?.count === 4} // Disable button when count is 4
                        >
                          Counter Offer
                        </Button>
                      </Tooltip>
                    ) : data?.count === 2 ? (
                      <Tooltip title={`You have received a counter offer from ${temp}`}>
                        <Button
                          style={{ marginLeft: "10px" }}
                          onClick={handleContinue}
                          disabled={data?.count === 4} // Disable button when count is 4
                        >
                          Counter Offer
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                        disabled={data?.count === 4} // Disable button when count is 4
                      >
                        Counter Offer
                      </Button>
                    )}
                  </>
                ) : (
                  <p style={{ color: "#9A8406" }}>
                    {!fromTransaction ? (
                        <div style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            style={{ marginBottom: "5px" }}
                            onClick={() => handleStatusUpdate("Withdraw")}
                            disabled={isFieldEdited}
                          >
                            Withdraw
                          </Button>
                        </div>
                      <p> You have sent an offer to IPP. Please wait for their decision.</p>
                     </div>
                    ) : null}
                  </p>
                )}
              </>
            ) : null}


          {!fromTransaction && user_category === "Generator" && role !== 'View' 
          // && activeSubscription
            &&
            data?.consumer_status !== "Rejected" &&
            data?.consumer_status !== "Accepted" &&
            data?.consumer_status !== "Withdraw" ? ( // Hide buttons if status is "Withdraw"
              <>
                {(data?.from_whom === "Generator" &&
                  data?.count % 2 === 0 &&
                  data?.count <= 4) ||
                  (data?.from_whom === "Consumer" &&
                    data?.count % 2 === 1 &&
                    data?.count <= 4) ? (
                  <>
                   
                   <Button
                      // style={{
                      //   color: "#ff5858",
                      //   borderColor: "#ff5858",
                      //   backgroundColor: "transparent",
                      // }}
                      className="red-btn"
                      onClick={() => handleStatusUpdate("Rejected")}
                      disabled={isFieldEdited}
                    >
                      Reject
                    </Button>


                    <Button
                      style={{ marginLeft: "10px" }}
                      onClick={handleAccept}
                      disabled={isFieldEdited}
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
                          disabled={data?.count === 4} // Disable button when count is 4
                        >
                          Counter Offer
                        </Button>
                      </Tooltip>
                    ) : data?.count === 2 ? (
                      <Tooltip title={`You have received counter offer from ${temp}`}>
                        <Button
                          style={{ marginLeft: "10px" }}
                          onClick={handleContinue}
                          disabled={data?.count === 4} // Disable button when count is 4
                        >
                          Counter Offer
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        style={{ marginLeft: "10px" }}
                        onClick={handleContinue}
                        disabled={data?.count === 4} // Disable button when count is 4
                      >
                        Counter Offer
                      </Button>
                    )}
                  </>
                ) : (
                  <div style={{ marginTop: "10px" }}>
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <Button
      style={{ marginBottom: "5px" }}
      onClick={() => handleStatusUpdate("Withdraw")}
      disabled={isFieldEdited}
    >
      Withdraw
    </Button>
  </div>
  <p style={{ color: "#9A8406", margin: 0 }}>
    You have sent an offer to Consumer. Please wait for their decision.
  </p>
</div>

                
                )}
              </>
            ) : null}


        </Row>
        <Button type="text" style={{ marginTop: '20px' }} onClick={showModal}>
          View in Detail
        </Button>
        <AgreementModal data={downloadable} visible={modalVisible} onClose={handleCloseModal} />
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
            placeholder="Enter the tariff value in INR/kWh"
          />
          <Button onClick={handleTarrifOk} style={{ marginLeft: "5%" }}>
            Send
          </Button>
        </Modal>
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default CounterOffer;
