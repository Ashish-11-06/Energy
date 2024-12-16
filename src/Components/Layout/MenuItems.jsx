import React from 'react';
import { Link } from 'react-router-dom';
import { BarChartOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

export const consumerMenuItems = [
  { key: '3', icon: <BarChartOutlined />, label: <Link to="/consumer/what-we-offer">What We Offer</Link> },
  { key: '4', icon: <BarChartOutlined />, label: <Link to="/consumer/matching-ipp">Matching IPP</Link> },
  { key: '5', icon: <BarChartOutlined />, label: <Link to="/consumer/chat-page">Chat with Expert</Link> },
  { key: '6', icon: <BarChartOutlined />, label: <Link to="/consumer/consumption-pattern">Consumption Pattern</Link> },
  { key: '7', icon: <BarChartOutlined />, label: <Link to="/consumer/project-details">Project Details</Link> },
  { key: '8', icon: <BarChartOutlined />, label: <Link to="/consumer/requirenment">Requirements</Link> },
  { key: '9', icon: <BarChartOutlined />, label: <Link to="/consumer/annual-saving">Annual Savings</Link> },
  { key: '10', icon: <BarChartOutlined />, label: <Link to="/consumer/subscription-plan">Subscription Plans</Link> },
];

export const generatorMenuItems = [
  { key: '11', icon: <DeploymentUnitOutlined />, label: <Link to="/generator/what-we-offer">What We Offer</Link> },
  { key: '12', icon: <DeploymentUnitOutlined />, label: <Link to="/generator/portfolio">Portfolio</Link> },
  { key: '13', icon: <DeploymentUnitOutlined />, label: <Link to="/generator/matching-consumer">Matching Consumer</Link> },
  { key: '14', icon: <DeploymentUnitOutlined />, label: <Link to="/generator/subscription-plan">Subscription Plans</Link> },
  { key: '15', icon: <DeploymentUnitOutlined />, label: <Link to="/generator/energy-optimization">Energy Optimization</Link> },
];
