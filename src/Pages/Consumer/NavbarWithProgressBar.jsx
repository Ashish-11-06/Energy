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
            <span className="icon-label"><strong>Requirements</strong> </span>
            <div className="icon-circle" style={{marginRight:'35px'}}>
              <UserOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label"><strong>Matching IPP</strong> </span>
            <div className="icon-circle">
              <HomeOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label"><strong>Payment(Subscription-Plan)</strong> </span>
            <div className="icon-circle">
              <FileTextOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label"><strong>Updated Unit</strong></span>
            <div className="icon-circle">
              <BookOutlined />
            </div>
          </div>
          <div className="icon-container">
            <span className="icon-label"><strong>Optimized IPP</strong></span>
            <div className="icon-circle" style={{marginLeft:'35px'}}>
              <WalletOutlined />
            </div>
          </div>
          {/* <div className="icon-container">
            <span className="icon-label">Hostel Details</span>
            <div className="icon-circle" style={{marginLeft:'35px'}}>
              <CheckCircleOutlined />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NavbarWithProgressBar;
