import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useLocation, Link } from 'react-router-dom';
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

// Define menu items for consumer and generator with icons
const consumerMenuItems = [
  { label: 'Dashboard', key: '/consumer/dashboard', icon: <DashboardOutlined /> },
  { label: 'Requirenment', key: '/consumer/requirenment', icon: <FormOutlined /> },
  { label: 'What We Offer', key: '/consumer/what-we-offer', icon: <AppstoreAddOutlined /> },
  { label: 'Matching IPP', key: '/consumer/matching-ipp', icon: <SolutionOutlined /> },
  { label: 'Requested IPP', key: '/consumer/requested-ipp', icon: <AppstoreAddOutlined  /> },
  { label: 'Chat with Expert', key: '/consumer/chat-page', icon: <MessageOutlined /> },
  { label: 'Energy Consumption Form', key: '/consumer/energy-consumption-form', icon: <FormOutlined /> },
  { label: 'Energy Consumption Table', key: '/consumer/energy-consumption-table', icon: <TableOutlined /> },
  { label: 'Consumption Pattern', key: '/consumer/consumption-pattern', icon: <AreaChartOutlined /> },
  { label: 'Annual Saving', key: '/consumer/annual-saving', icon: <WalletOutlined /> },
  { label: 'Subscription Plan', key: '/consumer/subscription-plan', icon: <TeamOutlined /> },
  { label: 'Profile', key: '/consumer/profile', icon: <UserOutlined /> },
];

// Generator menu items
const generatorMenuItems = [
  { label: 'Dashboard', key: '/generator/dashboard', icon: <DashboardOutlined /> },
  { label: 'What We Offer', key: '/generator/what-we-offer', icon: <AppstoreAddOutlined /> },
  { label: 'Portfolio', key: '/generator/portfolio', icon: <SolutionOutlined /> },
  { label: 'Matching Consumer', key: '/generator/matching-consumer', icon: <TeamOutlined /> },
  { label: 'Energy Optimization', key: '/generator/energy-optimization', icon: <ControlOutlined /> },
  { label: 'Update Profile Details', key: '/generator/update-profile-details', icon: <FileTextOutlined /> },
  { label: 'Subscription Plan', key: '/generator/subscription-plan', icon: <WalletOutlined /> },
  { label: 'Chat with Expert', key: '/generator/chat-page', icon: <MessageOutlined /> },
  { label: 'Profile', key: '/generator/profile', icon: <NotificationOutlined /> },
];

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);

  // Determine menu type based on URL
  const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';
  const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

  // Function to check time and show notification between 2pm and 3pm IST
  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata' }; 
    const istTime = now.toLocaleString('en-US', options); 
    const istDate = new Date(istTime); 
    const hours = istDate.getHours();

    if (hours === 20) {  // Checking if time is between 2pm and 3pm IST
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, []);  

  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const closeDrawerAndNavigate = (url) => {
    setDrawerVisible(false);
    window.location.href = url;  // Using window.location.href for redirecting
  };

  // Add notification item dynamically below "Requirenment" in the consumer menu
  const menuWithNotification = showNotification ? [
    ...menuItems.slice(0, 2),
    { label: 'Notification', key: '/consumer/notification', icon: <NotificationOutlined /> },
    ...menuItems.slice(2),
  ] : menuItems;

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
            overflowY: 'auto', // Make the sidebar scrollable
          }}
        >
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '21px',
              textAlign: 'center',
              fontSize: '18px',
              backgroundColor: '#6698005c',
              height:'100px',
            }}
          >
            Menu
          </div>
          <Menu mode="inline">
            {menuWithNotification.map(item => (
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
              {menuWithNotification.map(item => {
                return (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={() => closeDrawerAndNavigate(item.key)} // Close drawer and navigate
                  >
                    {item.label}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Sidebar;



// import React from 'react';
// import { Layout, Menu } from 'antd';
// import { useLocation } from 'react-router-dom';
// import { consumerMenuItems, generatorMenuItems } from './MenuItems';

// const { Sider } = Layout;

// const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
//   const location = useLocation();

//   // Determine menu type based on URL
//   const menuType = location.pathname.startsWith('/consumer') ? 'consumer' : 'generator';

//   // Select menu items based on the type
//   const menuItems = menuType === 'consumer' ? consumerMenuItems : generatorMenuItems;

//   return (
//     <Sider
//       breakpoint="lg"
//       collapsible
//       collapsed={collapsed}
//       onCollapse={(value) => setCollapsed(value)}
//       width={collapsed ? 80 : 250} // Adjust the width based on the collapsed state
//       trigger={null} // Remove the Sider trigger
//       style={{
//         position: 'fixed', // Fix the sider in place
//         top: 0, // Keep it at the top of the screen
//         left: 0, // Position it on the left
//         height: '100vh', // Ensure it spans the full height of the viewport
//         backgroundColor: '#f5f6fb', // Background color for the sider
//         transition: 'all 0.3s', // Smooth transition for collapse/expand
//         display: isMobile ? 'none' : 'block', // Hide on mobile
//         zIndex: 100, // Ensure it stays above other elements
//       }}
//       className="sider-desktop"
//     >
//       <div
//         className="logo"
//         style={{
//           color: 'white',
//           padding: '21px',
//           textAlign: 'center',
//           fontSize: '18px',
//           backgroundColor: '#6698005c',
//         }}
//       >
//         Menu
//       </div>
//       <Menu mode="inline" items={menuItems} />
//     </Sider>
//   );
// };

// export default Sidebar;
