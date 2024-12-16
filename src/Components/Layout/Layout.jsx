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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for larger screens */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        style={{ zIndex: 0 }} // Ensure sidebar is below the header
      />

      {/* Drawer for smaller screens */}
      <DrawerMenu drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />

      {/* Layout for Header and Content */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'black',
            position: 'sticky',
            top: 0,
            zIndex: 1000, // Ensure header is above sidebar and content
          }}
        >
          <HeaderComponent
            isMobile={isMobile}
            drawerVisible={drawerVisible}
            toggleDrawer={toggleDrawer}
          />
        </Header>

        {/* Content */}
        <Content style={{ padding: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
