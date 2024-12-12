import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const NavBar = ({ }) => {
  const location = useLocation();

const username = 'consumer';

  const menuItems = [
    // {
    //   key: '1',
    //   label: (
    //     <Link to="/what-we-offer" style={{ color: location.pathname === '/what-we-offer' ? '#fff' : '#9A8406', fontFamily: 'Inter' }}>
    //       What We Offer
    //     </Link>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: (
    //     <Link to="/chat-page" style={{ color: location.pathname === '/chat-page' ? '#fff' : '#9A8406', fontFamily: 'Inter' }}>
    //       Chat with Expert
    //     </Link>
    //   ),
    // },
    // {
    //   key: '3',
    //   label: (
    //     <Link to="/consumption-pattern" style={{ color: location.pathname === '/consumption-pattern' ? '#fff' : '#9A8406', fontFamily: 'Inter' }}>
    //       Consumption Pattern
    //     </Link>
    //   ),
    // },
    {
      key: '4',
      label: (
        <Link to="/login" style={{ color: location.pathname === '/login' ? '#fff' : '#9A8406', fontFamily: 'Inter' }}>
          Login
        </Link>
      ),
    },
    {
      key: '5',
      label: (
        <Text style={{ color: '#fff', fontFamily: 'Inter' }}>
          Welcome, {username || 'Guest'}
        </Text>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: '#F5F6FB' }}>
      <Header
        style={{
          background: '#c4d4a5',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 10,
        }}
      >
       
        <Menu
          mode="horizontal"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#c4d4a5',
            borderColor: '#E6E8F1',
            fontFamily: 'Inter',
          }}
          items={menuItems}
        />
      </Header>
    </Layout>
  );
};

export default NavBar;
