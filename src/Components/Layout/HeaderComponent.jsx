import React from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import NavbarWithProgressBar from '../../Pages/Consumer/NavbarWithProgressBar';
import { useSelector } from 'react-redux';
import './HeaderComponent.css'; // Add custom styles for header component

const { Header } = Layout;

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => {
  // Use useSelector to get the loginType from the Redux store
  const loginType = useSelector((state) => state.login?.loginType);

  return (
    <Header
      className="header-component"
      style={{
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between', // Space between drawer button and content
        alignItems: 'center',
        backgroundColor: '#fff', // White background for the header
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Subtle shadow for better separation
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Drawer button visible on mobile */}
      {isMobile && (
        <Button
          icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleDrawer}
          style={{ marginRight: '16px', display: 'inline-flex', alignItems: 'center' }}
        />
      )}

      {/* Header Content */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center', // Center align the content for better aesthetics
        }}
      >
        {loginType === 'consumer' ? (
          <div className="navbar-container" style={{ width: '100%' }}>
            <NavbarWithProgressBar />
          </div>
        ) : (
          <h1 style={{ margin: 0, fontSize: '20px', color: '#669800' }}>EXG</h1>
        )}
      </div>

      {/* Optionally, add user profile or other content to the header */}
    
    </Header>
  );
};

export default HeaderComponent;
