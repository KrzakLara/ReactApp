import React from "react";
//LO4: Navigate components from react-router-dom confirm React Router usage:
import { Navigate } from "react-router-dom";

//LO3: SPA Application Evidence:Redirects unauthenticated users to /login.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token exists, redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
