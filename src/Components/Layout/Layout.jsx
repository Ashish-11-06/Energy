import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import DrawerMenu from './DrawerMenu';
import HeaderComponent from './HeaderComponent';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const sidebarWidth = collapsed ? 80 : 250; // Adjust sidebar width based on collapsed state

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for larger screens */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          style={{
            width: sidebarWidth,
            position: 'fixed', // Fix sidebar position
            height: '100%',
            zIndex: 10, // Ensure sidebar appears above content
          }}
        />
      )}

      {/* Drawer for smaller screens */}
      {isMobile && <DrawerMenu drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />}

      {/* Layout for Header and Content */}
      <Layout
        style={{
          marginLeft: !isMobile ? sidebarWidth : 0, // Push content to the right when sidebar is visible
          transition: 'margin-left 0.2s', // Smooth transition when collapsing or expanding the sidebar
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: '0 16px',
            // display: 'flex',
            alignItems: 'center',
            backgroundColor: '#6698005c',
            position: 'sticky',
            top: 0,
            zIndex: 1000, // Ensure header is above sidebar and content
            height:'70px'
          }}
        >
          <HeaderComponent
            isMobile={isMobile}
            drawerVisible={drawerVisible}
            toggleDrawer={toggleDrawer}
          />
        </Header>

        {/* Content */}
        <Content style={{  }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
