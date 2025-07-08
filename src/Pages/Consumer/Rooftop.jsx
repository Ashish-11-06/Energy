import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { Button, Card, Col, message, Radio, Row, Select, Table } from "antd";
import { fetchRequirements } from "../../Redux/Slices/Consumer/consumerRequirementSlice";
import { addPWatt } from "../../Redux/Slices/Consumer/pwattSlice";
import { data } from "react-router-dom";
import { Title } from "chart.js";
const Rooftop = () => {
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State for selected requirement
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user")).user;
    const radioValueRef = useRef(null); // store the selected value
  const [loading,setLoading]=useState(false);
  const [monthlyData,setMonthlyData]=useState([]);
  const [energyReplaced,setEnergyReplaced]=useState('');
  //   console.log('user',userData);

  const requirements = useSelector(
    (state) => state.consumerRequirement.requirements || []
  );
  console.log("requirements", requirements);

  useEffect(() => {
    const fetchReq = async () => {
      const res = await dispatch(fetchRequirements(userData?.id));
      console.log("res", res);
    };
    fetchReq();
  }, [dispatch]);
 const handleRadioChange = (e) => {
    radioValueRef.current = e.target.value;
    console.log('Selected value:', radioValueRef.current);
  };
  const handleRequirementChange =async (value) => {
    const selected = requirements.find((req) => req.id === value);
    setSelectedRequirement(selected);
  };
  // console.log('radion value',radioValueRef);
const handleSubmit = async () => {
  setMonthlyData([]);
  setEnergyReplaced('')
  if(!selectedRequirement) return message.error('Please select a requirement');
  if(!radioValueRef.current) return message.error('Please select a type');
  setLoading(true);
  const data = {
    requirement_id: selectedRequirement?.id,
    button_type: radioValueRef.current
    // requirement_id:18,
    // button_type:"grid_connected"
  };

  const res = await dispatch(addPWatt(data));

  if (addPWatt.fulfilled.match(res)) {
    console.log('✅ Response:', res.payload);
    setMonthlyData(res?.payload.monthly_data);
    setEnergyReplaced(res.payload.energy_replaced);
    setLoading(false);
  } else if (addPWatt.rejected.match(res)) {
    // ❌ failed — show error message
    message.error(res.payload); // e.g. "no master data found for this state."
    setLoading(false)
    console.error('❌ Rejected:', res.payload);
  }
};

const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Sort monthlyData by correct calendar order
const sortedMonthlyData = [...monthlyData].sort((a, b) => {
  return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
});
 const middleIndex = Math.ceil(sortedMonthlyData.length / 2);
const firstHalf = sortedMonthlyData.slice(0, middleIndex);
const secondHalf = sortedMonthlyData.slice(middleIndex);


const columns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    align: 'center',
  },
  {
    title: 'Generation (kWh)',
    dataIndex: 'generation',
    key: 'generation',
    align: 'center',
  },
  {
    title: 'Savings (INR)',
    dataIndex: 'savings',
    key: 'savings',
    align: 'center',
    render: (value) => `${value.toFixed(2)}`,
  },
];



  
  return (
   <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <h2 style={{ alignSelf: 'flex-start' }}>Rooftop Onsite Assessment</h2>

      <Card
        style={{
          width: '100%',
          // maxWidth: 800,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        {/* Dropdown */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p
              style={{
                margin: '0 0 8px 0',
                fontWeight: '500',
              }}
            >
              Select Requirement
            </p>
            <Select
              style={{ width: '100%' }}
              value={selectedRequirement?.id}
              onChange={handleRequirementChange}
              options={
                Array.isArray(requirements)
                  ? requirements.map((req) => ({
                      label: (
                        <span>
                          <strong>State:</strong> {req.state},{" "}
                          <strong>Roof Area:</strong> {req.roof_area} sq m,{" "}
                          <strong>Solar Rooftop Capacity:</strong>{" "}
                          {req.solar_rooftop_capacity} kWp,{` `}
                          <strong>Location:</strong> {req.location},{" "}
                          <strong>Voltage:</strong> {req.voltage_level} kV,{` `}
                          <strong>Annual Consumption:</strong>{" "}
                          {req.annual_electricity_consumption} MWh,{` `}
                          <strong>Procurement Date:</strong>{" "}
                          {req.procurement_date}
                        </span>
                      ),
                      value: req.id,
                    }))
                  : []
              }
              placeholder="Select the requirement"
              showSearch
              optionFilterProp="children"
            />
          </Col>
           {/* Radio buttons */}
        <Row gutter={[16, 16]}>
           <p
              style={{
                margin: '0 0 8px 0',
                fontWeight: '500',
              }}
            >
              Select Type
            </p>
          <Col span={24}>
            <Radio.Group
              onChange={(e) => {
                radioValueRef.current = e.target.value;
                handleRadioChange(e);
              }}
              style={{ width: '100%' }}
            >
              <Radio value="grid_connected">Grid connected</Radio>
              <Radio value="behind_the_meter">Behind the meter</Radio>
            </Radio.Group>
          </Col>
        </Row>
        </Row>
<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
  <Button type="primary" onClick={handleSubmit} loading={loading}>
    Submit
  </Button>
</div>

      </Card>
     <Card
      style={{
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <p style={{fontWeight:'bold'}}>Energy Replaced : {energyReplaced}</p>
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Monthly Data</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Table
            dataSource={firstHalf}
            columns={columns}
            rowKey="month"
            pagination={false}
            size="small"
            bordered
          />
        </Col>
        <Col xs={24} md={12}>
          <Table
            dataSource={secondHalf}
            columns={columns}
            rowKey="month"
            pagination={false}
            size="small"
            bordered
          />
        </Col>
      </Row>
    </Card>
    </main>
  );
};

export default Rooftop;
