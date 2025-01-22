import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, message, Spin } from 'antd';
import { ThunderboltOutlined, DashboardOutlined, ApartmentOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import whatWeOffer from '../../Redux/api/whatWeOffer';
import { useDispatch } from 'react-redux';

const WhatWeOffer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState(null); // State to store the fetched data

  const user = JSON.parse(localStorage.getItem('user')).user;
  const user_category = user.user_category;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await whatWeOffer.whatWeOffer();
        setData(response.data); // Set the fetched data
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch data from the server.', error);
        message.error('Failed to fetch data from the server.');
      }
    };

    fetchData();
  }, [dispatch]);

  const handleContinue = () => {
    navigate('/consumer/requirement');
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString('en-IN');
  };

  if (!data) {
    return (
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </Row>
    );
  }

  return (
    <div
      style={{
        padding: '20px 50px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
      }}
    >
      <div
        style={{
          backgroundColor: '#F5F6FB',
          background: 'linear-gradient(to right, #F5F6FB ,#c4d4a5)',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '30px', color: '#669800' }}>
          What We Offer
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '40px', color: '#9A8406' }}>
          Discover the core strengths of our services that make us your reliable partner:
        </p>

        <Row gutter={16} justify="center">
          {user_category === 'Consumer' && (
            <>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Card
                  hoverable
                  title="Total IPPs"
                  bordered={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: `1px solid #E6E8F1`,
                    marginTop: `10px`,
                  }}
                >
                  <Statistic
                    value={data.total_portfolios}
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    formatter={() => <CountUp start={0} end={data.total_portfolios} duration={3} />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={8}>
                <Card
                  hoverable
                  title="Total Capacity Available"
                  bordered={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: `1px solid #E6E8F1`,
                    marginTop: `10px`,
                  }}
                >
                  <Statistic
                    value={data.total_available_capacity}
                    prefix={<DashboardOutlined />}
                    suffix="MW"
                    valueStyle={{ color: '#cf1322' }}
                    formatter={() => <CountUp start={0} end={data.total_available_capacity} duration={3} />}
                  />
                </Card>
              </Col>
            </>
          )}

          {user_category === 'Generator' && (
            <>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Card
                  hoverable
                  title="Total Consumers"
                  bordered={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: `1px solid #E6E8F1`,
                    marginTop: `10px`,
                  }}
                >
                  <Statistic
                    value={data.consumer_count}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    formatter={() => <CountUp start={0} end={data.consumer_count} duration={3} />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8} lg={8}>
                <Card
                  hoverable
                  title="Total Demands"
                  bordered={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: `1px solid #E6E8F1`,
                    marginTop: `10px`,
                  }}
                >
                  <Statistic
                    value={data.total_contracted_demand}
                    prefix={<LineChartOutlined />}
                    suffix="MW"
                    valueStyle={{ color: '#cf1322' }}
                    formatter={() => <CountUp start={0} end={data.total_contracted_demand} duration={3} />}
                  />
                </Card>
              </Col>
            </>
          )}

          <Col xs={24} sm={12} md={8} lg={8}>
            <Card
              hoverable
              title="Number of States Covered"
              bordered={false}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                border: `1px solid #E6E8F1`,
                marginTop: `10px`,
              }}
            >
              <Statistic
                value={data.unique_state_count}
                prefix={<ApartmentOutlined />}
                valueStyle={{ color: '#1890ff' }}
                formatter={() => <CountUp start={0} end={data.unique_state_count} duration={3} />}
              />
            </Card>
          </Col>
        </Row>

        {user_category === 'Consumer' && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ fontSize: '2rem', color: '#9A8406' }}>Did You Know?</h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
              The total amount consumers have saved <span style={{ fontWeight: 'bold', color: '#669800' }}>INR {formatNumberWithCommas(data.amount_saved_annually)} annually!</span>
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <h6 style={{ fontSize: '1.4rem', color: '#9A8406', marginBottom: '20px' }}>
            Start Your Transition Journey
          </h6>
          <Button
            type="default"
            style={{ padding: '10px 20px', fontSize: '1rem', borderColor: '#E6E8F1' }}
            onClick={handleContinue}
          >
            Proceed {`>>`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
