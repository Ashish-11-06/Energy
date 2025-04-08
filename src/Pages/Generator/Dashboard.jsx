import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { Row, Col, Card, Statistic, Modal } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  DatabaseOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  SendOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import DashboardApi from "../../Redux/api/dashboard";
import totalIPP from "../../assets/totalIPP.png";
import demands from "../../assets/capacityAvailable.png";
import state from "../../assets/state.png";
import solar from "../../assets/solar.avif";
import battery from "../../assets/battery.webp";
import wind from "../../assets/wind.jpg";
import { loginUser } from "../../Redux/Slices/loginSlice";
import SubscriptionDueModal from "../../Components/Modals/SubscriptionDueModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [generatorDetails, setGeneratorDetails] = useState({});
  const [profileDetails, setProfileDetails] = useState({});
  const [platformDetails, setPlatformDetails] = useState({});
  const [stateModal, showStateModal] = useState(false);
  const [subscriptionDueModal,showSubscriptionDueModal]=useState(false);
  const [states, setStates] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")).user;
  const userId = user.id;

  const navigate = useNavigate();
  const subscription = JSON.parse(
    localStorage.getItem("subscriptionPlanValidity")
  );
  const alreadySubscribed = subscription?.subscription_type;

  const time_remaining = alreadySubscribed ? (() => {
    const endDate = new Date(subscription?.end_date);
    const now = new Date();

    // Normalize both dates to midnight (00:00:00) for an accurate comparison
    endDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffMs = endDate - now; // Difference in milliseconds
    // console.log(diffMs);

    if (diffMs < 0) return "Expired"; // Only consider past dates as expired
    if (diffMs >= 0 && diffMs < 86400000) return "Expiring"; // Less than 1 day in milliseconds
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { days, hours, formatted: `${days} days, ${hours} hours` };
})() : { days: null, hours: null, formatted: ' ' };

// console.log(time_remaining.days);
// console.log(time_remaining);

 

  // console.log(time_remaining);
  
  // useEffect(() => {
  //   showSubscriptionDueModal(true);
  // })
  useEffect (() => {
    if(time_remaining=== 'Expired' || time_remaining=== 'Expiring' ){
      // console.log('expired');    
      showSubscriptionDueModal(true);
  }
},[time_remaining]
)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardApi.getGeneratorDashboardData(userId);
        const data = response.data;
        setStates(data?.states);
        setGeneratorDetails({
          totalEnergySold: data.total_energy_sold || 0,
          totalSolarEnergyOffered: data.total_solar_energy_offered || 0,
          totalWindEnergyOffered: data.total_wind_energy_offered || 0,
          totalEssEnergyOffered: data.total_ess_energy_offered || 0,
          offerReceived: data.total_offer_received || 0,
          transactionsDone: data.transactions_done || 0,
        });
        setProfileDetails({
          solar: data.solar_portfolios || 0,
          wind: data.wind_portfolios || 0,
          ESS: data.ess_portfolios || 0,
        });
        setPlatformDetails({
          totalConsumers: data.total_consumers || 0,
          totalDemands: data.total_contracted_demand || 0,
          totalStates: data.unique_state_count || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

const handleNavigateSubscription=() => {
  navigate('/subscription-plan');
}

  const barData = {
    labels: [
      "Solar Energy Offered",
      "Wind Energy Offered",
      "ESS Energy Offered",
      "Offer Received",
      "Transactions Done",
    ],
    datasets: [
      {
        label: "Generator Details (in MW)",
        data: [
          generatorDetails.totalSolarEnergyOffered,
          generatorDetails.totalWindEnergyOffered,
          generatorDetails.totalEssEnergyOffered,
          generatorDetails.offerReceived,
          generatorDetails.transactionsDone,
        ],
        backgroundColor: [
          "#3f8600",
          "#3f8600",
          "#3f8600",
          "#cf1322",
          "#3f8600",
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "30px" }}>
      <Row gutter={[16, 16]} style={{ height: "400px" }}>
        {/* Generator Details */}
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
                  }}
                >
                  <Statistic
                    title="Solar Profiles"
                    value={profileDetails.solar}
                    prefix={<ProfileOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: "135px",
                  }}
                >
                  <Statistic
                    title="Wind Profiles"
                    value={profileDetails.wind}
                    prefix={
                      <img
                        src={wind}
                        alt=""
                        style={{
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: "135px",
                  }}
                >
                  <Statistic
                    title="ESS Profiles"
                    value={profileDetails.ESS}
                    prefix={
                      <img
                        src={battery}
                        alt=""
                        style={{
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      />
                    }
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
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
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                >
                  <Statistic
                    title="Total Consumers"
                    value={platformDetails.totalConsumers}
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
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                 
                >
                  <Statistic
                    title="Total Demand (MW)"
                    value={platformDetails.totalDemands}
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
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                >
                  {/* <Statistic
                    title="Total States"
                    value={platformDetails.totalStates}
                    prefix={
                      <img
                        src={state}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                        hoverable
                        onMouseEnter={() => showStateModal(true)}
                      />
                    }
                    valueStyle={{ color: "#3f8600" }}
                  /> */}
                   <Statistic
                    title="Total States"
                    value={platformDetails.totalStates}
                    // value={platformDetails?.statesCovered || 0}  // Default to 0 if undefined
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
                    }}/>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
        {/* Platform Details */}
        <Col span={12}>
          <Card
            title="Capacity Sizing"
            bordered={false}
            style={{ backgroundColor: "white", height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card.Grid
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                >
                  <Statistic
                    title="Solar Capacity"
                    value={platformDetails.totalConsumers}
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
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                 
                >
                  <Statistic
                    title="Wind Capacity"
                    value={platformDetails.totalDemands}
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
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid
                  style={{ width: "100%", height: "100%", textAlign: "center" }}
                >
                  {/* <Statistic
                    title="Total States"
                    value={platformDetails.totalStates}
                    prefix={
                      <img
                        src={state}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                        hoverable
                        onMouseEnter={() => showStateModal(true)}
                      />
                    }
                    valueStyle={{ color: "#3f8600" }}
                  /> */}
                   <Statistic
                    title="Ess Capacity"
                    value={platformDetails.totalStates}
                    // value={platformDetails?.statesCovered || 0}  // Default to 0 if undefined
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
                    }}/>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
<SubscriptionDueModal time_remaining={time_remaining} open={subscriptionDueModal} onCancel={() => showSubscriptionDueModal(false)} onConfirm={() => showSubscriptionDueModal(false)} onOk={handleNavigateSubscription} />



      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default Dashboard;
