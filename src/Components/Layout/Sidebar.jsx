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
        display: isMobile ? 'none' : 'block',
        transition: 'all 0.3s', // Smooth transition when expanding or collapsing
      }}
      className="sider-desktop"
    >
      <div className="logo" style={{ color: 'white', padding: '21px', textAlign: 'center', fontSize: '18px' }}>
        Menu
      </div>
      <Menu mode="inline" items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
