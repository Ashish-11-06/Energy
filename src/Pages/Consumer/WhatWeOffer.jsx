/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Button, message, Spin } from "antd";
import {
  ThunderboltOutlined,
  DashboardOutlined,
  UserOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import whatWeOffer from "../../Redux/api/whatWeOffer";
import { useDispatch } from "react-redux";
import TermsAndConditionModal from "./Modal/TermsAndConditionModal";
import { motion } from "framer-motion"; // Import motion here
import EXGLogo from "../../assets/EXG.png";
import map from "../../assets/map.png";
// import { format } from "react-intl-number-format"; // Import for Indian number formatting

const WhatWeOffer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(null); // State to store fetched data
  const [isModal, setIsModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState(0); // Target amount for animation

  const formatToIndianNumbering = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const user = JSON.parse(localStorage.getItem("user"))?.user;
  const user_category = user?.user_category;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await whatWeOffer.whatWeOffer();
        setData(response.data);
        setTargetAmount(response.data.amount_saved_annually);
      } catch (error) {
        console.error("Failed to fetch data from the server.", error);
        message.error("Failed to fetch data from the server.");
      }
    };

    fetchData();
  }, [dispatch]);

  const handleContinue = () => {
    setIsModal(true);
  };

  if (!data) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </Row>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 5%",
        background: "linear-gradient(to right, rgba(101, 152, 0, 0.6), #f1f9e0)",
      }}
    >
      {/* LOGO - Always Fixed at Top */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 50,
          zIndex: 10,
        }}
      >
        <img src={EXGLogo} alt="EXG Logo" style={{ width: '18%' }} />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          background: "linear-gradient(to right, #f1f9e0, rgba(101, 152, 0, 0.6))",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "#669800", fontWeight: "bold" }}>
          What We Offer
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px", color: "#9A8406" }}>
          Discover the key strengths of our services that make us your trusted partner.
        </p>

        <Row gutter={[16, 16]} justify="center">
          {user_category === "Consumer" && (
            <>
              <Col xs={24} sm={12} md={8}>
                <Card
                  style={{
                    background: "white",
                  }}
                  hoverable title="Total Projects">
                  <Statistic
                    value={data.total_portfolios}
                    prefix={<ThunderboltOutlined />}
                    formatter={() => <CountUp start={0} end={data.total_portfolios} duration={3} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  style={{
                    background: "white",
                  }}
                  hoverable title="Total Capacity Available">
                  <Statistic
                    value={data.total_available_capacity}
                    prefix={<DashboardOutlined />}
                    suffix="MW"
                    formatter={() => <CountUp start={0} end={data.total_available_capacity} duration={3} />}
                  />
                </Card>
              </Col>
            </>
          )}

          {user_category === "Generator" && (
            <>
              <Col xs={24} sm={12} md={8}>
                <Card
                  style={{
                    background: "white",
                  }}
                  hoverable title="Total Consumers">
                  <Statistic
                    value={data.consumer_count}
                    prefix={<UserOutlined />}
                    formatter={() => <CountUp start={0} end={data.consumer_count} duration={3} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  style={{
                    background: "white",
                  }}
                  hoverable title="Total Capacity">
                  <Statistic
                    value={data.total_contracted_demand}
                    prefix={<LineChartOutlined />}
                    suffix="MW"
                    formatter={() => <CountUp start={0} end={data.total_contracted_demand} duration={3} />}
                  />
                </Card>
              </Col>
            </>
          )}

          <Col xs={24} sm={12} md={8}>
            <Card
              style={{
                background: "white",
              }}
              hoverable title="Number of States Covered">
              <Statistic
                value={data.unique_state_count}
                prefix={<img src={map} alt="map" style={{ width: 40, height: 40 }} />}
                formatter={() => <CountUp start={0} end={data.unique_state_count} duration={3} />}
              />
            </Card>
          </Col>
        </Row>

        {user_category === "Consumer" && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#9A8406" }}>Did You Know?</h2>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#669800",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              INR <span style={{ marginLeft: "5px" }}>
                <CountUp
                  start={0}
                  end={targetAmount}
                  duration={3}
                  separator=","
                  formattingFn={formatToIndianNumbering} // Apply Indian formatting
                />
              </span>
            </motion.div>
            <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>Saved annually by our consumers!</p>
          </div>
        )}
        <p style={{ fontSize: "1.2rem", marginTop: "20px", marginBottom: '-10px', color: "#9A8406" }}>Start Your Transition Journey...</p>
        <Button
          type="default"
          style={{
            padding: "10px 20px",
            fontSize: "20px",
            marginTop: "30px",
            borderColor: "#E6E8F1",
          }}
          onClick={handleContinue}
        >
          Proceed {">>"}
        </Button>
      </div>

      <TermsAndConditionModal visible={isModal} user_category={user_category} onCancel={() => setIsModal(false)} />
    </div>
  );
};

export default WhatWeOffer;
