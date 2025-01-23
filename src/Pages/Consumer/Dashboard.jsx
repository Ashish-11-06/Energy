import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DatabaseOutlined, ProfileOutlined, ThunderboltOutlined, CrownOutlined } from "@ant-design/icons";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const consumerDetails = {
    energyPurchased: 15000,
    demandSent: 20000,
    offerReceived: 18000,
    transactionsDone: 100,
    totalDemands: 500,
    totalConsumptionUnits: 12000,
    subscriptionPlan: "Premium",
    totalStates: 10,
  };

  const platformDetails = {
    totalIPPs: 50,
    totalCapacity: 100000,
    statesCovered: 15,
  };

  const barData = {
    labels: ['Energy Purchased', 'Demand Sent', 'Offer Received', 'Transactions Done'],
    datasets: [
      {
        label: 'Consumer Details',
        data: [
          consumerDetails.energyPurchased,
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
              <Col span={8}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Total Demands" value={consumerDetails.totalDemands} prefix={<ProfileOutlined />} valueStyle={{ color: "#3f8600" }} />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Total Consumption Units" value={consumerDetails.totalConsumptionUnits} prefix={<ThunderboltOutlined />} valueStyle={{ color: "#cf1322" }} />
                </Card.Grid>
              </Col>
              <Col span={8}>
                <Card.Grid style={{ width: "100%", textAlign: "center", height: '135px' }}>
                  <Statistic title="Subscription Plan" value={consumerDetails.subscriptionPlan} prefix={<CrownOutlined />} valueStyle={{ color: "#3f8600" }} />
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
