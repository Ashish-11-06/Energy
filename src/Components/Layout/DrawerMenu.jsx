import React from 'react';
import { Drawer, Menu } from 'antd';
import { menuItems } from './MenuItems';

const DrawerMenu = ({ drawerVisible, toggleDrawer }) => (
  <Drawer
    title="Menu"
    placement="left"
    closable
    onClose={toggleDrawer}
    open={drawerVisible}
    styles={{ body: { padding: 0 } }}
  >
    <Menu theme="light" mode="inline" items={menuItems} />
  </Drawer>
);

export default DrawerMenu;
