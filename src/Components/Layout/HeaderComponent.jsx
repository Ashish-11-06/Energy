import React from 'react';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd'; // Import Layout from 'antd'

const { Header } = Layout; // Destructure Header from Layout

const HeaderComponent = ({ isMobile, drawerVisible, toggleDrawer }) => (
  <Header style={{ padding: '0 16px', background: 'transparent', display: 'flex', alignItems: 'center' }}>
    {isMobile && (
      <Button
        icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleDrawer}
        style={{ marginRight: '16px', display: 'inline-flex', alignItems: 'center' }}
      />
    )}
    <h1 style={{ margin: 0, fontSize: '20px', flex: 1, color: '#669800' }}>EXG</h1>
  </Header>
);

export default HeaderComponent;
