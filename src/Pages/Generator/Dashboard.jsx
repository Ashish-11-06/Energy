import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const generatorDetails = {
    totalEnergySold: 25000,
    energyOffered: 30000,
    offerReceived: 28000,
    transactionsDone: 150,
  };

  const profileDetails = {
    solar: 500,
    wind: 300,
    ESS: 150,
  };

  const platformDetails = {
    totalConsumers: 2000,
    totalDemands: 800,
    totalStates: 15,
  };

  return (
    <div style={{ padding: "30px" }}>
      <Row gutter={[16, 16]}>
        {/* Generator Details */}
        <Col span={6}>
          <Card style={{ backgroundColor: "white" }}>
            <Statistic
              title="Total Energy Sold"
              value={generatorDetails.totalEnergySold}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "white" }}>
            <Statistic
              title="Energy Offered"
              value={generatorDetails.energyOffered}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "white" }}>
            <Statistic
              title="Offer Received"
              value={generatorDetails.offerReceived}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "white" }}>
            <Statistic
              title="Transactions Done"
              value={generatorDetails.transactionsDone}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {/* Combined Block for Profile and Platform Details */}
      {/* Profile Details Sub-Block */}
<Col span={12}>
  <Card
    title="Profile Details"
    bordered={false}
    style={{ backgroundColor: "white", height: "250px" }}
  >
    <Row gutter={[16, 16]}>
      {/* Solar Profile Column */}
      <Col span={8}>
        <Card.Grid style={{ width: "100%", textAlign: "center",height:'135px' }}>
          <Statistic title="Solar Profiles" value={profileDetails.solar} />
        </Card.Grid>
      </Col>
      {/* Wind Profile Column */}
      <Col span={8}>
        <Card.Grid style={{ width: "100%", textAlign: "center",height:'135px' }}>
          <Statistic title="Wind Profiles" value={profileDetails.wind} />
        </Card.Grid>
      </Col>
      {/* ESS Profile Column */}
      <Col span={8}>
      
        <Card.Grid style={{ width: "100%", textAlign: "center",height:'135px' }}>
          <Statistic title="ESS Profiles" value={profileDetails.ESS} />
        </Card.Grid>
      </Col>
    </Row>
  </Card>
</Col>

{/* Platform Details Sub-Block */}
<Col span={12}>
  <Card
    title="Platform Details"
    bordered={false}
    style={{ backgroundColor: "white", height: "250px" }}
  >
    <Row gutter={[16, 16]}>
      <Col span={8} style={{height:'250px'}}>
        <Card.Grid style={{ width: "100%", textAlign: "center" }}>
          <Statistic title="Total Consumers" value={platformDetails.totalConsumers} />
        </Card.Grid>
      </Col>
      {/* Wind Profile Column */}
      <Col span={8}>
        <Card.Grid style={{ width: "100%", textAlign: "center" }}>
          <Statistic title="Total Demands" value={platformDetails.totalDemands} />
        </Card.Grid>
      </Col>
      {/* ESS Profile Column */}
      <Col span={8}>
        <Card.Grid style={{ width: "100%", textAlign: "center",height:'135px' }}>
          <Statistic title="Total States" value={platformDetails.totalStates} />
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
