import React from 'react';
import { Layout, Menu } from 'antd';
import { menuItems } from './MenuItems';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  return (
    <Sider
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={collapsed ? 80 : 250}  // Adjust the width based on the collapsed state
      style={{
        display: isMobile ? 'none' : 'block',
        borderRight: `1px solid #E6E8F1`,
        transition: 'all 0.3s', // Smooth transition when expanding or collapsing
      }}
      className="sider-desktop"
    >
      <div className="logo" style={{ color: 'white', padding: '16px', textAlign: 'center', fontSize: '18px' }}>
        Menu
      </div>
      <Menu mode="inline" items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
