/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./HeaderComponent.css"; // Add custom styles for header component
import chat from "../../../assets/need.png";
import userImage from "../../../assets/profile.png";

const { Header } = Layout;

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log('cc',currentPath);
  
  const navigate = useNavigate(); // Add useNavigate hook
  let username = ""; // Use let instead of const
  const subscriptionValidity = JSON.parse(localStorage.getItem("subscriptionPlanValidity"));
  const subscription = subscriptionValidity?.status;
  const matchingConsumerId = localStorage.getItem('matchingConsumerId');
  const [matchingConsumer, setMatchingConsumer] = useState("");
  const [subscriptionRequires, setSubscriptionRequires] = useState("");
// const currentPath=localStorage.getItem('currentPath');
  useEffect(() => {
    setSubscriptionRequires(subscription !== "active");
  }, [subscription]);

  useEffect(() => {
    setMatchingConsumer(!matchingConsumerId);
  }, [matchingConsumerId]);

  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : "";
  };

  const user = getFromLocalStorage("user").user;
  if (user && user.company_representative) {
    username = user.company_representative;
  }
  const user_category = user?.user_category === "Consumer" ? "consumer" : "generator";
  const handleProfileClick = () => {
    navigate(
      (user.user_category === 'Consumer')
        ? "/px/consumer/profile"
        : "/px/generator/profile"
    );
  };

  const handleChatClick = () => {
    navigate(
      (user.user_category === 'Consumer')
        ? "/px/chat-page"
        : "/px/chat-page"
    );
  };

  const consumerDayAheadSteps = [
    {
      path: "/px/consumer/day-ahead",
      label: "Forecast Day Ahead",
      icon: <UserOutlined />,
    },
    {
      path: "/px/consumer/plan-trade-page",
      label: "Plan Next Day Trading",
      icon: <HomeOutlined />,
    },
    {
      path: "/px/consumer/trading",
      label: "Trade",
      icon: <FileTextOutlined />,
    },
  ];

  const consumerMonthAheadSteps = [
    {
      path: "/px/consumer/month-ahead",
      label: "Forecast Month Ahead",
      icon: <UserOutlined />,
    },
    {
      path: "/px/consumer/plan-month-trade",
      label: "Plan Month Trading",
      icon: <HomeOutlined />,
    },
    {
      path: "/px/consumer/planning",
      label: "Plan Your Trade",
      icon: <FileTextOutlined />,
    },
  ];

  const generatorDayAheadSteps = [
    {
      path: "/px/generator/day-ahead",
      label: "Forecast Day Ahead",
      icon: <UserOutlined />,
    },
    {
      path: "/px/generator/plan-day-trade-page",
      label: "Plan Next Day Trading",
      icon: <HomeOutlined />,
    },
    {
      path: "/px/generator/trading",
      label: "Trade",
      icon: <FileTextOutlined />,
    },
  ];

  const generatorMonthAheadSteps = [
    {
      path: "/px/generator/month-ahead",
      label: "Forecast Month Ahead",
      icon: <UserOutlined />,
    },
    {
      path: "/px/generator/plan-month-trade-page",
      label: "Plan Month Trading",
      icon: <HomeOutlined />,
    },
    {
      path: "/px/generator/trading",
      label: "Trade",
      icon: <FileTextOutlined />,
    },
  ];

  const steps = (user.user_category === 'Consumer')
    ? (currentPath.startsWith("/px/consumer/day-ahead") || currentPath.startsWith("/px/consumer/plan-trade-page") || currentPath.startsWith("/px/consumer/trading"))
      ? consumerDayAheadSteps
      : (currentPath.startsWith("/px/consumer/month-ahead") || currentPath.startsWith("/px/consumer/plan-month-trade"))
      ? consumerMonthAheadSteps
      : []
    : (currentPath.startsWith("/px/generator/day-ahead") || currentPath.startsWith("/px/generator/plan-day-trade-page") || currentPath.startsWith("/px/generator/trading"))
      ? generatorDayAheadSteps
      : (currentPath.startsWith("/px/generator/month-ahead") || currentPath.startsWith("/px/generator/plan-month-trade-page"))
      ? generatorMonthAheadSteps
      : [];

  const currentStepIndex = steps.findIndex((step) => step.path === currentPath);
  const showProgress = steps.length > 0;

  return (
    <Header
      className="header-component"
      style={{
        backgroundColor: "#6698005c",
        padding: "0 16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        marginLeft: "-50px",
        marginRight: "-50px",
        top: 0,
        zIndex: 1000,
        height: isMobile ? "70px" : "70px",
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
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1500px", margin: "0 auto" }}>
          {showProgress && (
            <div className="navbar" style={{ marginBottom: "20px" }}>
              <div className="progress-container" style={{ width: "80%" }}>
                <div
                  className="horizontal-line"
                  style={{
                    "--progress-width": `${
                      (currentStepIndex / (steps.length - 1)) * 100
                    }%`,
                  }}
                ></div>
                <div
                  className="progress-icons"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {steps.map((step, index) => {
                    const isDisabled = step.requiresSubscription && step.requiresMatchingConsumer && subscription !== "active";
                    const isMatchingConsumerMissing = step.requiresMatchingConsumer && matchingConsumer;

                    return (
                      <div
                        className="icon-container"
                        key={index}
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        <span className="icon-label" style={{ fontSize: "10px" }}>
                          {step.label}
                        </span>

                        {isMatchingConsumerMissing ? (
                          <Tooltip title="">
                            <div
                              className="icon-circle disabled"
                              style={{
                                margin: "0 auto",
                                cursor: "not-allowed",
                                opacity: 0.5,
                              }}
                            >
                              {React.cloneElement(step.icon, {
                                style: { fontSize: "16px" },
                              })}
                            </div>
                          </Tooltip>
                        ) : isDisabled ? (
                          <Tooltip title="Subscribe to access">
                            <div
                              className="icon-circle disabled"
                              style={{
                                margin: "0 auto",
                                cursor: "not-allowed",
                                opacity: 0.5,
                              }}
                            >
                              {React.cloneElement(step.icon, {
                                style: { fontSize: "16px" },
                              })}
                            </div>
                          </Tooltip>
                        ) : (
                          <Link to={step.path}>
                            <div
                              className={`icon-circle ${
                                index <= currentStepIndex ? "completed" : ""
                              }`}
                              style={{
                                margin: "0 auto",
                                transform:
                                  index === steps.length - 1
                                    ? "translateX(10px)"
                                    : "none",
                              }}
                            >
                              {React.cloneElement(step.icon, {
                                style: { fontSize: "16px" },
                              })}
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Profile Icon */}
        <span style={{ display: "flex", alignItems: "center" }}>
          <p
            style={{
              position: "absolute",
              right: 50,
              top: "1px",
              marginRight: "50px",
              marginBottom: "60px",
              marginLeft: "10px", // Optional: To add some space between the text and chat icon
            }}
          >
            {user_category && username ? (
              // Show Tooltip with "My Profile" when there's a valid user_category and username
              <Tooltip title="My Profile" placement="top">
                <p>
                  Welcome,  <span onClick={()=> {navigate(`/${user_category}/profile`)}} style={{color:'rgb(154, 132, 6)'}}>{username}</span>
                </p>
                {/* <a href={`/${user_category}/profile`}>{username}!</a> */}
              </Tooltip>
            ) : (
              // Show a different message if user_category or username is not available
              <p>Welcome, Guest!</p>
            )}
          </p>

<Tooltip title="My Profile" placement="top">
          <img
            src={userImage} // User profile image
            alt="User "
            style={{
              position: "absolute",
              right: 12,
              top: 18,
              marginRight: "50px",
              zIndex: 1001,
              backgroundColor: "white",
              cursor: "pointer",
              height: "30px",
              padding: "5px",
              width: "30px",
              borderRadius: "50%", // Ensures a circular shape
              objectFit: "cover", // Scales image to fill the circle properly
              border: "1px solid green",
            }}
            onClick={handleProfileClick}
          />
          </Tooltip>

          <Tooltip title="Need Assistance?">
            <img
              src={chat} // Use your imported chat image
              alt="Chat"
              style={{
                position: "absolute",
                right: 6,
                top: 18,
                marginRight: "20px",
                zIndex: 1001,
                backgroundColor: "white",
                cursor: "pointer",
                height: "30px",
                width: "30px",
                padding: "5px",
                borderRadius: "50%",
                border: "1px solid green",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleChatClick}
            />
          </Tooltip>
        </span>
      </div>
    </Header>
  );
};

export default HeaderComponent;