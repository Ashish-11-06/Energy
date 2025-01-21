import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Button, Drawer, message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
  NotificationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// Define menu items for consumer and generator
const consumerMenuItems = [
  { label: 'Dashboard', key: '/consumer/dashboard', icon: <DashboardOutlined /> },
  { label: 'Requirement', key: '/consumer/requirement', icon: <FormOutlined /> },
  { label: 'What We Offer', key: '/consumer/what-we-offer', icon: <AppstoreAddOutlined /> },
  { label: 'Transaction Window', key: '/consumer/transaction-page', icon: <MessageOutlined /> },
  { label: 'Matching IPP', key: '/consumer/matching-ipp', icon: <SolutionOutlined /> },
  { label:'Offer Sent', key: '/consumer/requested-ipp', icon: <AppstoreAddOutlined /> },
  { label: 'Offer Recieved', key: '/consumer/offer-recieved-from-ipp', icon: <AppstoreAddOutlined /> },
  { label: 'Chatbot', key: '/consumer/chat-page', icon: <MessageOutlined /> },
  { label: 'Energy Consumption Table', key: '/consumer/energy-consumption-table', icon: <TableOutlined /> },
  { label: 'Consumption Pattern', key: '/consumer/consumption-pattern', icon: <AreaChartOutlined /> },
  { label: 'Annual Saving', key: '/consumer/annual-saving', icon: <WalletOutlined /> },
  { label: 'Subscription Plan', key: '/consumer/subscription-plan', icon: <TeamOutlined /> },
  { label: 'Profile', key: '/consumer/profile', icon: <UserOutlined /> },
];

const generatorMenuItems = [
  { label: 'Dashboard', key: '/generator/dashboard', icon: <DashboardOutlined /> },
  { label: 'Portfolio', key: '/generator/portfolio', icon: <SolutionOutlined /> },
  { label: 'Transaction Window', key: '/generator/transaction', icon: <SolutionOutlined /> },
  { label: 'Matching Consumer', key: '/generator/matching-consumer', icon: <TeamOutlined /> },
  { label: 'proposed offers', key: '/generator/requested-ipp-gen', icon: <AppstoreAddOutlined /> },
  { label: 'consumer requests', key: '/generator/consumer-requests', icon: <AppstoreAddOutlined /> },
  // { label: 'Energy Optimization', key: '/generator/energy-optimization', icon: <ControlOutlined /> },
  { label: 'Update Profile Details', key: '/generator/update-profile-details', icon: <FileTextOutlined /> },
  { label: 'Subscription Plan', key: '/generator/subscription-plan', icon: <WalletOutlined /> },
  { label: 'Chatbot', key: '/generator/chat-page', icon: <MessageOutlined /> },
  { label: 'Profile', key: '/generator/profile', icon: <NotificationOutlined /> },
];

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  // Show notifications dynamically between 2 PM and 3 PM IST
  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const istTime = now.toLocaleString('en-US', options);
    const istDate = new Date(istTime);
    const hours = istDate.getHours();

    if (hours === 12) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [menuType]);

  // Add notifications dynamically if required
  const menuWithNotification = showNotification
    ? [
        ...menuItems.slice(0, 2),
        { label: 'Notification', key: menuType === 'consumer' ? '/consumer/notification' : '/generator/notificationgen', icon: <NotificationOutlined /> },
        ...menuItems.slice(2),
      ]
    : menuItems;

  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const closeDrawerAndNavigate = (url) => {
    setDrawerVisible(false);
    navigate(url);
  };

  return (
    <>
      {!isMobile ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250}
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: '#f5f6fb',
            zIndex: 100,
            overflowY: 'auto',
          }}
          trigger={null} // Remove the default trigger
        >
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '21px',
              textAlign: 'center',
              fontSize: '18px',
              backgroundColor: '#6698005c',
              height: '100px',
            }}
          >
            Menu
          </div>
          <Menu mode="inline">
            {menuWithNotification.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      ) : (
        <>
          <Button
            type="primary"
            onClick={handleDrawerToggle}
            style={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 101,
            }}
          >
            Menu
          </Button>
          <Drawer
            title="Navigation"
            placement="left"
            onClose={handleDrawerToggle}
            visible={isDrawerVisible}
            bodyStyle={{
              padding: 0,
              backgroundColor: '#f5f6fb',
            }}
          >
            <Menu mode="inline">
              {menuWithNotification.map((item) => (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={() => closeDrawerAndNavigate(item.key)}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </Drawer>
        </>
      )}
    </>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Sidebar;
