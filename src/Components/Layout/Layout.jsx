import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import DrawerMenu from "./DrawerMenu";
import HeaderComponent from "./HeaderComponent";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaRobot } from "react-icons/fa"; // Chatbot icon

const { Header, Content } = Layout;

const LayoutComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const sidebarWidth = collapsed ? 80 : 250; // Adjust sidebar width based on collapsed state

  // Fetch user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const userType = user?.type; // Assuming user type is stored (consumer/generator)

  const handleChatClick = () => {
    navigate(
      user.user_category === "Consumer"
        ? "/consumer/chat-page"
        : "/generator/chat-page"
    );
  };

  const isChatPage =
  location.pathname === "/consumer/chat-page" ||
  location.pathname === "/generator/chat-page" ||
  location.pathname === "/consumer/energy-consumption-table" ||
  location.pathname === "/generator/energy-consumption-table";

  // const isConsuptionPage =
  // location.pathname === "/consumer/energy-consumption-table" ||
  // location.pathname === "/generator/energy-consumption-table";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          style={{
            width: sidebarWidth,
            position: "fixed", // Fix sidebar position
            height: "100%",
            zIndex: 10, // Ensure sidebar appears above content
          }}
        />
      )}

      {/* Drawer for smaller screens */}
      {isMobile && <DrawerMenu drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />}

      {/* Layout for Header and Content */}
      <Layout
        style={{
          marginLeft: !isMobile ? sidebarWidth : 0, // Push content to the right when sidebar is visible
          transition: "margin-left 0.2s", // Smooth transition when collapsing or expanding the sidebar
        }}
      >
        {/* Header */}
        <Header
          style={{
            alignItems: "center",
            backgroundColor: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000, // Ensure header is above sidebar and content
            height: "70px",
          }}
        >
          <HeaderComponent isMobile={isMobile} drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />
        </Header>

        {/* Content */}
        <Content>
          <Outlet />
        </Content>

        {/* Floating Chatbot Button (Only visible after login) */}
        {user && !isChatPage &&(
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            <button
              onClick={handleChatClick}
              style={{
                color: "#FFFFFF",
                border: "none",
                borderRadius: "50px",
                padding: "12px 18px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <FaRobot style={{ fontSize: "24px", marginRight: "8px" }} />
              <span>Need Assistance?</span>
            </button>
          </div>
        )}
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;



// import React, { useState, useEffect } from 'react';
// import { Layout } from 'antd';
// import Sidebar from './Sidebar';
// import DrawerMenu from './DrawerMenu';
// import HeaderComponent from './HeaderComponent';
// import { Outlet } from 'react-router-dom';
// import MainHeader from './MainHeader';

// const { Header, Content } = Layout;

// const LayoutComponent = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 992);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleDrawer = () => {
//     setDrawerVisible(!drawerVisible);
//   };

//   const sidebarWidth = collapsed ? 80 : 250; // Adjust sidebar width based on collapsed state

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       {/* Sidebar for larger screens */}
//       {!isMobile && (
//         <Sidebar
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           isMobile={isMobile}
//           style={{
//             width: sidebarWidth,
//             position: 'fixed', // Fix sidebar position
//             height: '100%',
//             zIndex: 10, // Ensure sidebar appears above content
//           }}
//         />
//       )}

//       {/* Drawer for smaller screens */}
//       {isMobile && <DrawerMenu drawerVisible={drawerVisible} toggleDrawer={toggleDrawer} />}

//       {/* Layout for Header and Content */}
//       <Layout
//         style={{
//           marginLeft: !isMobile ? sidebarWidth : 0, // Push content to the right when sidebar is visible
//           transition: 'margin-left 0.2s', // Smooth transition when collapsing or expanding the sidebar
//         }}
//       >
//         {/* Header */}
//         <Header
//           style={{
//             // padding: '0 16px',
//             // display: 'flex',
//             alignItems: 'center',
//             backgroundColor: 'white',
//               //  backgroundColor:'#F5F6FB',
//             position: 'sticky',
//             top: 0,
//             zIndex: 1000, // Ensure header is above sidebar and content
//             height:'70px'
//           }}
//         >
//           <HeaderComponent
//             isMobile={isMobile}
//             drawerVisible={drawerVisible}
//             toggleDrawer={toggleDrawer}
//           />
//           {/* <MainHeader 
//            isMobile={isMobile}
//            drawerVisible={drawerVisible}
//            toggleDrawer={toggleDrawer}
//           /> */}
//         </Header>

//         {/* Content */}
//         <Content style={{  }}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default LayoutComponent;
