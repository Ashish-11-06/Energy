import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/Navbar'; // Adjust the path as needed
import './Layout.css'; // Optional: Add styles for your layout

const Layout = () => {
  return (
    <div className="layout-container">
      {/* Header/Navbar */}
      <NavBar />

      {/* Main content */}
      <div className="layout-content">
        <Outlet /> {/* Renders the child routes */}
      </div>

      {/* Optional Footer */}
      <footer className="layout-footer">
        <p>© 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
