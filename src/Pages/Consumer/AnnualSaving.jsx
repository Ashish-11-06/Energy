import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { Typography, Card, Space } from "antd";
const { Title, Text } = Typography;

const AnnualSvg = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [annualSavingResponse, setAnnualSavingResponse] = useState(null); // State for annual saving response
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Dispatch function from Redux

  const location = useLocation();
  const { requirementId } = location.state || {}; // Destructure state to get `requirementId`

  console.log(requirementId, "requirementId");

  // Fetch annual saving data
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        requirement_id: requirementId,
      };
      setLoading(true);
      try {
        const response = await dispatch(FetchAnnualSaving(data)).unwrap(); // Use .unwrap() to handle data directly
        setAnnualSavingResponse(response); // Set the full response
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message || "Failed to fetch annual savings.");
        message.error(err.message || "Failed to fetch annual savings."); // Show error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, requirementId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin tip="Loading..." />
      </div>
    );
  }

  // Conditional rendering to ensure data is available
  const annualSaving = annualSavingResponse ? annualSavingResponse.annual_savings : null;
  const reReplacement = annualSavingResponse ? annualSavingResponse.re_replacement : null;

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ backgroundColor: "#F5F6FB", padding: "20px", border: "2px solid #6698005c", borderRadius: "5px" }}>
        {error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          <>
            <div className="annual-saving-container">
              <Title level={3} className="text-center">
                Annual Saving
              </Title>

              <Space direction="vertical" size="large" className="w-100">
                <Card bordered={false} className="custom-card">
                  <Text className="custom-label">Potential Annual Saving (INR):</Text>
                  <div className="amount-box">
                    <Text className="amount">₹{annualSaving ? annualSaving.toLocaleString() : "0"}</Text> {/* Dynamic annual saving */}
                  </div>
                </Card>

                <Card bordered={false} className="custom-card">
                  <Text className="custom-label">Potential RE Replacement %:</Text>
                  <div className="amount-box">
                    <Text className="amount">{reReplacement ? reReplacement : "0"}%</Text> {/* Dynamic RE replacement */}
                  </div>
                </Card>

                <Space wrap className="actions">
                  <Button type="primary" /* onClick={handleDownloadReport} */>
                    Download Report
                  </Button>
                  <Button type="default" /* onClick={handleChatWithExpert} */>
                    Chat with Expert
                  </Button>
                </Space>
              </Space>
            </div>
          </>
        )}
      </div>

      <Button
        type="primary"
        style={{
          marginTop: "20px",
          backgroundColor: "#669800",
          borderColor: "#669800",
          fontSize: "16px",
          padding: "0 30px",
        }}
        onClick={() => navigate("/consumer/energy-consumption-table", { state: { requirementId } })}
      >
        Continue
      </Button>
    </main>
  );
};

export default AnnualSvg;
