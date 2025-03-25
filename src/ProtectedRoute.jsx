/* eslint-disable no-unused-vars */
import { message, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

const ProtectedRoute = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsModalVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsModalVisible(false);
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Modal
        title="Access Denied"
        open={isModalVisible}
        onCancel={handleClose}
        onOk={handleClose}
      >
        <p>You are not logged in. Please login to access this page.</p>
      </Modal>
      {isAuthenticated() && <Outlet />}
    </>
  );
};

export default ProtectedRoute;
