import React from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { ThunderboltOutlined, DashboardOutlined, GlobalOutlined, ApartmentOutlined } from '@ant-design/icons'; // Updated icons
import { useNavigate } from 'react-router-dom'; 
import CountUp from 'react-countup'; 

const WhatWeOffer = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/consumer/requirement');
    };

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
                    {/* Total IPPs */}
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
                                value={120}
                                prefix={<ThunderboltOutlined />} // Lightning icon for energy producers
                                valueStyle={{ color: '#3f8600' }}
                                formatter={() => <CountUp start={80} end={120} duration={3} />}
                            />
                        </Card>
                    </Col>

                    {/* Total Capacity */}
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
                                value={5000}
                                prefix={<DashboardOutlined />} // Dashboard icon for capacity or performance
                                suffix="MW"
                                valueStyle={{ color: '#cf1322' }}
                                formatter={() => <CountUp start={4700} end={5000} duration={3} />}
                            />
                        </Card>
                    </Col>

                    {/* States Covered */}
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
                                value={28}
                                prefix={<ApartmentOutlined />} // Globe icon for states covered
                                valueStyle={{ color: '#1890ff' }}
                                formatter={() => <CountUp start={10} end={28} duration={3} />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* "Do You Know" Section */}
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2 style={{ fontSize: '2rem', color: '#9A8406' }}>Did You Know?</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
                    The total amount consumers have saved <span style={{ fontWeight: 'bold', color: '#669800' }}>₹12,50,000 annually!</span>
                  
                    </p>
                </div>

                {/* Buttons Section */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <h6 style={{ fontSize: '1.4rem', color: '#9A8406', marginBottom: '20px' }}>
                        Start Your Journey With Us
                    </h6>
                    <Button
                        type="default"
                        style={{ padding: '10px 20px', fontSize: '1rem', borderColor: '#E6E8F1' }}
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WhatWeOffer;
