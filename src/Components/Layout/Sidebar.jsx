import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { consumerMenuItems, generatorMenuItems } from './MenuItems';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();

  // Determine menu type based on URL
  const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';

  // Select menu items based on the type
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  return (
    <Sider
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={collapsed ? 80 : 250} // Adjust the width based on the collapsed state
      trigger={null} // Remove the Sider trigger
      style={{
        position: 'fixed', // Fix the sider in place
        top: 0, // Keep it at the top of the screen
        left: 0, // Position it on the left
        height: '100vh', // Ensure it spans the full height of the viewport
        backgroundColor: '#f5f6fb', // Background color for the sider
        transition: 'all 0.3s', // Smooth transition for collapse/expand
        display: isMobile ? 'none' : 'block', // Hide on mobile
        zIndex: 100, // Ensure it stays above other elements
      }}
      className="sider-desktop"
    >
      <div
        className="logo"
        style={{
          color: 'white',
          padding: '21px',
          textAlign: 'center',
          fontSize: '18px',
          backgroundColor: '#6698005c',
        }}
      >
        Menu
      </div>
      <Menu mode="inline" items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
