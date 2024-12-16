import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: <Link to="/landing-page">Landing Page</Link>,
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: <Link to="/login">Login</Link>,
  },
  {
    key: 'sub1',
    icon: <BarChartOutlined />,
    label: 'Consumer',
    children: [
      { key: '3', label: <Link to="/what-we-offer">What We Offer</Link> },
      { key: '4', label: <Link to="/matching-ipp">Matching IPP</Link> },
      { key: '5', label: <Link to="/chat-page">Chat with Expert</Link> },
      { key: '6', label: <Link to="/consumption-pattern">Consumption Pattern</Link> },
      { key: '7', label: <Link to="/project-details">Project Details</Link> },
      { key: '8', label: <Link to="/consumer/requirenment">Requirements</Link> },
      { key: '9', label: <Link to="/consumer/annual-saving">Annual Savings</Link> },
      { key: '10', label: <Link to="/consumer/subscription-plan">Subscription Plans</Link> },
    ],
  },
  {
    key: 'sub2',
    icon: <DeploymentUnitOutlined />,
    label: 'Generator',
    children: [
      { key: '11', label: <Link to="/generator/what-we-offer">What We Offer</Link> },
      { key: '12', label: <Link to="/generator/portfolio">Portfolio</Link> },
      { key: '13', label: <Link to="/generator/matching-consumer">Matching Consumer</Link> },
      { key: '14', label: <Link to="/generator/subscription-plan">Subscription Plans</Link> },
      { key: '15', label: <Link to="/generator/energy-optimization">Energy Optimization</Link> },
    ],
  },
];
