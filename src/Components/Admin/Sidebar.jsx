/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Badge, Layout, Menu, Button, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, connectOfferSocket } from '../../Redux/Slices/notificationSlice';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import subscriptionImg from '../../assets/subscription.png';
import consumption from '../../assets/consumption.png';
import invoice from '../../assets/invoice.png';
import profile from '../../assets/profile.png';
import offerSend from '../../assets/offerSend.png';
import portfolio from '../../assets/portfolio.png';
import findConsumer from '../../assets/findConsumer.png';
import { decryptData } from '../../Utils/cryptoHelper';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const dispatch = useDispatch();
  const offerCount = useSelector((state) => state.notifications.offerCount);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const userData = decryptData(localStorage.getItem('user'));
  const user = userData?.user;
  // const user = JSON.parse(localStorage.getItem('user')).user;

    const subscription=decryptData(localStorage.getItem("subscriptionPlanValidity"));
  const user_category = user?.user_category;
  const is_new_user = user?.is_new_user;
  const subscription_type = subscription?.subscription_type;

  const company = user?.company || 'Company';

  const menuType = user_category === 'Consumer' ? 'consumer' : 'generator';

  useEffect(() => {
    const userId = user?.id;
    dispatch(connectWebSocket(userId));
    dispatch(connectOfferSocket(userId));
  }, [dispatch, user]);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const lastMenuItem = subscription_type === 'PRO'
    ? {
        label: 'PowerX',
        key: is_new_user
          ? '/px/what-we-offer'
          : menuType === 'consumer'
          ? '/px/consumer/dashboard'
          : '/px/generator/dashboard',
      }
    : { label: '', key: '/' };

  const menuItems = [
    {
      label: 'Dashboard',
      key: '/admin/dashboard',
      icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} />,
    },
    {
      label: 'Consumer',
      key: '/admin/consumer',
      icon: <img src={portfolio} alt="" style={{ width: '20px', height: '20px' }} />,
    },
    {
      label: 'Generator',
      key: '/admin/generator',
      icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} />,
    },
    {
      label: 'Subscription',
      key: '/admin/subscription',
      icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} />,
      children: [
        { label: 'Online Subscription', key: '/admin/subscription/online' },
        { label: 'Offline Subscription', key: '/admin/subscription/offline' },
      ],
    },
    {
      label: 'Notification',
      key: '/admin/notification',
      icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} />,
    },
    {
      label: 'Help',
      key: '/admin/help',
      icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} />,
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const closeDrawerAndNavigate = (url) => {
    setDrawerVisible(false);
    navigate(url);
  };

  const renderMenuItems = (items) =>
    items.map((item) =>
      item.children ? (
        <SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key}>
              <Link to={child.key}>{child.label}</Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ) : (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.key}>{item.label}</Link>
        </Menu.Item>
      )
    );

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
          }}
          trigger={null}
        >
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '20px',
              textAlign: 'center',
              fontSize: '18px',
              backgroundColor: '#6698005c',
              height: '70px',
            }}
          ></div>

          <Menu mode="inline" selectedKeys={[selectedKey]}>
            {renderMenuItems(menuItems)}
          </Menu>

          {subscription_type === 'PRO' && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                width: '80%',
                backgroundColor: 'rgb(102, 152, 0)',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '40px',
                borderRadius: '10px',
              }}
            >
              <Button type="primary" href={lastMenuItem.key} block>
                {lastMenuItem.label}
              </Button>
            </div>
          )}
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
            <p style={{ color: '#669800' }}>
              <strong>{company.toUpperCase()}</strong>
            </p>
          </Button>

          <Drawer
            title="Navigation"
            placement="left"
            onClose={handleDrawerToggle}
            open={isDrawerVisible}
            bodyStyle={{ padding: 0, backgroundColor: '#f5f6fb' }}
          >
            <Menu mode="inline" selectedKeys={[selectedKey]}>
              {menuItems.map((item) =>
                item.children ? (
                  <SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map((child) => (
                      <Menu.Item
                        key={child.key}
                        onClick={() => closeDrawerAndNavigate(child.key)}
                      >
                        {child.label}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={() => closeDrawerAndNavigate(item.key)}
                  >
                    {item.label}
                  </Menu.Item>
                )
              )}
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
