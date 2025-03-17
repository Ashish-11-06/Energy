/* eslint-disable no-unused-vars */
import React from 'react'
import { Table, Card, Row, Col, Tooltip, Button, Spin, message, Form, Select, DatePicker, Input, Modal, Checkbox, Radio, Statistic } from 'antd';
import { ThunderboltOutlined, DashboardOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import map from '../assets/map.png';
import { useNavigate } from 'react-router-dom';

const WhatWeOfferP = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')).user;
    const user_category = user?.user_category;
  
  const data = {
    total_portfolios: 10,
    total_available_capacity: 500,
    consumer_count: 200,
    total_contracted_demand: 300,
    unique_state_count: 5,
  };
  const targetAmount = 1000000; // Dummy data
  const isModal = false; // Dummy data
  const handleContinue = () => {
    // Dummy function
    navigate('/px/consumer/plan-trade-page');
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
        <img src="path/to/logo.png" alt="EXG Logo" className="exg-logo" />
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
                  title="Total Executed Trades"
                  bordered={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: `1px solid #E6E8F1`,
                    color:'black',
                    marginTop: `10px`,
                  }}
                >
                  <Statistic
                  value={5}
                    // value={data.total_portfolios}
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ color: 'black' }}
                    formatter={() => <CountUp start={0}
                    end={5}
                    //  end={data.total_portfolios} 
                     duration={3} />}
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
                prefix={<img src={map} alt="map" className="map" style={{ width: 40, height: 40 }} />}
                valueStyle={{ color: '#1890ff' }}
                formatter={() => <CountUp start={0} end={data.unique_state_count} duration={3} />}
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
      <Modal visible={isModal} onCancel={() => console.log('Modal closed')}>
        {/* Modal content */}
      </Modal>
    </div>
  )
}

export default WhatWeOfferP
