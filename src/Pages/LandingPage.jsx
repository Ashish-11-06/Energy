import React, { useState } from 'react';
import { Button, Radio, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import video from '../assets/vecteezy_solar-panels-and-wind-turbines-green-energy-concept_6299246.mp4';
// import logo from '../assets/EXG.png'; // Import the logo image
import { useDispatch } from 'react-redux';
import { setLoginType } from '../Redux/actions';
import LoginComponent from '../Components/Login/login';

const LandingPage = () => {
  const [selection, setSelection] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectionChange = (e) => {
    const selectedType = e.target.value;
    dispatch(setLoginType(selectedType));
    setSelection(selectedType);
    localStorage.setItem('userType', selectedType);
  };

  const handleButtonClick = () => {
    if (selection) {
      if (selection === 'consumer') {
        navigate('/consumer/login', { state: { use_category: 'Consumer' } });
      } else if (selection === 'generator') {
        navigate('/generator/login', { state: { use_category: 'Generator' } });
      }
    } else {
      message.warning('Please select Consumer or Generator');
    }
  };

  return (
    <div className="landing-page">
      {/* Background Video */}
      <div className="video-container">
        <video className="background-video" src={video} autoPlay muted loop />
        
        {/* Logo at the top left */}
        {/* <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div> */}

        {/* Key Features on Left Side */}
        <div className="key-features">
          <h2>Key Features</h2>
          <ul>
            <li>Reliable and Sustainable Energy</li>
            <li>Cost-Effective Solutions</li>
            <li>24/7 Support and Monitoring</li>
            <li>Easy Integration with Existing Systems</li>
            <li>Customizable Energy Plans</li>
          </ul>
        </div>

        <div className="text-content">
          <h1>EXT</h1>
          <p>Empowering consumers and businesses with reliable energy solutions.</p>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="right-content-bg">
        <div style={{ width: '100%' }}>
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
