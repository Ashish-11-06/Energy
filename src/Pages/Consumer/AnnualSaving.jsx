import React, { useState, useEffect } from "react";
import { Button, Spin, message, Typography, Col, Row, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchAnnualSaving } from "../../Redux/Slices/Consumer/AnnualSavingSlice";
import { FileTextOutlined } from "@ant-design/icons";
import { generatePDF, createPdfContent } from './utils';
import DemandModal from "./Modal/DemandModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

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
      name: `Industry Benchmark\nSaving`,
      Savings: annualSavingResponse?.average_savings || 0,
      formattedSavings: formatter.format(annualSavingResponse?.average_savings || 0)
    }
  ];

  const dataForTariffComparison = [
    { name: 'Electricity Tariff', Tarrif: annualSavingResponse?.electricity_tariff || 0 },
    { name: 'Potential RE Tariff', Tarrif: annualSavingResponse?.potential_re_tariff || 0 },
    { name: 'per unit savings Potential', Tarrif: annualSavingResponse?.per_unit_savings_potential || 0 }
  ];

  const dataForSavingsBreakdown = [
    { name: 'ISTS Charges', Breakdown: annualSavingResponse?.ISTS_charges || 0 },
    { name: 'State Charges', Breakdown: annualSavingResponse?.state_charges || 0 },
  ];

  return ( 
    <div style={{ padding: "10px" }}>
      <Spin spinning={loading} tip="Loading...">
        <main style={{ minHeight: "90vh", position: "relative" }}>
          {/* Infographics Section - Compact Horizontal Layout */}
<Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px", background: 'white', border: "2px solid #6698005c", width: '100%', padding: '15px 10px', borderRadius: '5px' }}>
  {/* Savings Comparison Chart */}
  <Col xs={24} sm={24} md={8} lg={8} style={{ padding: '0 5px' }}>
    <Title level={5} style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
      Savings Comparison <span style={{ fontSize: '12px' }}> (INR in Cr)</span>
    </Title>
    <div style={{ width: '100%', height: '180px' }}> {/* Reduced height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataForBarChart}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={0}
            height={30} // Reduced height
          />
          <YAxis 
            tickFormatter={(value) => value / 10000000} 
            tick={{ fontSize: 9 }} // Smaller font
            width={50} // Reduced width
          />
          <RechartsTooltip 
            formatter={(value) => [formatter.format(value), 'Savings']}
            contentStyle={{ fontSize: '12px' }} // Smaller tooltip
          />
          <Bar 
            dataKey="Savings" 
            fill="#669800" 
            barSize={35} // Slightly reduced but still prominent
            radius={[3, 3, 0, 0]} // Smaller radius
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Col>

  {/* Tariff Comparison Chart */}
  <Col xs={24} sm={24} md={8} lg={8} style={{ padding: '0 5px' }}>
    <Title level={5} style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
      Tariff Comparison <span style={{ fontSize: '12px' }}> (INR/kWh)</span>
    </Title>
    <div style={{ width: '100%', height: '180px' }}> {/* Same height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataForTariffComparison}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={0}
            height={30} // Consistent height
          />
          <YAxis 
            tick={{ fontSize: 9 }} 
            width={40} 
          />
          <RechartsTooltip contentStyle={{ fontSize: '12px' }}/>
          <Bar 
            dataKey="Tarrif" 
            fill="#669800" 
            barSize={35} // Consistent bar size
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Col>

  {/* Regulatory Charges Chart */}
  <Col xs={24} sm={24} md={8} lg={8} style={{ padding: '0 5px' }}>
    <Title level={5} style={{ textAlign: 'center', fontSize: '14px', marginBottom: '8px' }}>
      Regulatory Charges <span style={{ fontSize: '12px' }}> (INR/kWh)</span>
    </Title>
    <div style={{ width: '100%', height: '180px' }}> {/* Same height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataForSavingsBreakdown}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          barCategoryGap="40%" // More space for just 2 bars
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            interval={0}
            height={30}
          />
          <YAxis 
            tick={{ fontSize: 9 }} 
            width={40}
          />
          <RechartsTooltip contentStyle={{ fontSize: '12px' }}/>
          <Bar 
            dataKey="Breakdown" 
            fill="#669800" 
            barSize={40} // Slightly larger for only 2 bars
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Col>
</Row>

          {/* Annual Savings Report Section */}
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} sm={24} md={24} lg={20} xl={18}>
              <div style={{
                backgroundColor: "white",
                padding: "15px",
                border: "2px solid #6698005c",
                borderRadius: "5px",
                width: '100%'
              }}>
                {error ? (
                  <div style={{ color: "red", fontSize: "16px", textAlign: 'center' }}>Error: {error}</div>
                ) : (
                  <div>
                    <Title level={2} style={{ fontSize: '20px', marginBottom: '15px', textAlign: 'center' }}>
                      Annual Savings Report
                    </Title>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '14px', color: '#9a8406', cursor: 'pointer' }} onClick={showRequirementModal}>
                          Contracted Demand
                        </Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '16px', color: '#9a8406' }}>
                          : {annualSavingResponse ? annualSavingResponse.contracted_demand : "0"}<span style={{ fontSize: '12px' }}> MW</span>
                        </Text>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '14px' }}>Potential Savings</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '16px' }}>
                          : {annualSavingResponse && annualSavingResponse.annual_savings
                            ? (annualSavingResponse.annual_savings / 10000000).toLocaleString('en-IN')
                            : "N/A"}
                          <span style={{ fontSize: '12px' }}> Cr </span>
                        </Text>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '14px' }}>Average Savings (For your Industry Category)</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '16px' }}>
                          : {annualSavingResponse && annualSavingResponse.average_savings !== 0
                            ? annualSavingResponse.average_savings.toLocaleString('en-IN')
                            : "-"}
                          <span style={{ fontSize: '12px' }}> INR</span>
                        </Text>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Text strong style={{ fontSize: '14px' }}>Potential RE Replacement</Text>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Text style={{ fontSize: '16px' }}>
                          : {annualSavingResponse ? annualSavingResponse.re_replacement : "0"}%
                        </Text>
                      </Col>
                    </Row>

                    <Row justify="center" style={{ marginTop: "20px" }} gutter={[16, 16]}>
                      <Col xs={12} sm={8} md={6} lg={4}>
                        <Button
                          type="primary"
                          onClick={() => generatePDF(createPdfContent(annualSavingResponse), requirementId)}
                          icon={<FileTextOutlined />}
                          style={{ fontSize: "14px", width: "100%", padding: "5px" }}
                          block
                        >
                          Download
                        </Button>
                      </Col>
                      <Col xs={12} sm={8} md={6} lg={4}>
                        {status === "active" ? (
                          <Tooltip title="Please click to proceed">
                            <Button
                              type="primary"
                              style={{
                                backgroundColor: "#669800",
                                borderColor: "#669800",
                                fontSize: "14px",
                                width: "100%",
                              }}
                              onClick={handleContinue}
                              block
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
                                fontSize: "14px",
                                width: "100%",
                              }}
                              onClick={handleContinue}
                              block
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