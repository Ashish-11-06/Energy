import React from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useLocation, Link } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./HeaderComponent.css"; // Add custom styles for header component

const { Header } = Layout;

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const consumerSteps = [
    { path: '/consumer/requirement', label: 'Requirements', icon: <UserOutlined /> },
    { path: '/consumer/matching-ipp', label: 'Matching IPP', icon: <HomeOutlined /> },
    { path: '/consumer/annual-saving', label: 'Annual Saving', icon: <FileTextOutlined /> },
    { path: '/consumer/subscription-plan', label: 'Subscription', icon: <FileTextOutlined /> },
    { path: '/consumer/energy-consumption-table', label: 'Consumption Table', icon: <BookOutlined /> },
    { path: '/consumer/consumption-pattern', label: 'Consumption Pattern', icon: <WalletOutlined /> },
  ];

  const generatorSteps = [
    { path: '/generator/portfolio', label: 'Portfolio', icon: <UserOutlined /> },
    { path: '/generator/matching-consumer', label: 'Matching consumer', icon: <HomeOutlined /> },
    { path: '/generator/subscription-plan', label: 'Subscription Plan', icon: <BookOutlined /> },
    { path: '/generator/update-profile-details', label: 'Update Profile Details', icon: <FileTextOutlined /> },
    { path: '/generator/combination-pattern', label: 'Optimized Combination', icon: <FileTextOutlined /> },
  ];

  const steps = currentPath.startsWith('/consumer') ? consumerSteps : generatorSteps;

  const currentStepIndex = steps.findIndex(step => step.path === currentPath);

  const showProgress = [
    '/consumer/requirement',
    '/consumer/matching-ipp',
    '/consumer/annual-saving',
    '/consumer/subscription-plan',
    '/consumer/energy-consumption-table',
    '/consumer/consumption-pattern',
    '/generator/portfolio',
    '/generator/matching-consumer',
    '/generator/subscription-plan',
    '/generator/update-profile-details',
    '/generator/combination-pattern'
  ].includes(currentPath);

  return (
    <Header
      className="header-component"
      style={{
        backgroundColor: "transparent" /* Ensure no background color */,
        padding: "0 16px",
        // display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: isMobile ? "auto" : "80px",
        // border: '2px solid red'
      }}
    >
      {/* Drawer button visible on mobile */}
      {isMobile && (
        <Button
          icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleDrawer}
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            zIndex: 1001,
          }}
        />
      )}

      {/* Header Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center", // Center align the content for better aesthetics
          width: "100%", // Ensure it spans the full width of the parent
          height: "100%",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1500px", margin: "0 auto" }}>
          {showProgress && (
            <div className="navbar " style={{marginBottom:'20px'}}>
              <div className="progress-container" style={{ width: "100%" }}>
                <div className="horizontal-line" style={{ '--progress-width': `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                <div className="progress-icons" style={{ display: "flex", justifyContent: "space-between" }}>
                  {steps.map((step, index) => (
                    <div className="icon-container" key={index} style={{ flex: 1, textAlign: "center" }}>
                      <span className="icon-label" style={{ fontSize: "10px" }}>
                        {step.label}
                      </span>
                      <Link to={step.path}>
                        <div
                          className={`icon-circle ${index <= currentStepIndex ? 'completed' : ''}`}
                          style={{
                            margin: "0 auto",
                            transform: index === steps.length - 1 ? "translateX(10px)" : "none", // Adjust the last circle to the right
                          }}
                        >
                          {React.cloneElement(step.icon, { style: { fontSize: '16px' } })}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;