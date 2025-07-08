import React from 'react';
import CryptoJS from 'crypto-js';
import { Card, Col, Row, Select } from 'antd';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Option } = Select;

// Doughnut Chart Component
const DoughnutChart = () => {
  const data = {
    datasets: [
      {
        data: [Math.floor(Math.random() * 100), 100],
        backgroundColor: ['#669800', '#e8e8e8'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '50%', // make it thinner
  };

  return (
    <div style={{ width: 60, height: 60, margin: '0 4px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Main Dashboard
const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem('userrr'));
  const [selectedYear, setSelectedYear] = React.useState('2024');

  const validateUserAccess = () => {
    if (!userData || !userData.encryptedKey) return false;
    const secretPassphrase = 'samya';
    try {
      const bytes = CryptoJS.AES.decrypt(userData.encryptedKey, secretPassphrase);
      const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedKey === 'samya';
    } catch {
      return false;
    }
  };

  const barData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Consumers',
        data: [12, 19, 13, 15, 22, 30, 18, 25, 20, 23, 21, 27],
        backgroundColor: '#1890ff',
      },
      {
        label: 'Generators',
        data: [5, 8, 6, 10, 9, 12, 7, 11, 9, 8, 10, 12],
        backgroundColor: '#f0ad4e',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
    maintainAspectRatio: false,
  };

  if (!validateUserAccess()) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>🔒 Access Denied</div>;
  }

  return (
    <div style={{ height: '88vh', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
      {/* Top Row - Doughnut Charts */}
      <Card style={{ flex: '0 0 40%' }}>
        <Row gutter={8} style={{ height: '100%' }}>
          <Col span={12}>
            <Card 
  title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Demand</div>}    
            style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                <DoughnutChart />
                <DoughnutChart />
                <DoughnutChart />
                <DoughnutChart />
              </div>
            </Card>
          </Col>

          <Col span={9}>
            <Card 
             title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Projects</div>}
            style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                <DoughnutChart />
                <DoughnutChart />
                <DoughnutChart />
              </div>
            </Card>
          </Col>

          <Col span={3}>
            <Card 
  title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Offers</div>}
             style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <DoughnutChart />
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Bottom Row - Bar Chart */}
      <Card style={{ flex: '1 1 30%', overflow: 'hidden' }}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Monthly User Distribution</span>
              <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
                <Option value="2022">2022</Option>
                <Option value="2023">2023</Option>
                <Option value="2024">2024</Option>
              </Select>
            </div>
          }
          style={{ height: '100%' }}
        >
          <div style={{ height: '100%' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default Dashboard;
