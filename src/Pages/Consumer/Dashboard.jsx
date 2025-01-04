import React, { useState } from "react";
import { Card, Modal } from "antd";
import { Line, Bar } from "react-chartjs-2";
import styled from "styled-components";
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
import NavbarWithProgressBar from "./NavbarWithProgressBar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

const isSubscribed = true;
const totalDemands = 1200;
const completedDemands = 800;

const statsData = [
  { title: "Energy purchased from", value: profileData.stats.purchasedFrom, icon: <BulbOutlined /> },
  { title: "Demands sent", value: profileData.stats.offered, icon: <ToolOutlined /> },
  { title: "Offer received", value: profileData.stats.offersReceived, icon: <MailOutlined /> },
  { title: "Transactions done", value: profileData.stats.transactionsDone, icon: <SwapOutlined /> },
  { title: "Your total demands", value: profileData.stats.totalDemands, icon: <AreaChartOutlined /> },
  { title: "Subscription Plan", value: isSubscribed ? "Yes" : "No", icon: <FileTextOutlined /> },
  {
    title: "Total States",
    value: 6,
    icon: <GlobalOutlined />,
    details: ["State 1", "State 2", "State 3", "State 4", "State 5", "State 6"],
  },
];

// Styled component for the stats grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
`;

// Styled card for individual stat
const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const StatData = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState([]);

  const handleViewClick = (details) => {
    setModalDetails(details);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <StatsGrid>
        {statsData.map((stat, index) => (
          <StatCard key={index}>
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>{stat.icon}</div>
            <h3 style={{ fontSize: "24px", margin: "0" }}>{stat.value}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>{stat.title}</p>
            {stat.details && (
              <button
                onClick={() => handleViewClick(stat.details)}
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
                View Details
              </button>
            )}
          </StatCard>
        ))}
      </StatsGrid>
      <Modal title="Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <ul>
          {modalDetails.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

const Dashboard = () => {
  return (
    <div>
      <StatData />
    </div>
  );
};

export default Dashboard;
