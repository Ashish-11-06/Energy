import React, { useState, useEffect } from "react";
import { Spin, Alert, Row, Col, Button } from "antd"; // Added Button
import { useNavigate } from "react-router-dom"; // For navigation
import AnnualSaving from "../../Components/Consumer/AnnualSaving";

const AnnualSvg = () => {
  const [data, setData] = useState([]); // State to store table data
  const [loading, setLoading] = useState(true); // Set to `true` to simulate loading
  const [error, setError] = useState(null); // State to handle API errors
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Example fallback data
    const exampleData = [
      { key: 1, ipp: "IPP1", states: "Karnataka", capacity: "50 MW" },
      { key: 2, ipp: "IPP2", states: "Maharashtra", capacity: "30 MW" },
      { key: 3, ipp: "IPP3", states: "Rajasthan", capacity: "10 MW" },
    ];

    // Simulate an API call delay
    const timeout = setTimeout(() => {
      setData(exampleData);
      setLoading(false); // Set loading to false once data is available
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F5F6FB",
        }}
      >
        <div>
          <Spin size="large" tip="please wait...">
            <div style={{ minHeight: "20px" }} /> {/* Empty content to satisfy nesting */}
          </Spin>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F5F6FB",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <main
      className="ipp-main"
      style={{
        display: "flex",
        justifyContent: "center", // Centers content horizontally
        alignItems: "center", // Centers content vertically
        backgroundColor: "rgb(245, 246, 251)",
        padding: "20px",
        // height: "100vh",
        flexDirection: "column", // Stack items vertically
       
      }}
    >
      <Row
        gutter={[20, 20]}
        style={{
          display: "flex",
          justifyContent: "center", // Ensure row is centered
          width: "100%", // Ensure row takes full width
        }}
      >
        <div style={{ backgroundColor: "#F5F6FB", padding: "20px" }}>
          <AnnualSaving />
        </div>
      </Row>

      {/* Continue Button */}
      <Button
        type="primary"
        style={{
          marginTop: "20px",
          backgroundColor: "#669800",
          borderColor: "#669800",
          color: "#fff",
          fontSize: "16px",
          padding: "0 30px",
        }}
        onClick={() => navigate("/consumer/subscription-plan")} // Navigate to the next page
      >
        Continue
      </Button>
    </main>
  );
};

export default AnnualSvg;
