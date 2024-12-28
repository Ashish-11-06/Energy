import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import './Navbar.css'; // Add custom CSS if needed

const { Sider } = Layout;

const NavbarConsumer = () => {
  return (
    <Sider width={250} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/consumer/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
          <Link to="/consumer/what-we-offer">What We Offer</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FileTextOutlined />}>
          <Link to="/consumer/matching-ipp">Matching IPP</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<FileTextOutlined />}>
          <Link to="/consumer/energy-consumption-form">Energy Consumption</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<FileTextOutlined />}>
          <Link to="/consumer/annual-saving">Annual Savings</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<AppstoreAddOutlined />}>
          <Link to="/consumer/subscription-plan">Subscription Plan</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<PoweroffOutlined />}>
          <Link to="/logout">Logout</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default NavbarConsumer;
