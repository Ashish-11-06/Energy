import React, { useEffect, useState } from 'react';
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
import { getDashboardData } from '../../Redux/Admin/slices/dashboardSlice';
import { useDispatch } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Option } = Select;

// Doughnut Chart Component with label
const DoughnutChart = ({ label, dataValues = [Math.floor(Math.random() * 100), 100], backgroundColors = ['#669800', '#e8e8e8'], legendLabels }) => {
  const data = {
    labels: legendLabels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: '50%',
  };

  return (
    <div style={{ width: 90, textAlign: 'center' }}>
      <Doughnut data={data} options={options} />
      <div style={{ fontSize: 12, marginTop: 4 }}>{label}</div>
    </div>
  );
};


// Main Dashboard Component
const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem('userrr'));
  const [selectedYear, setSelectedYear] = React.useState('2024');
  const [dashboardData,setDashboardData] = useState(null);
  const dispatch=useDispatch();
  useEffect(() => {
    const getData=async () => {
      const response = await dispatch(getDashboardData());
      // console.log('response dashboard',response);
      if(response?.payload) {
        setDashboardData(response?.payload);
      }
    }
    getData();
  },[dispatch])
 
// console.log('dashboard data',dashboardData);

  const barDataByYear = {
    '2022': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Consumers',
          data: [10, 15, 12, 20, 17, 22, 19, 25, 21, 24, 20, 18],
          backgroundColor: '#1890ff',
        },
        {
          label: 'Generators',
          data: [4, 5, 6, 8, 7, 10, 6, 9, 8, 7, 6, 9],
          backgroundColor: '#f0ad4e',
        },
      ],
    },
    '2023': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Consumers',
          data: [14, 18, 20, 25, 22, 26, 23, 27, 25, 29, 26, 30],
          backgroundColor: '#1890ff',
        },
        {
          label: 'Generators',
          data: [6, 7, 9, 10, 8, 11, 9, 10, 12, 10, 9, 11],
          backgroundColor: '#f0ad4e',
        },
      ],
    },
    '2024': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    },
  };

  const barData = barDataByYear[selectedYear];

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Month',
        color: '#333',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number',
        color: '#333',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  },
  maintainAspectRatio: false,
};


  // Uncomment below to enable access control
  // if (!validateUserAccess()) {
  //   return <div style={{ padding: '2rem', textAlign: 'center' }}>🔒 Access Denied</div>;
  // }

  return (
    <div style={{ height: '88vh', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
      {/* Top Row - Doughnut Charts */}
      <Card style={{ flex: '0 0 40%' }}>
        <Row gutter={8} style={{ height: '100%' }}>
          <Col span={12}>
            <Card
              title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Demand</div>}
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
               <DoughnutChart
  label="HT Commercial"
  dataValues={[dashboardData?.HT_Commercial ?? 0, (dashboardData?.total_demand ?? 100) - (dashboardData?.HT_Commercial ?? 0)]}
/>
<DoughnutChart
  label="HT Industrial"
  dataValues={[dashboardData?.HT_Industrial ?? 0, (dashboardData?.total_demand ?? 100) - (dashboardData?.HT_Industrial ?? 0)]}
/>
<DoughnutChart
  label="LT Commercial"
  dataValues={[dashboardData?.LT_Commercial ?? 0, (dashboardData?.total_demand ?? 100) - (dashboardData?.LT_Commercial ?? 0)]}
/>
<DoughnutChart
  label="LT Industrial"
  dataValues={[dashboardData?.LT_Industrial ?? 0, (dashboardData?.total_demand ?? 100) - (dashboardData?.LT_Industrial ?? 0)]}
/>

              </div>
            </Card>
          </Col>

          <Col span={9}>
            <Card
              title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Projects</div>}
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
              <DoughnutChart
  label="Solar"
  dataValues={[dashboardData?.solar_projects ?? 0, (dashboardData?.total_projects ?? 5) - (dashboardData?.solar_projects ?? 0)]}
/>
<DoughnutChart
  label="Wind"
  dataValues={[dashboardData?.wind_projects ?? 0, (dashboardData?.total_projects ?? 5) - (dashboardData?.wind_projects ?? 0)]}
/>
<DoughnutChart
  label="ESS"
  dataValues={[dashboardData?.ess_projects ?? 0, (dashboardData?.total_projects ?? 5) - (dashboardData?.ess_projects ?? 0)]}
/>

              </div>
            </Card>
          </Col>

<Col span={3}>
  <Card
    title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Offers</div>}
    style={{ height: '100%' }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
    <DoughnutChart
  label="Offers"
  dataValues={[
    dashboardData?.offers_accepted ?? 0,
    dashboardData?.offers_rejected ?? 0,
    dashboardData?.offers_pending ?? 0
  ]}
  backgroundColors={['#52c41a', '#ff4d4f', '#faad14']}
  legendLabels={['Accepted', 'Rejected', 'Pending']}
/>

      <div style={{ marginTop: 8, fontSize: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, backgroundColor: '#52c41a' }}></div>
            <span>Accepted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, backgroundColor: '#ff4d4f' }}></div>
            <span>Rejected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, backgroundColor: '#faad14' }}></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
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

 <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
  <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', marginRight: 6 }}></div>
  Total Consumer: {dashboardData?.total_consumers ?? 100}
</span>

<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
  <div style={{ width: 12, height: 12, backgroundColor: '#f0ad4e', marginRight: 6 }}></div>
  Total Generator: {dashboardData?.total_generators ?? 200}
</span>


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
