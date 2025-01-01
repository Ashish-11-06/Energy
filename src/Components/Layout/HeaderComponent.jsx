import React from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import NavbarWithProgressBar from "../../Pages/Consumer/NavbarWithProgressBar";
import { useSelector } from "react-redux";
import "./HeaderComponent.css"; // Add custom styles for header component
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  WalletOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => {
  // Use useSelector to get the loginType from the Redux store
  const loginType = useSelector((state) => state.login?.loginType);

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
        {loginType === "consumer" ? (
          <div style={{ width: "1000px", margin: "0 auto" }}>
            <div className="navbar">
              <div className="progress-container">
                <div className="horizontal-line"></div>
                <div className="progress-icons">
                  <div className="icon-container">
                    <span className="icon-label" style={{ fontSize: "12px"  }}>
                      Requirements
                    </span>
                    <div className="icon-circle" style={{marginRight:'60px'}}>
                      <UserOutlined />
                    </div>
                  </div>
                  <div className="icon-container">
                    <span className="icon-label" style={{ fontSize: "12px" }}>
                      Matching IPP
                    </span>
                    <div className="icon-circle" style={{marginRight:'60px'}}>
                      <HomeOutlined />
                    </div>
                  </div>
                  <div className="icon-container">
                    <span className="icon-label" style={{ fontSize: "12px" }}>
                      Payment
                    </span>
                    <div className="icon-circle">
                      <FileTextOutlined />
                    </div>
                  </div>
                  <div className="icon-container">
                    <span className="icon-label" style={{ fontSize: "12px" }}>
                     Updated Unit
                    </span>
                    <div className="icon-circle" style={{marginLeft:'100px'}}>
                      <BookOutlined />
                    </div>
                  </div>
                  <div className="icon-container">
                    <span className="icon-label" style={{ fontSize: "12px" }}>
                      Optimized IPP
                    </span>
                    <div className="icon-circle" style={{marginLeft:'100px'}}>
                      <WalletOutlined />
                    </div>
                  </div>
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
