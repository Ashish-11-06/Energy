import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRouteAdmin = ({ children }) => {
  const user = localStorage.getItem("user");
// console.log('user',user);

  const isAuthenticated = !!user && user !== "undefined" && user !== "null";
// console.log('isAuth',isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRouteAdmin;
