import React, { useState, useEffect } from "react";
import { Button, Spin, message, Typography, Space, Tooltip, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { FileTextOutlined } from "@ant-design/icons";
import chat from '../../assets/chatAnnual.png';
import { generatePDF, createPdfContent } from './utils'; // Import from utils.js
import DemandModal from "./Modal/DemandModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const { Title, Text } = Typography;

const AnnualSvg = () => {
  const [loading, setLoading] = useState(false);
  const [annualSavingResponse, setAnnualSavingResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isRequirementModalVisible, setIsRequirementModalVisible] = useState(false);

  const requirementId = localStorage.getItem('selectedRequirementId');
  const subscriptionPlan = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const User = JSON.parse(localStorage.getItem('user'));
  const userId = User.id;

  const status = subscriptionPlan.status;

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

  const showRequirementModal = () => {
    setIsRequirementModalVisible(true);
  };

  const handleRequirementModalClose = () => {
    setIsRequirementModalVisible(false);
  };

  const handleContinue = () => {
    if (status === 'active') {
      navigate("/consumer/energy-consumption-table", { state: { requirementId, reReplacement: annualSavingResponse?.re_replacement } });
    } else {
      navigate('/subscription-plan');
    }
  };

  const dataForBarChart = [
    { name: 'Potential Savings', value: annualSavingResponse?.annual_savings || 0 },
    { name: 'Average Savings', value: annualSavingResponse?.average_savings || 0 },
  ];

  const dataForPieChart = [
    { name: 'RE Replacement', value: annualSavingResponse?.re_replacement || 0 },
    { name: 'Non-RE', value: 100 - (annualSavingResponse?.re_replacement || 0) },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <Spin spinning={loading} tip="Loading...">
        <main style={{ padding: "20px", minHeight: "90vh", position: "relative" }}>
          <Row justify="center" align="middle">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <div style={{ backgroundColor: "#F5F6FB", padding: "20px", border: "2px solid #6698005c", borderRadius: "5px", width: '100%' }}>
                {error ? (
                  <div style={{ color: "red", fontSize: "16px" }}>Error: {error}</div>
                ) : (
                  <div>
                    <Title level={2} style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
                      Annual Savings Report
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px', color: '#9a8406', cursor: 'pointer' }} onMouseEnter={showRequirementModal}>
                          Contracted Demand (MW)
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px', color: '#9a8406', cursor: 'pointer' }} onMouseEnter={showRequirementModal}>
                          {annualSavingResponse ? annualSavingResponse.contracted_demand : "0"}
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Potential Savings</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                          {annualSavingResponse ? annualSavingResponse.annual_savings.toLocaleString('en-IN') : "0"}
                          <span style={{ fontSize: '16px' }}> INR</span>
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Average Savings (For your Industry Category) <span style={{ fontSize: '14px' }}>(INR/MW)</span></Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                          {annualSavingResponse ? annualSavingResponse.average_savings.toLocaleString('en-IN') : "0"}
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Potential RE Replacement</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                          {annualSavingResponse ? annualSavingResponse.re_replacement : "0"}%
                        </Text>
                      </Col>
                    </Row>
                    <Row justify="center" style={{ marginTop: "20px" }}>
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => generatePDF(createPdfContent(annualSavingResponse), requirementId)}
                          icon={<FileTextOutlined />}
                          style={{ fontSize: '16px', width: '180px', padding: '5px' }}
                        >
                          Download Report
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Infographics Section */}
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={12} lg={10}>
              <Title level={4} style={{ textAlign: 'center' }}>Savings Comparison</Title>
              <BarChart
                width={Math.min(window.innerWidth * 0.8, 500)}
                height={300}
                data={dataForBarChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </Col>
            <Col xs={24} sm={12} md={12} lg={10}>
              <Title level={4} style={{ textAlign: 'center' }}>RE Replacement</Title>
              <PieChart width={Math.min(window.innerWidth * 0.8, 400)} height={300}>
                <Pie
                  data={dataForPieChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataForPieChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </Col>
          </Row>

          {/* Continue Button */}
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col>
              {status === 'active' ? (
                <Tooltip title="Please click to proceed">
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#669800",
                      borderColor: "#669800",
                      fontSize: "20px",
                      padding: "0 40px",
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
                      backgroundColor: "#669800",
                      borderColor: "#669800",
                      fontSize: "20px",
                      padding: "0 40px",
                    }}
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </Tooltip>
              )}
            </Col>
          </Row>
        </main>
      </Spin>
      <DemandModal
        title="Demand Details"
        open={isRequirementModalVisible}
        onCancel={handleRequirementModalClose}
        requirementContent={annualSavingResponse}
        footer={null}
      />
    </div>
  );
};

export default AnnualSvg;