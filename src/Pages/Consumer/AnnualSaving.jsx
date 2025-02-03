import React, { useState, useEffect } from "react";
import { Button, Spin, message, Typography, Space, Tooltip, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { FileTextOutlined } from "@ant-design/icons";
import chat from '../../assets/chat.png';
import { generatePDF, createPdfContent } from './utils'; // Import from utils.js

const { Title, Text } = Typography;

const AnnualSvg = () => {
  const [loading, setLoading] = useState(false);
  const [annualSavingResponse, setAnnualSavingResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // const { requirementId } = location.state || {};
  const requirementId = localStorage.getItem('selectedRequirementId');
  // console.log(requirementId);
  const subscriptionPlan = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const User = JSON.parse(localStorage.getItem('user'));
  const userId = User.id;

  const status=subscriptionPlan.status;

  // console.log(subscriptionPlan.status);
  
  const handleChatWithExpert = () => {
    navigate("/consumer/chat-page");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = { requirement_id: requirementId };
      setLoading(true);
      try {
        const response = await dispatch(FetchAnnualSaving(data)).unwrap();
        setAnnualSavingResponse(response);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch annual savings.");
        message.error(err.message || "Failed to fetch annual savings.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, requirementId]);

  const handleContinue = () => {
    // console.log('akjdkfjlajlfkjal');
    if(status === 'active') {
     
      navigate("/consumer/energy-consumption-table", { state: { requirementId, reReplacement: annualSavingResponse?.re_replacement } });
    } else {
      navigate('/consumer/subscription-plan')
    }
  };

  return (
    <Spin spinning={loading} tip="Loading...">
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", flexDirection: "column", height: "90vh", position: "relative", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ backgroundColor: "#F5F6FB", padding: "20px", border: "2px solid #6698005c", borderRadius: "5px", position: "relative"}}>
        {error ? (
          <div style={{ color: "red", fontSize: "16px" }}>Error: {error}</div>
        ) : (
          <div>
            <div>
              <Title level={2} className="text-center" style={{ fontSize: '24px', marginBottom: '20px' }}>
                Annual Savings Report
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong style={{ fontSize: '16px' }}>Potential Savings</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: '20px' }}>{` :  `} {` `}
                    {annualSavingResponse ? annualSavingResponse.annual_savings.toLocaleString() : "0"} <span style={{ fontSize: '16px' }}>INR</span>
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ fontSize: '16px' }}>Average Savings (For your Industry Category)</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: '20px' }}>{` : `}
                     {annualSavingResponse ? annualSavingResponse.average_savings.toLocaleString() : "0"} <span style={{ fontSize: '16px' }}>INR</span>
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ fontSize: '16px' }}>Potential RE Replacement</Text>
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: '20px' }}>{` : `}
                    {annualSavingResponse ? annualSavingResponse.re_replacement : "0"}%
                  </Text>
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: "20px" }}>
              <Space wrap className="actions" style={{ marginTop: "20px", display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" onClick={() => generatePDF(createPdfContent(annualSavingResponse), requirementId)} icon={<FileTextOutlined />} style={{ fontSize: '20px', padding: '10px 20px' }}>
                  Download Report
                </Button>
                <Button type="primary" onClick={handleChatWithExpert} icon={<img src={chat} alt="chat icon" style={{ width: '20px', height: '20px' }} />} style={{ fontSize: '20px', padding: '10px 20px' }}>
                  Need Assistance ?
                </Button>
              </Space>
            </div>
          </div>
        )}
      </div>
  <div>
 {/* Continue Button */}
 {status === 'active' ? (
  <Tooltip title="Please click to proceed">
    <Button
      type="primary"
      style={{
        marginTop: "20px",
        backgroundColor: "#669800",
        borderColor: "#669800",
        fontSize: "20px",
        padding: "0 40px",
        zIndex: 1, // Ensure the button is above other elements
        position: 'relative', // Ensure positioning is correct
      }}
      onClick={handleContinue}
    >
     Continue {`>>`}
    </Button>
  </Tooltip>
) : (
  <Tooltip title="To further explore, subscribe to our plan">
    <Button
      type="primary"
      style={{
        marginTop: "20px",
        backgroundColor: "#669800",
        borderColor: "#669800",
        fontSize: "20px",
        padding: "0 40px",
        zIndex: 1, // Ensure the button is above other elements
        position: 'relative', // Ensure positioning is correct
      }}
      onClick={handleContinue}
    >
      Continue
    </Button>
  </Tooltip>
)}

  
  </div>
     
      {/* Background Structure */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "url('path-to-your-structure-image') no-repeat center center fixed",
        backgroundSize: "cover",
        opacity: 0.1, // Adjust the opacity for subtlety
        zIndex: 0
      }} />
    </main>
  </Spin>
  
  );
};

export default AnnualSvg;
