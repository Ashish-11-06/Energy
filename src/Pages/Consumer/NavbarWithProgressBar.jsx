import React from 'react';
import { UserOutlined, HomeOutlined, BookOutlined, FileTextOutlined, WalletOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './NavbarWithProgressBar.css';

const NavbarWithProgressBar = () => {
  return (
    <div className="navbar">
      <div className="progress-container">
        <div className="horizontal-line"></div>
        <div className="progress-icons">
          <div className="icon-container">
            <span className="icon-label">Personal Info</span>
            <div className="icon-circle">
              <UserOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label">Address</span>
            <div className="icon-circle">
              <HomeOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label">Other Info</span>
            <div className="icon-circle">
              <FileTextOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label">Current Course</span>
            <div className="icon-circle">
              <BookOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label">Qualification</span>
            <div className="icon-circle">
              <WalletOutlined />
            </div>
          </div>
          {/* <div className="icon-container">
            <span className="icon-label">Hostel Details</span>
            <div className="icon-circle">
              <CheckCircleOutlined />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NavbarWithProgressBar;
