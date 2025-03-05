/* eslint-disable no-unused-vars */
import React from "react";
import { Menu } from "antd";

const Sidebar = () => {
  const menuItems = [
    {
      key: '1',
      label: 'Dashboard',
    },
    {
      key: '2',
      label: 'Reports',
    },
  ];

  return (
    <aside>
      <Menu items={menuItems} />
    </aside>
  );
};

export default Sidebar;
