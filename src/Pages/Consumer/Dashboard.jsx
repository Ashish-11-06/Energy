import React from 'react';
import { Row, Col, Card } from 'antd';
import { Line, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for the energy consumer
const profileData = {
  name: 'John Doe',
  role: 'Energy Consumer',
  email: 'johndoe@example.com',
  avatar: 'https://i.pravatar.cc/150?img=4',
};

const totalDemands = 1200;
const completedDemands = 800;
const totalEnergyConsumed = 3500; // in kWh

// Data for the energy consumption chart
const consumptionData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Energy Consumption (kWh)',
      data: [400, 800, 600, 700],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// Data for the demand status bar chart
const demandData = {
  labels: ['Completed', 'Pending'],
  datasets: [
    {
      label: 'Demand Status',
      data: [completedDemands, totalDemands - completedDemands],
      backgroundColor: ['#4caf50', '#f44336'],
      borderColor: ['#388e3c', '#d32f2f'],
      borderWidth: 1,
    },
  ],
};

// Styled component to remove row padding
const NoPaddingRow = styled(Row)`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const ProfileCard = () => (
  <Card
    title="Profile"
    style={{
      margin: '10px auto',
      textAlign: 'center',
      padding: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }}
    headStyle={{
      fontSize: '16px',
      padding: '5px',
    }}
    bodyStyle={{
      padding: '10px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <img
        alt="profile"
        src={profileData.avatar}
        style={{
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          marginRight: '20px',
          marginBottom: '10px',
        }}
      />
      <div style={{ textAlign: 'left', flex: 1 }}>
        <h3 style={{ margin: 0 }}>{profileData.name}</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>{profileData.role}</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>{profileData.email}</p>
      </div>
    </div>
  </Card>
);

const EnergyConsumption = () => (
  <Card
    title="Energy Consumption Overview"
    style={{ margin: '10px' }}
    bodyStyle={{ padding: '10px' }}
  >
    <div style={{ height: '200px' }}>
      <Line
        data={consumptionData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Energy Consumption Trend' },
          },
        }}
      />
    </div>
  </Card>
);

const DemandStatus = () => (
  <Card
    title="Demand Completion Status"
    style={{ margin: '10px' }}
    bodyStyle={{ padding: '10px' }}
  >
    <div style={{ height: '200px' }}>
      <Bar
        data={demandData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Demand Completion Status' },
          },
        }}
      />
    </div>
  </Card>
);

const Dashboard = () => (
  <div>
    {/* First Row for Profile */}
    <NoPaddingRow justify="center" gutter={[16, 16]}>
      <Col xs={24} sm={24} md={12} lg={12}>
        <ProfileCard />
      </Col>
    </NoPaddingRow>

    {/* Second Row for Charts */}
    <Row justify="center" gutter={[16, 16]} style={{ marginTop: '20px' }}>
      <Col xs={24} sm={24} md={12} lg={8}>
        <DemandStatus />
      </Col>
      <Col xs={24} sm={24} md={12} lg={8}>
        <EnergyConsumption />
      </Col>
    </Row>
  </div>
);

export default Dashboard;
