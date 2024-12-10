import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const NavBar = ({ username }) => {
  // Define the menu items
  const menuItems = [
    {
      key: '1',
      label: (
        <Link to="/about" style={{ color: '#9A8406', fontFamily: 'Inter' }}>
          About Us
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to="/contact" style={{ color: '#9A8406', fontFamily: 'Inter' }}>
          Contact Us
        </Link>
      ),
    },
    {
      key: '3',
      label: (
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Inter',
          }}
        >
          Welcome, {username}
        </Text>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: '#F5F6FB' }}>
      <Header
        style={{
          background: '#c4d4a5', // Updated primary color
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 10,
        }}
      >
        <div
          className="logo"
          style={{
            float: 'left',
            color: '#fff',
            fontSize: '24px',
            fontFamily: 'Inter',
          }}
        >
          <Text strong style={{ color: '#fff', fontFamily: 'Inter' }}>
            MyApp
          </Text>
        </div>

        <Menu
          mode="horizontal"
        //   theme="dark"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#c4d4a5',
            borderColor: '#E6E8F1', // Stroke/border color
            fontFamily: 'Inter',
          }}
          items={menuItems} // Use the items prop instead of children
        />
      </Header>
    </Layout>
  );
};

export default NavBar;
