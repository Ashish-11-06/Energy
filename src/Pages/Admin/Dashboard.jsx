import React, { useEffect, useState } from 'react';
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

// Demand Doughnut Chart Component
const DemandDoughnutChart = ({ demandData }) => {
  const data = {
    labels: ['HT Commercial', 'HT Industrial', 'LT Commercial', 'LT Industrial'],
    datasets: [{
      data: [
        demandData?.HT_Commercial ?? 0,
        demandData?.HT_Industrial ?? 0,
        demandData?.LT_Commercial ?? 0,
        demandData?.LT_Industrial ?? 0
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AC24A'],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Projects Doughnut Chart Component
const ProjectsDoughnutChart = ({ projectsData }) => {
  const data = {
    labels: ['Solar Projects', 'Wind Projects', 'ESS Projects'],
    datasets: [{
      data: [
        projectsData?.solar_projects ?? 0,
        projectsData?.wind_projects ?? 0,
        projectsData?.ess_projects ?? 0
      ],
      backgroundColor: ['#9966FF', '#FF9F40', '#8AC24A'],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Offers Doughnut Chart Component
const OffersDoughnutChart = ({ offersData }) => {
  const data = {
    labels: ['Accepted', 'Rejected', 'Pending'],
    datasets: [{
      data: [
        offersData?.offers_accepted ?? 0,
        offersData?.offers_rejected ?? 0,
        offersData?.offers_pending ?? 0
      ],
      backgroundColor: ['#52c41a', '#ff4d4f', '#faad14'],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedYear, setSelectedYear] = React.useState('2024');
  const [dashboardData, setDashboardData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const response = await dispatch(getDashboardData());
      if (response?.payload) {
        setDashboardData(response?.payload);
      }
    }
    getData();
  }, [dispatch]);

  // Bar chart data
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

  return (
    <div style={{ 
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Top Row - Charts */}
      <Row gutter={16} style={{ flex: '0 0 auto' }}>
        <Col span={8}>
          <Card title="Demand Overview" style={{ height: '100%' }}>
            <DemandDoughnutChart demandData={dashboardData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Projects Overview" style={{ height: '100%' }}>
            <ProjectsDoughnutChart projectsData={dashboardData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Offers Status" style={{ height: '100%' }}>
            <OffersDoughnutChart offersData={dashboardData} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Row - Bar Chart */}
      <Card style={{ flex: '1 1 auto' }}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Monthly User Distribution</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
            </div>
          }
          style={{ height: '100%' }}
        >
          <div style={{ height: 'calc(100% - 60px)' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default Dashboard;