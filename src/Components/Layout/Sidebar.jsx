/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, connectOfferSocket } from '../../Redux/Slices/notificationSlice';
import PropTypes from 'prop-types';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import subscriptionImg from '../../assets/subscription.png';
import consumption from '../../assets/consumption.png';
import invoice from '../../assets/invoice.png';
import profile from '../../assets/profile.png';
import offerSend from '../../assets/offerSend.png';
import portfolio from '../../assets/portfolio.png';
import findConsumer from '../../assets/findConsumer.png';
const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const dispatch = useDispatch();
  const offerCount = useSelector((state) => state.notifications.offerCount);
  // const notificationCount = 9;
  const subscription = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const subscription_type = subscription?.subscription_type;
  // console.log(subscription_type);
  // console.log(subscription);

  // console.log(notificationCount);

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const user = JSON.parse(localStorage.getItem('user')).user;
  const user_category = user?.user_category;
  const is_new_user = user?.is_new_user;
  // console.log(is_new_user);

  useEffect(() => {
    // Dispatch the thunk to connect to the WebSocket
    const userId = user?.id;
    dispatch(connectWebSocket(userId));
    dispatch(connectOfferSocket(userId));

  }, [dispatch, user]);

  const consumerMenuItems = [
    { label: 'Dashboard', key: '/consumer/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Consumption Units', key: '/consumer/requirement', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Matching IPP', key: '/consumer/matching-ipp', icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} /> },

    { label: 'Transaction Window', key: '/transaction-page', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    {
      label: (<span>Offers</span>),
      key: '/offers',
      icon: (
        <Badge
          style={{
            transform: 'translate(50%, -50%)',
            minWidth: '15px',
            height: '15px'
          }}
          count={offerCount}
          overflowCount={5}
        >
          <img src={offerSend} alt="Offers" style={{ width: '20px', height: '20px' }} />
        </Badge>
      )
    },
    { label: 'Subscription Plan', key: '/subscription-plan', icon: <img src={subscriptionImg} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Invoice', key: '/invoice', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} /> },
    // {
    //   label: (<span>Notification</span>),
    //   key: '/consumer/notification',
    //   icon: (
    //     <Badge
    //       style={{
    //         transform: 'translate(50%, -50%)',
    //         minWidth: '15px',
    //         height: '15px'
    //       }}
    //       count={notificationCount}
    //       overflowCount={5}
    //     >
    //       <img
    //         src={notificationImg}
    //         alt="Notification"
    //         style={{ width: '20px', height: '20px' }}
    //       />
    //     </Badge>
    //   )
    // },

    { label: 'Profile', key: '/consumer/profile', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },
    // { label: 'Track Status', key: '/consumer/status', icon: <img src={track} alt="" style={{ width: '20px', height: '20px' }} /> },
  ];
  // console.log(is_new_user);

  const generatorMenuItems = [
    { label: 'Dashboard', key: '/generator/dashboard', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Portfolio', key: '/generator/portfolio', icon: <img src={portfolio} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Find Consumer', key: '/generator/matching-consumer', icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Capacity Sizing', key: '/generator/GeneratorInput', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Transaction Window', key: '/transaction-page', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }} /> },
    // { label: 'Matching Consumer', key: '/generator/matching-consumer', icon: <TeamOutlined /> },
    {
      label: (<span>Offers</span>),
      key: '/offers',
      icon: (
        <Badge
          style={{
            transform: 'translate(50%, -50%)',
            minWidth: '15px',
            height: '15px'
          }}
          count={offerCount}
          overflowCount={5}
        >
          <img src={offerSend} alt="Offers" style={{ width: '20px', height: '20px' }} />
        </Badge>
      )
    },
    // { label: 'Consumer Requests', key: '/generator/consumer-requests', icon: <AppstoreAddOutlined /> },
    // { label: 'Update Profile Details', key: '/generator/update-profile-details', icon: <FileTextOutlined /> },
    { label: 'Subscription Plan', key: '/subscription-plan', icon: <img src={subscriptionImg} alt="" style={{ width: '20px', height: '20px' }} /> },
    { label: 'Invoice', key: '/invoice', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} /> },


    { label: 'Profile', key: '/generator/profile', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }} /> },
    // { label: 'Track Status', key: '/generator/status', icon: <img src={track} alt="" style={{ width: '20px', height: '20px' }} /> },
  ];

  const menuType = user_category === 'Consumer' ? 'consumer' : 'generator';
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  let lastMenuItem = { label: '', key: '/' }; // Fallback value
  if (subscription_type === 'PRO') {
    lastMenuItem = is_new_user 
      ? { label: 'PowerX', key: menuType === 'consumer' ? '/px/what-we-offer' : '/px/what-we-offer' }
      : { label: 'PowerX', key: menuType === 'consumer' ? '/px/consumer/dashboard' : '/px/generator/dashboard' };
  }
  // if (subscription_type === 'PRO') {
    // if (is_new_user == true) {
    //   menuItems.push({ label: 'PowerX', key: menuType === 'consumer' ? '/px/what-we-offer' : '/px/what-we-offer' });
    // } else {
    //   menuItems.push({ label: 'PowerX', key: menuType === 'consumer' ? '/px/consumer/dashboard' : '/px/generator/dashboard' });
    // }
  // }

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
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
          {subscription_type === 'PRO' && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "80%",
              backgroundColor: "rgb(102, 152, 0)",
              borderColor: "rgb(102, 152, 0)",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              height: "40px",
              borderRadius: '10px'
            }}>
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