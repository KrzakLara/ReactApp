import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
//LO3: SPA Application Evidence:erifies if a user is an admin and redirects them to /home if they are not.
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.email === "admin@email.com"; 
    return isAdmin ? children : <Navigate to="/home" />;
  } catch (error) {
    console.error("Invalid token:", error);
    //This redirect happens without a full page reload, a hallmark of an SPA.
    return <Navigate to="/login" />;
  }
};

export default AdminProtectedRoute;
