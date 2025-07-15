import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Modal, Select } from "antd";
import { Popover } from "antd";
import { DatabaseOutlined, ProfileOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import DashboardApi from "../../Redux/api/dashboard";
import offerSend from "../../assets/offerSend.png";
import state from "../../assets/state.png";
import totalIPP from "../../assets/totalIPP.png";
import availableCapacity from "../../assets/capacity.png";
import demands from "../../assets/capacityAvailable.png";
import consumption from "../../assets/consumption.png";
import SubscriptionDueModal from "../../Components/Modals/SubscriptionDueModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { fetchRequirements } from "../../Redux/Slices/Consumer/consumerRequirementSlice";
import { decryptData } from "../../Utils/cryptoHelper";


const Dashboard = () => {
  const [consumerDetails, setConsumerDetails] = useState({});
  const [platformDetails, setPlatformDetails] = useState({});
  const [stateModal, showStateModal] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user")).user;
  const [subscriptionDueModal,showSubscriptionDueModal]=useState(false);
  const [windCapacity, setWindCapacity] = useState(0);
  const [solarCapacity, setSolarCapacity] = useState(0);
  const [essCapacity, setESSCapacity] = useState(0);
  const [annualModal, setAnnualModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null); // State for selected requirement
    const requirements = useSelector((state) => state.consumerRequirement.requirements || []);
  const dispatch = useDispatch();
const userData = decryptData(localStorage.getItem('user'));
// console.log('user from dashboard', userData);
const user = userData?.user;
  const userId = user?.id;
  // console.log("userId", userId);
  
  const [states, setStates] = useState([]);
  const navigate=useNavigate();
    const subscription=decryptData(localStorage.getItem("subscriptionPlanValidity"));
  
  // const subscription = JSON.parse(
  //   localStorage.getItem("subscriptionPlanValidity")
  // );
  const alreadySubscribed = subscription?.subscription_type;
// console.log(subscription);

const time_remaining = alreadySubscribed ? (() => {
    const endDate = new Date(subscription?.end_date);
    const now = new Date();

    // Normalize both dates to midnight (00:00:00) for an accurate comparison
    endDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffMs = endDate - now; // Difference in milliseconds

    if (diffMs < 0) return "Expired"; // Only consider past dates as expired
    if (diffMs >= 0 && diffMs < 86400000) return "Expiring"; // Less than 1 day in milliseconds
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { days, hours, formatted: `${days} days, ${hours} hours` };
})() : { days: null, hours: null, formatted: ' ' };



  useEffect(() => {
     
    if (time_remaining === "Expired" || time_remaining === "Expiring") {
      showSubscriptionDueModal(true);
    }
  }, [time_remaining])

  const handleAnnualSavings = () => {
    setAnnualModal(true);
  }

const handleRequirementChange = (value) => {
  const selected = requirements.find((req) => req.id === value);
  setSelectedRequirement(selected);
  localStorage.setItem('selectedRequirementId', JSON.stringify(selected.id));
  dispatch(fetchMatchingIPPById(selected.id));
};

useEffect(() => {
  if (requirements.length === 0) {
    dispatch(fetchRequirements(userId));
  } else {
    // only run restore logic once requirements are loaded
    const storedId = decryptData(localStorage.getItem('selectedRequirementId'));
    if (storedId) {
      const found = requirements.find((r) => r.id === storedId);
      if (found) {
        setSelectedRequirement(found);
        dispatch(fetchMatchingIPPById(found.id));
      }
    }
    // *** no fallback to requirements[0] here ***
  }
}, [requirements]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardApi.getConsumerDashboardData(userId);
        const data = response.data;
        // console.log(data);
        setWindCapacity(data?.wind_capacity || 0);
        setSolarCapacity(data?.solar_capacity || 0);
        setESSCapacity(data?.ess_capacity || 0);
        setStates(data?.states);
        setConsumerDetails({
          // energyPurchased: data.energy_purchased_from || 0,
          demandSent: data.total_demands || 0,
          offerReceived: data.offers_received || 0,
          transactionsDone: data.transactions_done || 0,
          offersSent: data.offers_sent || 0,

          totalDemands: data.total_demands || 0,
          totalConsumptionUnits: data.consumption_units || 0,
          subscriptionPlan: data.subscription_plan || "N/A",
          totalStates: data.unique_states_count || 0,
        });
        setPlatformDetails({
          totalIPPs: data.total_portfolios || 0,
          totalCapacity: data.total_available_capacity || 0,
          statesCovered: data.states_covered || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const handleStateClose = () => {
    showStateModal(false);
  };
  const handleNavigateSubscription=() => {
    navigate('/subscription-plan');
  }
  const barData = {
    labels: ["Demand", "Offer Received", "Transactions Closed"],
    datasets: [
      {
        label: "Consumer Details (in MW)",
        data: [
          consumerDetails.demandSent,
          consumerDetails.offerReceived,
          consumerDetails.transactionsDone,
          //  consumerDetails.offersSent,
        ],
        backgroundColor: ["#669800", "#669800", "#669800", "#669800"],
      },
    ],
  };

  return (
    <div style={{ padding: "30px" }}>
      <Row gutter={[16, 16]} style={{ height: "400px" }}>
        {/* Consumer Details */}
        <Col span={12}>
          <Card
            title="Transaction Details"
            style={{ backgroundColor: "white", height: "100%" }}
          >
            <div style={{ height: "100%" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col span={12}>
          <Card
            title="Profile Details"
            bordered={false}
            style={{ backgroundColor: "white", height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    title="Total Demand"
                    value={consumerDetails.totalDemands}
                    prefix={
                      <img
                        src={demands}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                    suffix={
                      <span style={{ fontSize: "20px", marginLeft: "5px" }}>
                        MW
                      </span>
                    }
                  />
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    title="Total Consumption Units"
                    value={consumerDetails.totalConsumptionUnits}
                    prefix={
                      <img
                        src={consumption}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                    suffix={
                      <span
                        style={{ fontSize: "20px", marginLeft: "5px" }}
                      ></span>
                    }
                  />
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    title="Total Offer Sent"
                    value={consumerDetails.offersSent}
                    prefix={
                      <img
                        src={offerSend}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                </Card.Grid>
              </Col>

              {/* <Col span={8}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Subscription Plan" value={consumerDetails.subscriptionPlan} prefix={<CrownOutlined />} valueStyle={{ color: "#3f8600" }} />
                </Card.Grid>
              </Col> */}
            </Row>
          </Card>
        </Col>

        {/* Platform Details */}
        <Col span={12}>
          <Card
            title="Platform Details"
            bordered={false}
            style={{ backgroundColor: "white", height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    title="Total projects"
                    value={platformDetails.totalIPPs}
                    prefix={
                      <img
                        src={totalIPP}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Statistic
                    title="Total Capacity Available"
                    value={platformDetails.totalCapacity}
                    prefix={
                      <img
                        src={availableCapacity}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    suffix={
                      <span style={{ fontSize: "16px", marginLeft: "5px" }}>
                        MW
                      </span>
                    }
                    valueRender={(value) => (
                      <Popover
                        content={
                          <div style={{ padding: "10px", maxWidth: "200px" }}>
                            <strong>Capacity Details:</strong>
                            <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                              <li>Wind Capacity: {windCapacity} MW</li>
                              <li>Solar Capacity: {solarCapacity} MW</li>
                              <li>ESS Capacity: {essCapacity} MWh</li>
                            </ul>
                          </div>
                        }
                        trigger="hover"
                        placement="right"
                      >
                        <span style={{ cursor: "pointer" }}>{value}</span>
                      </Popover>
                    )}
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "17px",
                    }}
                  />
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  // hoverable
                  // onMouseEnter={() => showStateModal(true)} // Open modal when hovering
                  // onMouseLeave={() => handleStateClose()} // Close modal when hovering out
                >
                  {/* <Statistic
                    title="Number of States Covered"
                    value={platformDetails?.statesCovered || 0} // Default to 0 if undefined
                    prefix={
                      <img
                        src={state} // Ensure `state` is a valid image URL
                        alt="State Icon"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                  /> */}

                  <Statistic
                    title="Number of States Covered"
                    value={platformDetails?.statesCovered || 0} // Default to 0 if undefined
                    prefix={
                      <img
                        src={state} // Ensure `state` is a valid image URL
                        alt="State Icon"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueRender={(value) => (
                      <Popover
                        content={
                          <div style={{ padding: "10px", maxWidth: "200px" }}>
                            <strong>States Covered:</strong>
                            <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                              {states?.length > 0 ? (
                                states.map((state, index) => <li key={index}>{state}</li>)
                              ) : (
                                <li>No states available</li>
                              )}
                            </ul>
                          </div>
                        }
                        trigger="hover" // Show popover on hover
                        placement="right" // Adjust position if needed
                      >
                        <span style={{ cursor: "pointer" }}>{value}</span>
                      </Popover>
                    )}
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />

                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Annual Savings Details"
            bordered={false}
            style={{ backgroundColor: "white", height: "100%",cursor: "pointer" }}
            onClick={handleAnnualSavings}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>Potential Savings</p>
                  
                  
                  
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  
                 <p>Average Savings</p>
                </Card.Grid>
              </Col>

              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "135px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  // hoverable
                  // onMouseEnter={() => showStateModal(true)} // Open modal when hovering
                  // onMouseLeave={() => handleStateClose()} // Close modal when hovering out
                >
                  {/* <Statistic
                    title="Number of States Covered"
                    value={platformDetails?.statesCovered || 0} // Default to 0 if undefined
                    prefix={
                      <img
                        src={state} // Ensure `state` is a valid image URL
                        alt="State Icon"
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{
                      color: "#3f8600",
                      display: "flex",
                      alignItems: "center",
                    }}
                  /> */}

                 <p>Potential RE Replacement</p>

                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        open={annualModal}
        title="Annual Savings Details"
        onCancel={() => setAnnualModal(false)} // Close the modal when Cancel is clicked
        // footer={null} // This removes the default OK/Cancel buttons
        onOk={() => navigate('/consumer/annual-saving')} // Close the modal when OK is clicked
        width={800} // Adjust the width as needed
        // Adjust the top position as needed
      >
           <Row
          style={{
            width: "100%",
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap", // Allow wrapping for smaller screens
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Col span={24}>
            <p style={{ margin: 0, whiteSpace: "nowrap" }}>Select Requirement</p>

          </Col>
          <Col span={24}>
<Select
  style={{ width: '100%' }}
  value={selectedRequirement?.id}
  onChange={handleRequirementChange}
  placeholder="Select a requirement"
  options={
    Array.isArray(requirements)
      ? requirements.map((req) => ({
          label: (
            <span>
              <strong>State:</strong> {req.state},{' '}
              <strong>Consumption unit:</strong> {req.consumption_unit},{' '}
              <strong>Industry:</strong> {req.industry},{' '}
              <strong>Contracted demand:</strong> {req.contracted_demand} kW,{' '}
              <strong>Tariff Category:</strong> {req.tariff_category},{' '}
              <strong>Voltage:</strong> {req.voltage_level} kV,{' '}
              <strong>Annual Consumption:</strong> {req.annual_electricity_consumption} MWh,{' '}
              <strong>Procurement Date:</strong> {req.procurement_date}
            </span>
          ),
          value: req.id,
        }))
      : []
  }
/>
          </Col>
        </Row>
        </Modal>
      <Modal
        open={stateModal}
        title="States Covered"
        onCancel={() => showStateModal(false)} // Close the modal when Cancel is clicked
        footer={null} // This removes the default OK/Cancel buttons
      >
        <ul>
          {states?.map((state, index) => (
            <li key={index}>{state}</li>
          ))}
        </ul>
      </Modal>
      <SubscriptionDueModal time_remaining={time_remaining} open={subscriptionDueModal} onCancel={() => showSubscriptionDueModal(false)} onConfirm={() => showSubscriptionDueModal(false)} onOk={handleNavigateSubscription} />

    </div>
    
  );
};

export default Dashboard;

