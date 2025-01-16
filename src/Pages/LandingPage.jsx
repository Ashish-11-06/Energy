import React, { useState } from 'react';
import { Button, Row, Col, Radio, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import video from '../assets/vecteezy_solar-panels-and-wind-turbines-green-energy-concept_6299246.mp4';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setLoginType } from '../Redux/actions'; // Import setLoginType action
import NavbarWithProgressBar from './Consumer/NavbarWithProgressBar';

const LandingPage = () => {
  const [selection, setSelection] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectionChange = (e) => {
    const selectedType = e.target.value;
    dispatch(setLoginType(selectedType)); // Dispatch action to update loginType in Redux
    setSelection(selectedType); // Update local selection state
    localStorage.setItem('userType', selectedType); // Store the selected type in local storage
  };

  const handleButtonClick = () => {
    if (selection) {
      if (selection === 'consumer') {
        navigate('/consumer/login');
      } else if (selection === 'generator') {
        navigate('/generator/login');
      }
    } else {
      message.warning('Please select Consumer or Generator');
    }
  };

  return (
    <div className="landing-page">
      <div className="video-container">
        <video className="background-video" src={video} autoPlay muted loop />
        <div className="content">
          <Row justify="center" align="middle" style={{ height: '100%' }}>
            <Col xs={24} md={12}>
              <div className="text-content">
              <h1>EXG</h1>
                <p>
                  Empowering consumers and businesses with reliable energy solutions.
                </p>

                <Space direction="vertical">
                  <Radio.Group
                    onChange={handleSelectionChange}
                    value={selection}
                    size="large"
                  >
                    <Radio value="consumer">Consumer</Radio>
                    <Radio value="generator">Generator</Radio>
                  </Radio.Group>
                </Space>

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
