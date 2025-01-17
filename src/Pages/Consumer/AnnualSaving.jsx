import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Typography, Card, Space,Modal, Tooltip,  } from "antd";
const { Title, Text } = Typography;

const AnnualSvg = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [annualSavingResponse, setAnnualSavingResponse] = useState(null); // State for annual saving response
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Dispatch function from Redux

  const location = useLocation();
  const { requirementId } = location.state || {}; // Destructure state to get `requirementId`

 // console.log(requirementId, "requirementId");

  // Fetch annual saving data
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  
    const handleChatWithExpert =()=> {
navigate('consumer/chat-page')
    }
    const handleInfoModalOk = () => {
      setIsInfoModalVisible(false);
    };
    const showInfoModal = () => {
      setIsInfoModalVisible(true);
    };

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

//console.log('RE replacement', reReplacement);


  const handleContinue = () => {
    navigate("/consumer/energy-consumption-table", { state: { requirementId, reReplacement } });
  };

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

              <Tooltip title="Help">
        <Button
          shape="circle"
          icon={<QuestionCircleOutlined />}
          onClick={showInfoModal}
          style={{ position: 'absolute', top: 120, right: 30 }}
        />
      </Tooltip>

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
                  <Button type="default"  onClick={handleChatWithExpert} >
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
        onClick={handleContinue}
      >
        Continue
      </Button>

      <Modal
        title="Welcome"
        open={isInfoModalVisible}
        onOk={handleInfoModalOk}
        onCancel={() => setIsInfoModalVisible(false)} // Add onCancel handler
        okText="Got it"
        footer={[
          <Button key="submit" type="primary" onClick={handleInfoModalOk}>
            Got it
          </Button>,
        ]}
      >
        <p>Hi</p>
       
        <p>Welcome to the EXG. Please follow these steps to proceed:</p>
        <ol>
          <li>Add your requirements by clicking the "Add Requirement +" button.</li>
          <li>Fill in the details shown in the form.</li>
          <li>Use the tooltip option for each field for more information.</li>
          <li>You can add multiple requirements (demands).</li>
          <li>To continue, select a requirement and click the "Continue" button.</li>
        </ol>
        <p>Thank you!</p>
      </Modal>

    </main>
  );
};

export default AnnualSvg;
