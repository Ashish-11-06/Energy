import React from 'react';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  SolutionOutlined,
  MessageOutlined,
  FormOutlined,
  TableOutlined,
  AreaChartOutlined,
  WalletOutlined,
  TeamOutlined,
  ControlOutlined,
  FileTextOutlined,
  UserOutlined,
  ProfileOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

// Define menu items for consumer and generator with icons
export const consumerMenuItems = [
  { key: '3', icon: <DashboardOutlined />, label: <Link to="/consumer/dashboard">Dashboard</Link> },
  { key: '4', icon: <AppstoreAddOutlined />, label: <Link to="/consumer/what-we-offer">What We Offer</Link> },
  { key: '5', icon: <SolutionOutlined />, label: <Link to="/consumer/matching-ipp">Matching IPP</Link> },
  { key: '6', icon: <MessageOutlined />, label: <Link to="/consumer/chat-page">Chat with Expert</Link> },
  { key: '7', icon: <FormOutlined />, label: <Link to="/consumer/energy-consumption-form">Energy Consumption Form</Link> },
  { key: '8', icon: <TableOutlined />, label: <Link to="/consumer/energy-consumption-table">Energy Consumption Table</Link> },
  { key: '9', icon: <AreaChartOutlined />, label: <Link to="/consumer/consumption-pattern">Consumption Pattern</Link> },
  { key: '10', icon: <WalletOutlined />, label: <Link to="/consumer/annual-saving">Annual Saving</Link> },
  { key: '11', icon: <FormOutlined />, label: <Link to="/consumer/requirement">requirement</Link> },
  { key: '12', icon: <TeamOutlined />, label: <Link to="/consumer/subscription-plan">Subscription Plan</Link> },
  { key: '13', icon: <UserOutlined />, label: <Link to="/consumer/profile">Profile</Link> }
];

export const generatorMenuItems = [
  { key: '14', icon: <DashboardOutlined />, label: <Link to="/generator/dashboard">Dashboard</Link> },
  { key: '15', icon: <AppstoreAddOutlined />, label: <Link to="/generator/what-we-offer">What We Offer</Link> },
  { key: '16', icon: <SolutionOutlined />, label: <Link to="/generator/portfolio">Portfolio</Link> },
  { key: '17', icon: <TeamOutlined />, label: <Link to="/generator/matching-consumer">Matching Consumer</Link> },
  { key: '18', icon: <ControlOutlined />, label: <Link to="/generator/energy-optimization">Energy Optimization</Link> },
  { key: '19', icon: <FileTextOutlined />, label: <Link to="/generator/update-profile-details">Update Profile Details</Link> },
  { key: '20', icon: <WalletOutlined />, label: <Link to="/generator/subscription-plan">Subscription Plan</Link> },
  { key: '21', icon: <MessageOutlined />, label: <Link to="/generator/chat-page">Chat with Expert</Link> },
  { key: '22', icon: <ThunderboltOutlined />, label: <Link to="/generator/profile">Profile</Link> }
];
