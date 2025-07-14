import React from 'react';
import { Drawer, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { consumerMenuItems, generatorMenuItems } from './MenuItems';
import { decryptData } from '../../Utils/cryptoHelper';

const DrawerMenu = ({ drawerVisible, toggleDrawer }) => {
  const location = useLocation();
  // const user = JSON.parse(localStorage.getItem('user')).user;
  const userData = decryptData(localStorage.getItem('user'));
  const user= userData?.user;
  const user_category = user?.user_category;
  // Determine menu type based on URL
  // const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';

  // Select menu items based on the type
  const menuItems = user_category === 'Consumer' ? consumerMenuItems : generatorMenuItems;
// console.log("Menu items ",menuItems);

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
