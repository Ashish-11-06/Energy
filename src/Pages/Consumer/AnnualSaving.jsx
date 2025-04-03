import React, { useState, useEffect } from "react";
import { Button, Spin, message, Typography, Col, Row, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { FileTextOutlined } from "@ant-design/icons";
import { generatePDF, createPdfContent } from './utils'; // Import from utils.js
import DemandModal from "./Modal/DemandModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from 'recharts';

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
    navigate("/chat-page");
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

  const formatter = new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
  
  const dataForBarChart = [
    { 
      name: 'Potential Saving', 
      Savings: annualSavingResponse?.annual_savings || 0, 
      formattedSavings: formatter.format(annualSavingResponse?.annual_savings || 0) 
    },
    { 
      name: `Industry Benchmark\nSaving`, // Add newline for better formatting
      Savings: annualSavingResponse?.average_savings || 0, 
      formattedSavings: formatter.format(annualSavingResponse?.average_savings || 0) 
    }
  ];  
  
  const dataForTariffComparison = [
    { name: 'Your Electricity Tariff', Tarrif: annualSavingResponse?.electricity_tariff || 0 },
    { name: 'Potential RE Tariff', Tarrif: annualSavingResponse?.potential_re_tariff || 0 },
  ];

  const dataForSavingsBreakdown = [
    // { name: 'Per Unit Savings', Breakdown: annualSavingResponse?.per_unit_savings_potential || 0 },
    { name: 'ISTS Charges', Breakdown: annualSavingResponse?.ISTS_charges || 0 },
    { name: 'State Charges', Breakdown: annualSavingResponse?.state_charges || 0 },
  ];

  return (
    <div>
      <Spin spinning={loading} tip="Loading...">
        <main style={{ padding: "20px", minHeight: "90vh", position: "relative" }}>
          {/* Infographics Section */}
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px", background: 'white', border: "2px solid #6698005c", width: '100%', paddingTop: '20px', borderRadius: '5px' }}>
            <Col xs={24} sm={12} md={12} lg={8}>
              <Title level={5} style={{ textAlign: 'center', fontSize: '14px' }}>Savings Comparison <span style={{ fontSize: '12px' }}> (INR/kWh)</span></Title>
              <BarChart
                width={Math.min(window.innerWidth * 0.9, 350)}
                height={180} // Reduced height
                data={dataForBarChart}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => value / 10000000} // Convert to single values in crores
                  tick={{ fontSize: 10 }} 
                />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Savings" fill="#669800" />
              </BarChart>
              {/* Add scale indicator below the chart */}
              <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '-15px', color: '#000' }}>
                1 Unit = 1 INR Cr
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8}>
              <Title level={5} style={{ textAlign: 'center', fontSize: '14px' }}>Tariff Comparison <span style={{ fontSize: '12px' }}> (INR/kWh)</span></Title>
              <LineChart
                width={Math.min(window.innerWidth * 0.9, 350)}
                height={180}
                data={dataForTariffComparison}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Tarrif" stroke="#669800" strokeDasharray="5 5" />
              </LineChart>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8}>
              <Title level={5} style={{ textAlign: 'center', fontSize: '14px' }}>Regulatory Charges
              <span style={{ fontSize: '12px' }}> (INR/kWh)</span></Title>
              <BarChart
                width={Math.min(window.innerWidth * 0.9, 400)}
                height={180}
                data={dataForSavingsBreakdown}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Breakdown" fill="#669800" />
              </BarChart>
            </Col>
          </Row>

          {/* Annual Savings Report Section */}
          <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <div style={{ backgroundColor: "white", padding: "20px", border: "2px solid #6698005c", borderRadius: "5px", width: '100%' }}>
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
                          Contracted Demand
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px', color: '#9a8406', cursor: 'pointer' }} onMouseEnter={showRequirementModal}>
                         : {annualSavingResponse ? annualSavingResponse.contracted_demand : "0"}<span style={{ fontSize: '14px' }}> MW</span>
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Potential Savings</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                         : {annualSavingResponse ? annualSavingResponse.annual_savings.toLocaleString('en-IN') : "N/A"}
                          <span style={{ fontSize: '14px' }}> INR</span>
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Average Savings (For your Industry Category) </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                          : {annualSavingResponse ? annualSavingResponse.average_savings.toLocaleString('en-IN') : "0"}<span style={{ fontSize: '14px' }}> INR/kWh</span>
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '16px' }}>Potential RE Replacement</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '20px' }}>
                         : {annualSavingResponse ? annualSavingResponse.re_replacement : "0"}%
                        </Text>
                      </Col>
                    </Row>
                    <Row justify="center" style={{ marginTop: "20px" }} gutter={[16, 16]}>
                      <Col style={{ marginRight: "10px" }}>
                        <Button
                          type="primary"
                          onClick={() => generatePDF(createPdfContent(annualSavingResponse), requirementId)}
                          icon={<FileTextOutlined />}
                          style={{ fontSize: "16px", width: "180px", padding: "5px" }}
                        >
                          Download Report
                        </Button>
                      </Col>
                      <Col>
                        {status === "active" ? (
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

                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Continue Button */}
          <Row justify="center" style={{ marginTop: "20px" }}>

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