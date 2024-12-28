import React, { useState } from "react";
import { Row, Col, Card, Modal } from "antd";
import { Line, Bar } from "react-chartjs-2";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BulbOutlined,
  ToolOutlined,
  MailOutlined,
  SwapOutlined,
  AreaChartOutlined,
  FileTextOutlined,
  HomeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

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
  name: "John Doe",
  role: "Energy Consumer",
  email: "johndoe@example.com",
  avatar: "https://i.pravatar.cc/150?img=4",
  stats: {
    purchasedFrom: 12,
    offered: 25,
    offersReceived: 15,
    transactionsDone: 8,
    totalDemands: 20,
  },
};

// Subscription condition: Check if the user has a premium plan
const isSubscribed = true;

const totalDemands = 1200;
const completedDemands = 800;
const totalEnergyConsumed = 3500; // in kWh

// Data for the energy consumption chart
const consumptionData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Energy Consumption (kWh)",
      data: [400, 800, 600, 700],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

// Data for the demand status bar chart
const demandData = {
  labels: ["Completed", "Pending"],
  datasets: [
    {
      label: "Demand Status",
      data: [completedDemands, totalDemands - completedDemands],
      backgroundColor: ["#4caf50", "#f44336"],
      borderColor: ["#388e3c", "#d32f2f"],
      borderWidth: 1,
    },
  ],
};

// Stats data
const statsData = [
  {
    title: "Energy purchased from",
    value: profileData.stats.purchasedFrom,
    icon: <BulbOutlined />,
  },
  {
    title: "Demands sent",
    value: profileData.stats.offered,
    icon: <ToolOutlined />,
  },
  {
    title: "Offer received",
    value: profileData.stats.offersReceived,
    icon: <MailOutlined />,
  },
  {
    title: "Transactions done",
    value: profileData.stats.transactionsDone,
    icon: <SwapOutlined />,
  },
  {
    title: "Your total demands",
    value: profileData.stats.totalDemands,
    icon: <AreaChartOutlined />,
  },
  {
    title: "Subscription Plan",
    value: isSubscribed ? "Yes" : "No",
    icon: <FileTextOutlined />,
    subscriptionPlans: [
      "Basic Plan: 10 days",
      "Standard Plan: 20 days",
      "Premium Plan: 30 days",
    ],
  },
  {
    title: "Total IPPs",
    value: 42,
    icon: <HomeOutlined />,
    details: [
      {
        title: "Solar",
        value: 15,
      },
      {
        title: "Wind",
        value: 12,
      },
      {
        title: "ESS",
        value: 15,
      },
    ],
  },
  {
    title: "Total States",
    value: 6,
    icon: <GlobalOutlined />,
    details: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
    ],
  },
];

// Styled component to remove row padding
const NoPaddingRow = styled(Row)`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

// Profile card component
// Profile card component
const ProfileCard = () => (
  <div
    style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "10px",
      
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <img
        alt="profile"
        src={profileData.avatar}
        style={{
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          marginBottom: "10px",
        }}
      />
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: "10px 0", fontSize: "18px" }}>
          {profileData.name}
        </h2>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
          Role: {profileData.role}
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
          Email: {profileData.email}
        </p>
      </div>
    </div>
  </div>
);


// Stats component
const StatData = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState([]);

  const handleViewClick = (index, details) => {
    setModalDetails(details);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(200px, 1fr))",
        gap: "20px",
        padding: "20px",
       
      }}
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            position: "relative",
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              marginBottom: "10px",
            }}
          >
            {stat.icon}
          </div>
          <h3 style={{ margin: "0", fontSize: "24px" }}>{stat.value}</h3>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
            {stat.title}
          </p>
          {stat.details && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {stat.details.map((detail, idx) => (
                <div key={idx} style={{ textAlign: "center", width: "auto", padding:'20px' }}>
                  <h4>{detail.title}</h4>
                  <p>{detail.value}</p>
                </div>
              ))}
            </div>
          )}
          {stat.subscriptionPlans && (
            <button
              onClick={() => handleViewClick(index, stat.subscriptionPlans)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#007BFF",
                color: "white",
                cursor: "pointer",
              }}
            >
              View
            </button>
          )}
          {/* Move the 'View' button to the Total States block */}
          {stat.title === "Total States" && (
            <button
              onClick={() => handleViewClick(index, stat.details)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#007BFF",
                color: "white",
                cursor: "pointer",
              }}
            >
              View
            </button>
          )}
        </div>
      ))}
      <Modal
        title="Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <ul>
            {modalDetails.map((detail, i) => (
              <li key={i} style={{ marginBottom: "5px" }}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};


// Energy consumption chart
const EnergyConsumption = () => (
  <Card
    title={<div style={{ fontSize: "16px" }}>Energy Consumption Overview</div>}
    style={{ margin: "10px", padding: "10px" }}
  >
    <div style={{ height: "200px" }}>
      <Line
        data={consumptionData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: "Energy Consumption Trend" },
          },
        }}
      />
    </div>
  </Card>
);

// Demand status chart
const DemandStatus = () => (
  <Card
    title={<div style={{ fontSize: "16px" }}>Demand Status</div>}
    style={{ margin: "10px", padding: "10px" }}
  >
    <div style={{ height: "200px" }}>
      <Bar
        data={demandData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: "Demand Status Overview" },
          },
        }}
      />
    </div>
  </Card>
);

// Main Dashboard Component
const Dashboard = () => {
  return (
    <div>
      {/* <ProfileCard /> */}
      <StatData />
      {/* <EnergyConsumption />
      <DemandStatus /> */}
    </div>
  );
};

export default Dashboard;
