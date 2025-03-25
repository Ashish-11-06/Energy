import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? React.createElement(Outlet, null) : React.createElement(Navigate, { to: "/", replace: true });
};

export default ProtectedRoute;