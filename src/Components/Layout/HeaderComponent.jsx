import React from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useSelector } from "react-redux";
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
  // Use useSelector to get the loginType from the Redux store
  const loginType = useSelector((state) => state.login?.loginType);
  console.log("login type in header:", loginType);

  // Labels based on login type
  const labels = loginType === "consumer" 
    ? ["Requirements", "Matching IPP", "Subscription", "Updated Unit", "Optimized IPP"]
    : ["Portfolio", "Matching Consumer", "Subscription", "Update Profile", "Optimized IPP"];

  return (
    <Header
      className="header-component"
      style={{
        backgroundColor: "transparent" /* Ensure no background color */,
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: isMobile ? "auto" : "80px",
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
          height: "100px",
        }}
      >
        {loginType ? (
          <div style={{ width: "1000px", margin: "0 auto" }}>
            <div className="navbar">
              <div className="progress-container">
                <div className="horizontal-line"></div>
                <div className="progress-icons">
                  {labels.map((label, index) => (
                    <div className="icon-container" key={index}>
                      <span className="icon-label" style={{ fontSize: "12px" }}>
                        {label}
                      </span>
                      <div
                        className="icon-circle"
                        style={{
                          marginRight: index === 2 ? "0" : "60px",
                          marginLeft: index >= 3 ? "100px" : "0",
                        }}
                      >
                        {[
                          <UserOutlined />,
                          <HomeOutlined />,
                          <FileTextOutlined />,
                          <BookOutlined />,
                          <WalletOutlined />,
                        ][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#669800",
              textAlign: "center",
            }}
          >
            EXG
          </h1>
        )}
      </div>
    </Header>
  );
};

export default HeaderComponent;
