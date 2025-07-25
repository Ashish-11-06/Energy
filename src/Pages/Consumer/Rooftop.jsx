import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { Button, Card, Col, message, Modal, Radio, Row, Select, Table } from "antd";
import { fetchRequirements } from "../../Redux/Slices/Consumer/consumerRequirementSlice";
import { addPWatt } from "../../Redux/Slices/Consumer/pwattSlice";
import * as XLSX from "xlsx";
import RequirementForm from './Modal/RequirenmentForm'; // Import the RequirementForm component
import { data } from "react-router-dom";
import { Title } from "chart.js";
import { decryptData } from "../../Utils/cryptoHelper";
const Rooftop = () => {
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State for selected requirement
  const dispatch = useDispatch();
  // const userData = JSON.parse(localStorage.getItem("user")).user;
   const user = decryptData(localStorage.getItem('user'));
  const userData= user?.user;
  const radioValueRef = useRef(null); // store the selected value
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [energyReplaced, setEnergyReplaced] = useState("");
  const [requiredData, setRequiredData] = useState(null);
  const [warningModal, setWarningModal] = useState(false);
  const [incompleteRequirement, setIncompleteRequirement] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
const [selectKey, setSelectKey] = useState(Date.now()); // initial unique key
const [capacitySolar, setCapacitySolar] = useState("");
const [totalSavings, setTotalSavings] = useState("");
const [hourlyData,setHourlyData] = useState([]);
  //   console.log('user',userData);

  const requirements = useSelector(
    (state) => state.consumerRequirement.requirements || []
  );
  // console.log("requirements", requirements);

  useEffect(() => {
    const filtered = requirements.filter(
      (item) =>
        item.solar_rooftop_capacity && Number(item.solar_rooftop_capacity) > 0
    );

    setRequiredData(filtered);
  }, [requirements]);

  useEffect(() => {
    const fetchReq = async () => {
      const res = await dispatch(fetchRequirements(userData?.id));
      // console.log("res", res);
    };
    fetchReq();
  }, [dispatch]);
  const handleRadioChange = (e) => {
    radioValueRef.current = e.target.value;
    // console.log("Selected value:", radioValueRef.current);
  };

const handleRequirementChange = (value) => {
  const selected = requirements.find((req) => req.id === value);

  const isMissingFields =
    !selected?.roof_area ||
    !selected?.solar_rooftop_capacity ||
    !selected?.location;

if (isMissingFields) {
  setIncompleteRequirement(selected);
  setWarningModal(true);
  setSelectedRequirement(null);
  setSelectedRequirementId(null);
  setSelectKey(Date.now()); // 🔁 Force re-render by changing key
  return;
}
 else {
    setSelectedRequirement(selected);
    setSelectedRequirementId(selected.id); // Set dropdown value
  }
};

  // console.log('radion value',radioValueRef);
  const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  const handleSubmit = async () => {
    setMonthlyData([]);
    setEnergyReplaced("");
    setTotalSavings("");
    setCapacitySolar("");
    if (!selectedRequirement)
      return message.error("Please select a requirement");
    if (!radioValueRef.current) return message.error("Please select a type");
    setLoading(true);
    const data = {
      requirement_id: selectedRequirement?.id,
      button_type: radioValueRef.current,
      // requirement_id:18,
      // button_type:"grid_connected"
    };

    const res = await dispatch(addPWatt(data));

   if (addPWatt.fulfilled.match(res)) {
    // console.log("✅ Fulfilled response:", res.payload);
    // if(radioValueRef.current === "grid_connected") {
    setHourlyData(res?.payload?.hourly_data);
  const convertedData = res?.payload?.monthly_data.map((item) => ({
    ...item,
    month: monthNames[item.month - 1],  // Convert number to name (e.g. 1 → January)
  }));
  const sortedData = [...convertedData].sort(
    (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
  );
  setMonthlyData(sortedData);
  setLoading(false);
// }
// if(radioValueRef.current === "behind_the_meter") {
//   message.warning('Behind the meter data is not available yet. It is under development.');
//   console.log("Behind the meter data:", res?.payload?.hourly_data);
  
// }
  setEnergyReplaced(res?.payload.energy_replaced);
  setCapacitySolar(res?.payload.capacity_of_solar_rooftop);
  setTotalSavings(res?.payload.total_savings);
  setLoading(false);
}
 else if (addPWatt.rejected.match(res)) {
      // ❌ failed — show error message
      message.error(res.payload); // e.g. "no master data found for this state."
      setLoading(false);
      console.error("❌ Rejected:", res.payload);
    }
  };
// console.log('selected requirement', selectedRequirement);
// console.log('hourly data',hourlyData);

const onModalClick = () => {
// console.log("Modal OK clicked");
// console.log("Selected requirement:", incompleteRequirement);
setEditModal(true);
  // setWarningModal(false);
}
// console.log('incompleteRequirement', incompleteRequirement);
// console.log('selected requirement', selectedRequirement);
const handleCancel = () => {
  setEditModal(false);
  setWarningModal(false);
  setIncompleteRequirement(null);
  setSelectedRequirement(null);
  setSelectedRequirementId(null); // Clear dropdown value
};
const handleCancelWarning = () => {
  setWarningModal(false);
  setIncompleteRequirement(null);
  setSelectedRequirement(null);
  setSelectedRequirementId(null); // Clear dropdown value
  setSelectKey(Date.now());
};

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

const handleDownload = () => {
  if (!hourlyData || !Array.isArray(hourlyData)) {
    console.error("No data found or data is not an array");
    return;
  }

  // Transform keys to desired header names
  const formattedData = hourlyData.map(item => ({
    "Hours": item.hour,
    "Solar Generation (kWh)": item.generation,
    "Power Consumption": item.consumption,
    "Used Solar": item.used_solar,
    "Savings (INR)": item.savings,
    "Curtailment (kWh)": item.curtailment,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hourly Data");

  XLSX.writeFile(workbook, "hourly_data.xlsx");
};

  // Sort monthlyData by correct calendar order
  const sortedMonthlyData = [...monthlyData].sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
  const middleIndex = Math.ceil(sortedMonthlyData.length / 2);
  const firstHalf = sortedMonthlyData.slice(0, middleIndex);
  const secondHalf = sortedMonthlyData.slice(middleIndex);

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      align: "center",
    },
    {
      title: "Generation (kWh)",
      dataIndex: "generation",
      key: "generation",
      align: "center",
    },
    {
      title: "Savings (INR)",
      dataIndex: "savings",
      key: "savings",
      align: "center",
      render: (value) => `${value.toFixed(2)}`,
    },
  ];

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <h2 style={{ alignSelf: "flex-start" }}>Onsite RE options</h2>

      <Card
        style={{
          width: "100%",
          // maxWidth: 800,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {/* Dropdown */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p
              style={{
                margin: "0 0 8px 0",
                fontWeight: "500",
              }}
            >
              Select Consumption Unit
            </p>
            <Select
              key={selectKey} // 💥 This will force the dropdown to reset visually
              style={{ width: "100%" }}
  value={selectedRequirementId || undefined} // Control only by ID
              onChange={handleRequirementChange}
              options={
                Array.isArray(requirements)
                  ? requirements.map((req) => ({
                      label: (
                        <span>
                          {req.state && (
                            <>
                              <strong>State:</strong> {req.state},{" "}
                            </>
                          )}

                          {req.roof_area && (
                            <>
                              <strong>Roof Area:</strong> {req.roof_area} sq m,{" "}
                            </>
                          )}

                          {req.solar_rooftop_capacity && (
                            <>
                              <strong>Solar Rooftop Capacity:</strong>{" "}
                              {req.solar_rooftop_capacity} kWp,{" "}
                            </>
                          )}

                         
  {req.annual_electricity_consumption && (
                            <>
                              <strong>Annual Consumption:</strong>{" "}
                              {req.annual_electricity_consumption} MWh,{" "}
                            </>
                          )}
  {req.contracted_demand && (
                            <>
                              <strong>Contracted Demand:</strong>{" "}
                              {req.contracted_demand} MW,{" "}
                            </>
                          )}

                           {req.location && (
                            <>
                              <strong>Location:</strong> {req.location},{" "}
                            </>
                          )}
                          {req.voltage_level && (
                            <>
                              <strong>Voltage:</strong> {req.voltage_level} kV,{" "}
                            </>
                          )}

                        

                          {req.procurement_date && (
                            <>
                              <strong>Procurement Date:</strong>{" "}
                              {req.procurement_date}
                            </>
                          )}
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
                margin: "0 0 8px 0",
                fontWeight: "500",
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
                style={{ width: "100%" }}
              >
                <Radio value="grid_connected">Grid connected</Radio>
                <Radio value="behind_the_meter">Behind the meter</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </div>
      </Card>
      <Card
        style={{
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
    {/* <Card style={{ marginTop: 24 }}>

<Row gutter={16} style={{ marginTop: 24 }}>
  <Col span={8}>
    <Card
      bordered={false}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        textAlign: 'center',
      }}
    >
      <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Energy Replaced</p>
      <p>{energyReplaced}</p>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      bordered={false}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        textAlign: 'center',
      }}
    >
      <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Capacity of Solar Rooftop</p>
      <p>{capacitySolar}</p>
    </Card>
  </Col>

  <Col span={8}>
    <Card
      bordered={false}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        textAlign: 'center',
      }}
    >
      <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Total Saving</p>
      <p>{totalSavings}</p>
    </Card>
  </Col>
</Row>

</Card> */}


  <Card style={{ marginTop: 24 }}>
    <Row gutter={16}>
      {energyReplaced && (
        <Col span={8}>
          <p style={{ fontWeight: 'bold' }}>
            Energy Replaced (MWh): {energyReplaced}
          </p>
        </Col>
      )}

      {capacitySolar && (
        <Col span={8}>
          <p style={{ fontWeight: 'bold' }}>
            Capacity of Solar Rooftop (kWp): {capacitySolar}
          </p>
        </Col>
      )}

      {totalSavings && (
        <Col span={8}>
          <p style={{ fontWeight: 'bold' }}>
            Total Saving (INR): {totalSavings}
          </p>
        </Col>
      )}
    </Row>
  </Card>



        <p style={{ textAlign: "center", fontWeight: "bold" }}>Monthly Data</p>

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
{radioValueRef.current === 'behind_the_meter' && Array.isArray(hourlyData) && hourlyData.length > 0 && (
  <Row style={{ marginTop: "20px" }}>
    <Col span={24}>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" onClick={handleDownload}>
          Download Hourly Data
        </Button>
      </div>
    </Col>
  </Row>
)}

        <Modal
          title="Warning"
          open={warningModal}
          onCancel={handleCancelWarning}
          footer={[
            <Button key="ok" onClick={onModalClick}>
              OK
            </Button>,
          ]}
        >
          <p>
            Please ensure that the selected requirement has valid roof area,
            solar rooftop capacity, and location before proceeding.
          </p>  
        </Modal>
            <RequirementForm
          open={editModal}
          onCancel={handleCancel}
          // onSubmit={handleSubmit}
          handleCancelModal={handleCancel}
          data={incompleteRequirement}
          fromRooftop={true}
           isEdit={true}
        />
      </Card>
    </main>
  );
};

export default Rooftop;
