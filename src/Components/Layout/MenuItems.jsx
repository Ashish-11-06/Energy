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
import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import subscription from '../../assets/subscription.png';
import consumption from '../../assets/consumption.png';
import invoice from '../../assets/invoice.png';
import profile from '../../assets/profile.png';
import chat from '../../assets/chat.png';
import notification from '../../assets/notification.png';
import offerSend from '../../assets/offerSend.png';


// Define menu items for consumer and generator with icons
export const consumerMenuItems = [
  { key: '1', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/dashboard">Dashboard</Link> },
  { key: '2', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/requirement">Consumption Unit</Link> },
  { key: '3', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/transaction-page">Transaction Window</Link> },
  { key: '4', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/offers">Offers</Link> },
  { key: '5', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/subscription-plan">Subscription Plan</Link> },
  { key: '6', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/consumer/invoice">Invoice</Link> },
  { key: '7', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/consumer/profile">Profile</Link> }
];

export const generatorMenuItems = [
  { key: '8', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/generator/dashboard">Dashboard</Link> },
  { key: '9', icon: <SolutionOutlined style={{color:'#669800', fontWeight:'900', height:'30px',width:'30px'}}/>, label: <Link to="/generator/portfolio">Portfolio</Link> },
  { key: '10', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/transaction-page">Transaction Window</Link> },
  { key: '11', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/offers">Offers</Link> },
  // { key: '17', icon: <TeamOutlined />, label: <Link to="/generator/matching-consumer">Matching Consumer</Link> },
  // { key: '18', icon: <ControlOutlined />, label: <Link to="/generator/energy-optimization">Energy Optimization</Link> },
  // { key: '19', icon: <FileTextOutlined />, label: <Link to="/generator/update-profile-details">Update Profile Details</Link> },
  { key: '12', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/generator/subscription-plan">Subscription Plan</Link> },
  { key: '13', icon: <img src={chat} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/generator/chat-page">Chatbot</Link> },
  { key: '14', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/generator/profile">Profile</Link> }
];
