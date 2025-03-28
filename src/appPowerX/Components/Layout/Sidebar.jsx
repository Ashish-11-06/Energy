/* eslint-disable no-unused-vars */
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
  HomeOutlined,
  HomeFilled,
} from '@ant-design/icons';
import dash from '../../../assets/dashboard.png';
import transaction from '../../../assets/transaction.png';
import subscription from '../../../assets/subscription.png';
import consumption from '../../../assets/consumption.png';
import invoice from '../../../assets/invoice.png';
import profile from '../../../assets/profile.png';
import chat from '../../../assets/chat.png';
import notification from '../../../assets/notification.png';
import offerSend from '../../../assets/offerSend.png';
import notificationImg from '../../../assets/notification.png';
import portfolio from '../../../assets/portfolio.png';
import trade from '../../assets/trade.png';
import home from '../../assets/home.png';
const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const user = JSON.parse(localStorage.getItem('user')).user;
  const user_category = user?.user_category;

  const consumerMenuItems = [
    { label: 'Dashboard', key: '/px/consumer/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Forecast Day Ahead', key: '/px/consumer/day-ahead', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Forecast Month Ahead', key: '/px/consumer/month-ahead', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Plan Your Trade', key: '/px/consumer/planning', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Trade', key: '/px/consumer/trading', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }} /> },
    // { label: 'Subscription Plan', key: '/px/consumer/powerx-subscription', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Track Status', key: '/px/track-status', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },
  ];

  const generatorMenuItems = [
    { label: 'Dashboard', key: '/px/generator/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Forecast Day Ahead', key: '/px/generator/day-ahead', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Forecast Month Ahead', key: '/px/generator/month-ahead', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Plan Your Trade', key: '/px/generator/planning', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Trade', key: '/px/generator/trading', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Track Status', key: '/px/track-status', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },

  ];

  const menuType = user_category === 'Consumer' ? 'consumer' : 'generator';
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
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // Added shadow
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
              <Menu.Item key={item.key} icon={item.icon} style={{ marginBottom: '20px' }}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
          <Button
      type="primary"
      onClick={() => navigate(`/${user_category}/dashboard`)}
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: "80%",
        backgroundColor: "#669800",
        borderColor: "#669800",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Centers the content
        gap: "8px", // Adds space between icon and text
        height: "40px", // Ensures consistent height
      }}
    >
      <HomeFilled style={{  fontSize: "18px", color: "white", height: "20px",marginRight:"5px" }} />
      <span style={{ fontSize: "18px", lineHeight: "20px", color: "white" }}>EXT</span>
    </Button>
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
                  style={{ marginBottom: '10px' }}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
            <Button
              type="primary"
              onClick={() => navigate('/ext')}
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                width: '80%',
                backgroundColor: '#669800',
                borderColor: '#669800',
              }}
            >
              Go to EXT
            </Button>
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