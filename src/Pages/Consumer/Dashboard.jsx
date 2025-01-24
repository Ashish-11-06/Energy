import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DatabaseOutlined, ProfileOutlined, ThunderboltOutlined, CrownOutlined } from "@ant-design/icons";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DashboardApi from "../../Redux/api/dashboard";

const Dashboard = () => {
  const [consumerDetails, setConsumerDetails] = useState({});
  const [platformDetails, setPlatformDetails] = useState({});

  const user = JSON.parse(localStorage.getItem("user")).user;
  const userId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardApi.getConsumerDashboardData(userId);
        const data = response.data;
        setConsumerDetails({
          // energyPurchased: data.energy_purchased_from || 0,
          demandSent: data.total_demands || 0,
          offerReceived: data.offers_received || 0,
          transactionsDone: data.transactions_done || 0,
          totalDemands: data.total_demands || 0,
          totalConsumptionUnits: data.total_consumption_units || 0,
          subscriptionPlan: data.subscription_plan || "N/A",
          totalStates: data.unique_states_count || 0,
        });
        setPlatformDetails({
          totalIPPs: data.total_portfolios || 0,
          totalCapacity: data.total_available_capacity || 0,
          statesCovered: data.unique_states_count || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: [ 'Demand Sent', 'Offer Received', 'Transactions Done'],
    datasets: [
      {
        label: 'Consumer Details',
        data: [
          consumerDetails.demandSent,
          consumerDetails.offerReceived,
          consumerDetails.transactionsDone,
        ],
        backgroundColor: ['#3f8600', '#3f8600', '#cf1322', '#3f8600'],
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
          style={{ backgroundColor: "white", height: "100%" }}>
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
              <Col span={12}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Total Demands" value={consumerDetails.totalDemands} prefix={<ProfileOutlined />} valueStyle={{ color: "#3f8600" }} />
                </Card.Grid>
              </Col>
              <Col span={12}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Total Consumption Units" value={consumerDetails.totalConsumptionUnits} prefix={<ThunderboltOutlined />} valueStyle={{ color: "#cf1322" }} />
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
                <Card.Grid style={{ width: "100%", height: "100%", textAlign: "center" }}>
                  <Statistic title="Total IPPs" value={platformDetails.totalIPPs} prefix={<UserOutlined />} valueStyle={{ color: "#3f8600" }} />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid style={{ width: "100%", height: "100%", textAlign: "center" }}>
                  <Statistic title="Total Capacity Available" value={platformDetails.totalCapacity} prefix={<DatabaseOutlined />} valueStyle={{ color: "#cf1322" }} />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid style={{ width: "100%", height: "100%", textAlign: "center"}}>
                  <Statistic title="Number of States Covered" value={platformDetails.statesCovered} valueStyle={{ color: "#3f8600" }} />
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
