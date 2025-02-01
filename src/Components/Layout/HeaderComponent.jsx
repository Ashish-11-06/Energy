import React, { useState, useEffect } from "react";
import { Button, Avatar, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  WalletOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./HeaderComponent.css"; // Add custom styles for header component
import chat from "../../assets/need.png";
import userImage from "../../assets/profile.png";
const { Header } = Layout;

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate(); // Add useNavigate hook
  let username = ""; // Use let instead of const
  const subscriptionValidity = JSON.parse(localStorage.getItem("subscriptionPlanValidity"));
  const subscription = subscriptionValidity?.status;
  // console.log(subscription);  
  
  const [subscriptionRequires, setSubscriptionRequires] = useState("");
  useEffect(() => {
    if (subscription === "active") {
      setSubscriptionRequires(false);
    } else {
      setSubscriptionRequires(true);
    }
  }, [subscription]);

  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    // console.log('item', item);
    return item ? JSON.parse(item) : "";
  };

  const user = getFromLocalStorage("user").user;
  if (user && user.company_representative) {
    username = user.company_representative;
  }

  const handleProfileClick = () => {
    navigate(
      (user.user_category  === 'Consumer'    )
        ? "/consumer/profile"
        : "/generator/profile"
    );
  };

  const handleChatClick = () => {
    navigate(
      (user.user_category  === 'Consumer'    )
        ? "/consumer/chat-page"
        : "/generator/chat-page"
    );
  };

  const consumerSteps = [
    {
      path: "/consumer/requirement",
      label: "Consumption Unit",
      icon: <UserOutlined />,
    },
    {
      path: "/consumer/matching-ipp",
      label: "Matching IPP",
      icon: <HomeOutlined />,
    },
    {
      path: "/consumer/annual-saving",
      label: "Annual Saving",
      icon: <FileTextOutlined />,
    },
    {
      path: "/consumer/subscription-plan",
      label: "Subscription",
      icon: <FileTextOutlined />,
    },
    {
      path: "/consumer/energy-consumption-table",
      label: "Consumption Table",
      icon: <BookOutlined />,
      requiresSubscription: subscriptionRequires,
    },
    {
      path: "/consumer/consumption-pattern",
      label: "Consumption Pattern",
      icon: <WalletOutlined />,
      requiresSubscription: subscriptionRequires,
    },
  ];

  const generatorSteps = [
    {
      path: "/generator/portfolio",
      label: "Portfolio",
      icon: <UserOutlined />,
    },
    {
      path: "/generator/matching-consumer",
      label: "Matching consumer",
      icon: <HomeOutlined />,
    },
    {
      path: "/generator/subscription-plan",
      label: "Subscription Plan",
      icon: <BookOutlined />,
    },
    {
      path: "/generator/update-profile-details",
      label: "Update Profile Details",
      icon: <FileTextOutlined />,
      requiresSubscription: subscriptionRequires,
    },
    {
      path: "/generator/combination-pattern",
      label: "Optimized Combination",
      icon: <FileTextOutlined />,
      requiresSubscription: subscriptionRequires,
    },
  ];


  
  const steps = (user.user_category  === 'Consumer'    )
    ? consumerSteps
    : generatorSteps;

  const currentStepIndex = steps.findIndex((step) => step.path === currentPath);
  // console.log(user.user_category, steps);
  const showProgress = [
    "/consumer/requirement",
    "/consumer/matching-ipp",
    "/consumer/annual-saving",
    "/consumer/subscription-plan",
    "/consumer/energy-consumption-table",
    "/consumer/consumption-pattern",
    "/generator/portfolio",
    "/generator/matching-consumer",
    "/generator/subscription-plan",
    "/generator/update-profile-details",
    "/generator/combination-pattern",
  ].includes(currentPath);

  return (
    <Header
      className="header-component"
      style={{
        backgroundColor: "#6698005c",
        padding: "0 16px",

        // display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        marginLeft: "-50px",
        marginRight: "-50px",
        top: 0,
        zIndex: 1000,
        height: isMobile ? "70px" : "70px",
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
            <div className="navbar " style={{ marginBottom: "20px" }}>
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
                  {steps.map((step, index) => (
                    <div
                      className="icon-container"
                      key={index}
                      style={{ flex: 1, textAlign: "center" }}
                    >
                      <span className="icon-label" style={{ fontSize: "10px" }}>
                        {step.label}
                      </span>

                      {/* Check subscription before allowing navigation */}
                      {step.requiresSubscription &&
                      subscription !== "active" ? (
                        <div
                          className="icon-circle disabled"
                          style={{
                            margin: "0 auto",
                            cursor: "not-allowed",
                            opacity: 0.5,
                          }}
                          title="Subscribe to access"
                        >
                          {React.cloneElement(step.icon, {
                            style: { fontSize: "16px" },
                          })}
                        </div>
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
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Profile Icon */}
        <span>
          <Tooltip title={username}>
            <img
              src={userImage} // User profile image
              alt="User"
              style={{
                position: "absolute",
                right: 24,
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
                right: 8,
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
