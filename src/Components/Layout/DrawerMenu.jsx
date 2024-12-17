import React from 'react';
import { Drawer, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { consumerMenuItems, generatorMenuItems } from './MenuItems';

const DrawerMenu = ({ drawerVisible, toggleDrawer }) => {
  const location = useLocation();

  // Determine menu type based on URL
  const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';

  // Select menu items based on the type
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  return (
    <Drawer
      title="Menu"
      placement="left"
      closable
      onClose={toggleDrawer}
      open={drawerVisible}
      contentStyle={{ padding: 0 }} // Updated for Ant Design v5
    >
      <Menu theme="light" mode="inline" items={menuItems} />
    </Drawer>
  );
};

export default DrawerMenu;
