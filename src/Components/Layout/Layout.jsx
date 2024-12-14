import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Outlet } from 'react-router-dom';
import { HomeOutlined, UserOutlined, AppstoreAddOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import SideBar from './SideBar'; // Import the responsive navbar component
import HeaderNav from './header'; // Adjust the path as needed
import './Layout.css'; // Optional: Add styles for your layout

const { Header, Sider, Content, Footer } = Layout;

const LayoutPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Side Navbar (Sidebar) */}
      <Sider width={200} className="site-layout-background">
        <SideBar />
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        {/* Header/Navbar */}
        <Header className="header" style={{ background: '#fff', padding: 0 }}>
          <HeaderNav />
        </Header>

        {/* Main content area */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
          }}
        >
          <Outlet /> {/* This renders the matched route content */}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          © 2024 Your Company. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
