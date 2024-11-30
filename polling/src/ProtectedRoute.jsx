import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Replace with your authentication check logic

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login page if not authenticated
  }

  return <Outlet />; // Render the nested routes if authenticated
};

export default ProtectedRoute;
