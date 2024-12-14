import React from 'react';
import { Button, Row, Col, Card, Statistic } from 'antd';
import { ThunderboltOutlined, BranchesOutlined, ApartmentOutlined } from '@ant-design/icons';
import CountUp from 'react-countup'; 
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Background video section */}
      <div className="video-container">
        <video
          className="background-video"
          src="https://www.w3schools.com/html/movie.mp4" // Replace with your video URL
          autoPlay
          muted
          loop
        />
        <div className="content">
          <Row justify="center" align="middle" style={{ height: '100%' }}>
            <Col xs={24} md={12}>
              <div className="text-content">
                <h1>Welcome to Our Website</h1>
                <p>Empowering consumers and businesses with reliable energy solutions.</p>
                <Button type="primary" size="large" className="cta-button">
                  Get Started
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* What We Offer Section */}
      <div
        style={{
          padding: '50px 20px',
          backgroundColor: '#F5F6FB',
          background: 'linear-gradient(to right, #F5F6FB, #c4d4a5)',
        }}
      >
        <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '30px', color: '#669800' }}>
          What We Offer
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '40px', color: '#9A8406' }}>
          Explore our key metrics that highlight the strength of our services:
        </p>

        <Row gutter={16} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title="Total Consumers"
              bordered={false}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                border: `1px solid #E6E8F1`,
              }}
            >
              <Statistic
                title="Total Consumers"
                value={100}
                prefix={<ThunderboltOutlined />}
                suffix={'+'}
                valueStyle={{ color: '#3f8600' }}
                formatter={() => <CountUp start={80} end={100} duration={3} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title="Total Demands"
              bordered={false}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                border: `1px solid #E6E8F1`,
              }}
            >
              <Statistic
                title="Total Demands"
                value={5000}
                prefix={<BranchesOutlined />}
                suffix={'+'}
                valueStyle={{ color: '#cf1322' }}
                formatter={() => <CountUp start={4700} end={5000} duration={3} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title="Total States"
              bordered={false}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                border: `1px solid #E6E8F1`,
              }}
            >
              <Statistic
                title="Total States"
                value={28}
                prefix={<ApartmentOutlined />}
                suffix={'+'}
                valueStyle={{ color: '#1890ff' }}
                formatter={() => <CountUp start={10} end={28} duration={3} />}
              />
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button type="primary" style={{ marginRight: '20px', padding: '10px 20px', fontSize: '1rem' }}>
            Explore
          </Button>
          <Button type="default" style={{ padding: '10px 20px', fontSize: '1rem' }}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
