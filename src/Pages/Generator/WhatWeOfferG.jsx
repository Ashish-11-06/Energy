import React, { useState }  from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { ThunderboltOutlined, BranchesOutlined, ApartmentOutlined } from '@ant-design/icons';
import CountUp from 'react-countup'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const WhatWeOfferG = () => {

    const navigate = useNavigate(); // Initialize useNavigate

    // Handle opening the modal and navigating to the next page
    const handleContinue = () => {
      navigate('/generator/portfolio'); // Navigate to the desired route
    };

    // Handle closing the modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div
            style={{
                padding: '0px 50px',
                backgroundColor: '#F5F6FB', // Page background
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // height: '100vh',
                color: 'black', // Text color for better contrast
                marginTop: '20px'
            }}
        >
            <div
                style={{
     
                    backgroundColor: '#F5F6FB',
                background: 'linear-gradient(to right, #F5F6FB ,#c4d4a5)', // Linear gradient from primary to link color
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '30px', color: '#669800' }}>
                    What We Offer
                </h1>
                <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '40px', color: '#9A8406' }}>
                    Explore our key metrics that highlight the strength of our services and coverage:
                </p>

                <Row gutter={16} justify="center">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            title="Total Consumers"
                            bordered={false}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent card background
                                borderRadius: '10px',
                                border: `1px solid #E6E8F1`, // Stroke/border color
                            }}
                        >
                            <Statistic
                                title="Total Consumers"
                                value={100} // Directly use the number
                                prefix={<ThunderboltOutlined />}
                                suffix={'+'}
                                valueStyle={{ color: '#3f8600' }}
                                formatter={() => <CountUp start={80} end={100} duration={3} />} // Use formatter to render CountUp
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
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent card background
                                borderRadius: '10px',
                                border: `1px solid #E6E8F1`, // Stroke/border color
                            }}
                        >
                            <Statistic
                                title="Total Demands"
                                value={5000} // Directly use the number
                                prefix={<BranchesOutlined />}
                                suffix={'+'}
                                valueStyle={{ color: '#cf1322' }}
                                formatter={() => <CountUp start={4700} end={5000} duration={3} />} // Use formatter to render CountUp
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
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent card background
                                borderRadius: '10px',
                                border: `1px solid #E6E8F1`, // Stroke/border color
                            }}
                        >
                            <Statistic
                                title="Total States"
                                value={28} // Directly use the number
                                prefix={<ApartmentOutlined />}
                                suffix={'+'}
                                valueStyle={{ color: '#1890ff' }}
                                formatter={() => <CountUp start={10} end={28} duration={3} />} // Use formatter to render CountUp
                            />
                        </Card>
                    </Col>
                </Row>

                {/* "Do you know" section */}
                {/* <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2 style={{ fontSize: '2rem', color: '#9A8406' }}>Do you know?</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
                        The total amount consumers have saved: <span style={{ fontWeight: 'bold', color: '#669800' }}>$1,250,000</span>
                    </p>
                </div> */}

                {/* Buttons Section */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button type="primary" style={{ marginRight: '20px', padding: '10px 20px', fontSize: '1rem', backgroundColor: '#669800', borderColor: '#669800' }}>
                        Explore
                    </Button>
                    <Button type="default" style={{ padding: '10px 20px', fontSize: '1rem', borderColor: '#E6E8F1' }}
                   onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WhatWeOfferG;
