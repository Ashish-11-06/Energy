import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  SolutionOutlined,
  TeamOutlined,
  FileTextOutlined,
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

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const consumerMenuItems = [
    { label: 'Dashboard', key: '/consumer/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Consumption Units', key: '/consumer/requirement', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Transaction Window', key: '/consumer/transaction-page', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Offers', key: '/offers', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Subscription Plan', key: '/consumer/subscription-plan', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Invoice', key: '/consumer/invoice', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Profile', key: '/consumer/profile', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },
  ];

  const generatorMenuItems = [
    { label: 'Dashboard', key: '/generator/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Portfolio', key: '/generator/portfolio', icon: <SolutionOutlined /> },
    { label: 'Transaction Window', key: '/generator/transaction', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Matching Consumer', key: '/generator/matching-consumer', icon: <TeamOutlined /> },
    { label: 'Proposed Offers', key: '/generator/requested-ipp-gen', icon: <AppstoreAddOutlined /> },
    { label: 'Consumer Requests', key: '/generator/consumer-requests', icon: <AppstoreAddOutlined /> },
    { label: 'Update Profile Details', key: '/generator/update-profile-details', icon: <FileTextOutlined /> },
    { label: 'Subscription Plan', key: '/generator/subscription-plan', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Chatbot', key: '/generator/chat-page', icon: <img src={chat} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Profile', key: '/generator/profile', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },
  ];

  const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  useEffect(() => {
    // Update selectedKey whenever the location changes
    setSelectedKey(location.pathname);
  }, [location.pathname]);

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
          trigger={null}
        >
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '21px',
              textAlign: 'center',
              fontSize: '18px',
              backgroundColor: '#6698005c',
              height: '70px',
            }}
          >
            Menu
          </div>
          <Menu mode="inline" selectedKeys={[selectedKey]}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.key)}>
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
            <Menu mode="inline" selectedKeys={[selectedKey]}>
              {menuItems.map((item) => (
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
