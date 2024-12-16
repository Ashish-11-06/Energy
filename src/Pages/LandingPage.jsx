  import React, { useState } from 'react';
  import { Button, Row, Col, Radio, Space, message } from 'antd'; // Space added to group radio buttons more neatly
  import { useNavigate } from 'react-router-dom'; // Import useNavigate
  import './LandingPage.css';
  import video from '../assets/vecteezy_solar-panels-and-wind-turbines-green-energy-concept_6299246.mp4';

  const LandingPage = () => {
    const [selection, setSelection] = useState(''); // State to manage radio selection
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleSelectionChange = (e) => {
      setSelection(e.target.value); // Update selection when radio button is changed
    };

    const handleButtonClick = () => {
      if (selection) {
        // Navigate to the respective page based on the selection
        if (selection === 'consumer') {
          navigate('/consumer/login'); // Navigate to consumer login page
        } else if (selection === 'generator') {
          navigate('/generator/login'); // Navigate to generator login page
        }
      } else {
        message.warning("Please select Consumer or Generator");
      }
    };

    return (
      <div className="landing-page">
        {/* Background video section */}
        <div className="video-container">
          <video
            className="background-video"
            src={video}
            autoPlay
            muted
            loop
          />
          <div className="content">
            <Row justify="center" align="middle" style={{ height: '100%' }}>
              <Col xs={24} md={12}>
                <div className="text-content">
                  <h1 >EXG</h1>
                  <p >Empowering consumers and businesses with reliable energy solutions.</p>
                  
                  {/* Radio buttons for Consumer and Generator selection */}
                  <Space direction="vertical">
                    <Radio.Group onChange={handleSelectionChange} value={selection} size="large">
                      <Radio value="consumer">Consumer</Radio>
                      <Radio value="generator">Generator</Radio>
                    </Radio.Group>
                  </Space>

                  {/* Button to proceed based on selection */}
                  <Button 
                    type="primary" 
                    size="large" 
                    className="cta-button"
                    onClick={handleButtonClick}
                    style={{ marginTop: '20px' }}
                  >
                    Get Started
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  };

  export default LandingPage;
