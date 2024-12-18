import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DashboardOutlined, 
  FormOutlined, 
  MessageOutlined, 
  TeamOutlined, 
  SolutionOutlined, 
  FileDoneOutlined, 
  LineChartOutlined, 
  ProfileOutlined 
} from '@ant-design/icons';

export const consumerMenuItems = [
  { key: '3', icon: <DashboardOutlined />, label: <Link to="/consumer/dashboard">Dashboard</Link> },
  { key: '4', icon: <FormOutlined />, label: <Link to="/consumer/requirenment">Requirements</Link> },
  { key: '5', icon: <MessageOutlined />, label: <Link to="/consumer/chat-page">Chat with Expert</Link> },
  // { key: '6', icon: <LineChartOutlined />, label: <Link to="/consumer/consumption-pattern">Consumption Pattern</Link> },
  // { key: '7', icon: <SolutionOutlined />, label: <Link to="/consumer/project-details">Project Details</Link> },
  // { key: '8', icon: <TeamOutlined />, label: <Link to="/consumer/matching-ipp">Matching IPP</Link> },
  // { key: '9', icon: <FileDoneOutlined />, label: <Link to="/consumer/annual-saving">Annual Savings</Link> },
  { key: '10', icon: <ProfileOutlined />, label: <Link to="/consumer/subscription-plan">Subscription Plans</Link> },
];

export const generatorMenuItems = [
  { key: '11', icon: <SolutionOutlined />, label: <Link to="/generator/what-we-offer">What We Offer</Link> },
  { key: '12', icon: <TeamOutlined />, label: <Link to="/generator/portfolio">Portfolio</Link> },
  { key: '13', icon: <DashboardOutlined />, label: <Link to="/generator/matching-consumer">Matching Consumer</Link> },
  { key: '14', icon: <ProfileOutlined />, label: <Link to="/generator/subscription-plan">Subscription Plans</Link> },
  { key: '15', icon: <LineChartOutlined />, label: <Link to="/generator/energy-optimization">Energy Optimization</Link> },
];
