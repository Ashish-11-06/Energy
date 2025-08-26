/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
  Card,
  Input,
  Tooltip,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SummaryOfferModal from "./SummaryOfferModal";
import { useDispatch } from "react-redux";
import { addTermsAndConditions } from "../../Redux/Slices/Generator/TermsAndConditionsSlice";
import AgreementModal from "./AgreementModal";
import { decryptData } from "../../Utils/cryptoHelper";

const { Title, Text } = Typography;
const { Option } = Select;

const RequestForQuotationModal = ({
  visible,
  onCancel,

  data,
  fromModal,
  selectedDemandId,
  fromInitiateQuotation
}) => {
  const [ppaTerm, setPpaTerm] = useState(20);
  const [lockInPeriod, setLockInPeriod] = useState(10);
  const [contractedEnergy, setContractedEnergy] = useState(data?.annual_demand_met);
  const [paymentSecurityType, setPaymentSecurityType] = useState("Bank Guarantee");
  const [paymentSecurityDays, setPaymentSecurityDays] = useState(30);
  const [minimumSupply, setMinimumSupply] = useState(
  data?.annual_demand_met ? ((data.annual_demand_met * 80) / 100).toFixed(2) : 0
);
  const [solar, setSolar] = useState(
    data?.technology?.find((tech) => tech.name === "Solar")?.capacity.replace(" MW", "") || 0
  );
  const [wind, setWind] = useState(
    data?.technology?.find((tech) => tech.name === "Wind")?.capacity.replace(" MW", "") || 0
  );
  const [battery, setBattery] = useState(
    data?.technology?.find((tech) => tech.name === "ESS")?.capacity.replace(" MWh", "") || 0
  );
  const [perUnitCost,setPerUnitCost] =useState(data.perUnitCost);
  const [terminationCompensation, setTerminationCompensation] = useState(24);
  const [latePaymentSurcharge, setLatePaymentSurcharge] = useState(1.25);
  const [modalVisible, setModalVisible] = useState(false);
  

// console.log('ddd',data);
// console.log('tech data',technologyData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = decryptData(localStorage.getItem('user'));
  const user= userData?.user;
  // console.log('user in RFQ',user);
  
  // const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = user.user_category;
// console.log('user ',user);
  const isConsumerWithoutCredit = user_category === 'Consumer' && (!user?.credit_rating || user.credit_rating.trim() === '');

  useEffect(() => {
    if (contractedEnergy) {
      setMinimumSupply(((contractedEnergy * 80) / 100).toFixed(2));
    }
  }, [contractedEnergy]);


const handleContinueClick = () => {
  if (
    user_category === 'Consumer' &&
    (!user?.credit_rating || user.credit_rating.trim() === '')
  ) {
    message.warning('Please update profile by filling the credit rating in Profile section');
    return;
  }

  handleContinue(); // proceed if valid
};

  const handleSendToIPPs = () => {
    message.success("Your request has been sent to IPPs.");
    onCancel();
  };

  const showModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const downloadable = data?.downloadable;
  // console.log(downloadable);

  // const downloadableData = {
  //   term_of_ppa:ppaTerm,
  //   lock_in_period:lockInPeriod,
  //   minimum_supply:minimumSupply,
  //   contracted_energy:contractedEnergy,
  //   payment_security_type:paymentSecurityType,
  //   payment_security_day:paymentSecurityDays,
  //   offer_tariff:perUnitCost,
  //   solar_capacity:solarCapacity,
  //   wind_capacity:windCapacity,
  //   ess_capacity:essCapacity,
  //   // commencement_of_supply: data?.cod ? moment(data.cod).format("YYYY-MM-DD") : null,
  // };
  // }

  const termsData = {
    offer_tariff: perUnitCost || 0,
    from_whom: user?.user_category || "",
    requirement_id: selectedDemandId || "",
    combination: data?.combination || "",
    term_of_ppa: ppaTerm || "",
    lock_in_period: lockInPeriod || "",
    commencement_of_supply: data?.cod ? moment(data.cod).format("YYYY-MM-DD") : null,
    contracted_energy: contractedEnergy,
    minimum_supply_obligation: minimumSupply || 0,
    payment_security_type: paymentSecurityType || "",
    payment_security_day: paymentSecurityDays || 0,
    termination_compensation: terminationCompensation || 0,
    late_payment_surcharge: latePaymentSurcharge || 0,
    solar: Number(solar) || 0,
    wind: Number(wind) || 0,
    ess: Number(battery) || 0,
    generator: downloadable.generator || "N/A",
    consumer: downloadable.consumer || "N/A",
    consumer_state: downloadable.consumer_state || "N/A",
    minimum_generation_obligation: downloadable.minimum_generation_obligation || "N/A",
    voltage_level_of_generation: downloadable.voltage_level_of_generation || "N/A",

    // generator_state: downloadable.generator_state,
  };

// console.log('solar', solar);
// console.log('wind', wind);
// console.log('battery', battery);
//   console.log('termsData', termsData);

  const handleContinue = async () => {
 // console.log('user', user);

    // const creditRating = user?.credit_rating;
    // const user_category = user?.user_category;
    // console.log('user_category:', user_category, 'creditRating:', creditRating);

    // // Fix: check for null, undefined, "null", and "undefined"
    // if (
    //   user_category && user_category.toLowerCase() === 'consumer' &&
    //   (
    //     creditRating === null ||
    //     creditRating === undefined ||
    //     creditRating === "null" ||
    //     creditRating === "undefined" ||
    //     creditRating === ""
    //   )
    // ) {
    //// console.log('Credit rating is null, showing modal and message');
    //   Modal.info({
    //     title: 'Credit Rating Required',
    //     content: (
    //       <div>
    //         <p>Please update your credit rating to proceed with the quotation.</p>
    //       </div>
    //     ),
    //     okText: 'OK',
    //     onOk: () => {
    //       navigate('/consumer/profile');
    //     },
    //   });

    //   message.error({
    //     content: 'Please update your credit rating before proceeding.',
    //     duration: 6,
    //   });

    //   return;
    // }
    // console.log('aarti ne click kiya');
    const termsData = {
      offer_tariff: perUnitCost || 0,
      from_whom: user?.user_category || "",
      requirement_id: selectedDemandId || "",
      combination: data?.combination || "",
      term_of_ppa: ppaTerm || "",
      lock_in_period: lockInPeriod || "",
      commencement_of_supply: data?.cod ? moment(data.cod).format("YYYY-MM-DD") : null,
      contracted_energy: contractedEnergy,
      minimum_supply_obligation: minimumSupply || 0,
      payment_security_type: paymentSecurityType || "",
      payment_security_day: paymentSecurityDays || 0,
      re_replacement: Number(data?.reReplacement) || 0,
      solar_capacity: Number(solar) || 0,
      wind_capacity:Number(wind)  || 0,
      ess_capacity: Number(battery) || 0,
       termination_compensation: terminationCompensation || 0,
    late_payment_surcharge: latePaymentSurcharge || 0,
    };
// console.log('termsData',termsData);


    try {
      await dispatch(addTermsAndConditions(termsData)).unwrap();
      message.success({
        content: "Terms and Conditions added successfully.",
        duration: 6,
      });
      message.success({
        content: "Now you can continue your journey for this demand in the offers section.",
        duration: 8,
      });
      onCancel();
    } catch (error) {
      message.error({
        content: error || "Failed to add Terms and Conditions.",
        duration: 7,
      });
    }
  };

  // Calculate default equity contribution
  const calculateEquityContribution = () => {
    const solarCap = Number(solar) || 0;
    const windCap = Number(wind) || 0;
    const essCap = Number(battery) || 0;
    const solarCost = Number(data?.capital_cost_solar) || 0;
    const windCost = Number(data?.capital_cost_wind) || 0;
    const essCost = Number(data?.capital_cost_ess) || 0;
    const total =
      (solarCost * solarCap + windCost * windCap + essCost * essCap) * 0.3 * 0.26;
    return Number(total.toFixed(2));
  };

  const [equityContribution, setEquityContribution] = useState(calculateEquityContribution());

  // Update equity contribution when capacities or costs change
  useEffect(() => {
    setEquityContribution(calculateEquityContribution());
    // eslint-disable-next-line
  }, [solar, wind, battery, data?.capital_cost_solar, data?.capital_cost_wind, data?.capital_cost_ess]);
  // console.log('termsData',terminationCompensation,latePaymentSurcharge);

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
       <p><strong> Offer Tariff (INR/kWh): </strong>
  {user_category === "Generator" && fromInitiateQuotation ? (
    <InputNumber 
      min={1}
      value={perUnitCost}
      onChange={(value) => setPerUnitCost(value)}
    />
  ) : (
    <span>{perUnitCost}</span>
  )}
</p>
{user_category === "Generator" && fromInitiateQuotation ? (
<Card bordered={false} style={{ marginBottom: 16 }}>
      <Title level={5} style={{ textAlign: 'center', color: '#669800' }}>
        Combination Details
      </Title>
      <Row justify="space-between" align="middle" gutter={16}>
  <Col flex="1">
    <Row align="middle">
      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', marginRight: 8 }}>
        Solar  (MW):
      </span>
      <Input
        value={solar}
        onChange={(e) => setSolar(e.target.value)}
        style={{ width: 100, fontSize: '16px' }}
      />
    </Row>
  </Col>

  <Col flex="1">
    <Row align="middle">
      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', marginRight: 8 }}>
        Wind  (MW):
      </span>
      <Input
        value={wind}
        onChange={(e) => setWind(e.target.value)}
        style={{ width: 100, fontSize: '16px' }}
      />
    </Row>
  </Col>

  <Col flex="1">
    <Row align="middle">
      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap', marginRight: 8 }}>
        Battery  (MWh):
      </span>
      <Input
        value={battery}
        onChange={(e) => setBattery(e.target.value)}
        style={{ width: 100, fontSize: '16px' }}
      />
    </Row>
  </Col>
</Row>



    </Card>
) : (
  null)}

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
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  return current && current <= moment().endOf('day');
                }}
                value={data.cod ? moment(data.cod, "YYYY-MM-DD") : moment("2024-08-31", "YYYY-MM-DD")}
                onChange={(date) => data.cod = date ? date.format("YYYY-MM-DD") : null}
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
                <Option value="None">None</Option>

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
          {fromInitiateQuotation ? (
          <Col span={12}>
            <Typography.Paragraph>
              <strong> Equity Contribution Required From Consumer (INR Cr):</strong>
              <InputNumber
                min={0}
                value={equityContribution}
                onChange={(value) => setEquityContribution(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          ) : null}
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Late Payment Surcharge (percent/month):</strong>
              <InputNumber
                min={0}
                value={latePaymentSurcharge}
                onChange={(value) => setLatePaymentSurcharge(value)}
                style={{ width: "100%" }}
              />
            </Typography.Paragraph>
          </Col>
          <Col span={12}>
            <Typography.Paragraph>
              <strong>Termination Compensation (months)</strong>
              <InputNumber
                min={0}
                value={terminationCompensation}
                onChange={(value) => setTerminationCompensation(value)}
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
                marginTop: '6%'
              }}
            >
              Need Assistance ?
            </Button>
          </Col> */}
        </Row>
         <Button type="text" style={{ marginTop: '20px' }} onClick={showModal}>
                  View in Detail
                </Button>
        <Row justify="end" style={{ marginTop: "20px" }}>
<Tooltip
  title={
    isConsumerWithoutCredit
      ? 'Please update profile by filling the credit rating in Profile section'
      : ''
  }
>
  <span>
    <Button
      type="primary"
      style={{
        backgroundColor: "#669800",
        borderColor: "#669800",
        fontSize: "16px",
        padding: "10px 20px",
      }}
      onClick={handleContinueClick}
      disabled={isConsumerWithoutCredit}
    >
      {user_category === 'Generator' ? 'Send to Consumer' : 'Send to IPPs'}
    </Button>
  </span>
</Tooltip>
        </Row>
      </Modal>
      <AgreementModal data={termsData} visible={modalVisible} onClose={handleCloseModal} />

      <SummaryOfferModal
        visible={false}
        onCancel={() => {}}
        offerDetails={{}}
      />
    </>
  );
};

export default RequestForQuotationModal;