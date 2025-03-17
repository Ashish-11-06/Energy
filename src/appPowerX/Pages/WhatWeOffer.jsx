/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Button, Spin } from 'antd';
import { ThunderboltOutlined, DashboardOutlined, ApartmentOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import map from '../../assets/map.png';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FaRupeeSign } from 'react-icons/fa';
import EXGLogo from '../../assets/EXG.png';
import TermsAndConditionModal from './Modal/TermsAndConditionModal';

const WhatWeOfferP = () => {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [count, setCount] = useState(0);
  const [targetAmount, setTargetAmount] = useState(1000000); // Example target amount

  const user_category = 'Consumer'; // Example user category

  const handleContinue = () => {
    setIsModal(true);
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString('en-IN');
  };

  return (
    <div
      style={{
        padding: '90px 100px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
        height: '100vh',
        background: 'linear-gradient(to right, rgba(168, 191, 92, 0.57), rgb(196 212 165 / 15%))',
      }}
    >
      <div className="logo-container">
        <img src={EXGLogo} alt="EXG Logo" className="exg-logo" />
      </div>
      <div
        style={{
          backgroundColor: '#F5F6FB',
          background: 'linear-gradient(to right, #F5F6FB ,#c4d4a5)',
          padding: '60px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          height: '78vh',
          width: '100%'
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
                  title="Total projects"
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
                    value={100} // Example value
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    formatter={() => <CountUp start={0} end={100} duration={3} />}
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
                    value={200} // Example value
                    prefix={<DashboardOutlined />}
                    suffix="MW"
                    valueStyle={{ color: '#cf1322' }}
                    formatter={() => <CountUp start={0} end={200} duration={3} />}
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
                    value={300} // Example value
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    formatter={() => <CountUp start={0} end={300} duration={3} />}
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
                    value={400} // Example value
                    prefix={<LineChartOutlined />}
                    suffix="MW"
                    valueStyle={{ color: '#cf1322' }}
                    formatter={() => <CountUp start={0} end={400} duration={3} />}
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
                value={10} // Example value
                prefix={<img src={map} alt="map" className="map" style={{ width: 40, height: 40 }} />}
                valueStyle={{ color: '#1890ff' }}
                formatter={() => <CountUp start={0} end={10} duration={3} />}
              />
            </Card>
          </Col>
        </Row>

        {user_category === 'Consumer' && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ fontSize: '2rem', color: '#9A8406' }}>Did You Know?</h2>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              style={{ fontSize: '3rem', fontWeight: 'bold', color: '#669800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontSize: '3rem', marginRight: '5px' }}>INR</span>
              <CountUp
                start={0}
                end={targetAmount}
                duration={3}
                separator=","
              />
            </motion.div>
            <p className="mt-2 text-lg font-medium">saved annually by our consumers!</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <h6 style={{ fontSize: '1.4rem', color: '#9A8406', marginBottom: '20px' }}>
            Start Your Transition Journey
          </h6>
          <Button
            type="default"
            style={{ padding: '10px 20px', height: '40px', marginBottom: '-120px', fontSize: '24px', borderColor: '#E6E8F1', marginLeft: '90%' }}
            onClick={handleContinue}
          >
            Proceed {`>>`}
          </Button>
        </div>
      </div>
      <TermsAndConditionModal visible={isModal} user_category={user_category} onCancel={() => setIsModal(false)} />
    </div>
  );
};

export default WhatWeOfferP;
