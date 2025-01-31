import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerManagement from "./pages/CustomerManagement";
import BillManagement from "./pages/BillManagement";
import BillItemManagement from "./pages/BillItemManagement";
import RegisteredUserDashboard from "./pages/RegisteredUserDashboard";
import CreditCard from "./pages/CreditCard";
import Seller from "./pages/Seller";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import Product from "./pages/Product";
import UpdateInfo from "./pages/UpdateInfo"; 
import "./App.css";
//lo3: router SPA
export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserRole(null);
    navigate("/"); // Redirect to Home
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>My App</h1>
        <div className="nav-buttons">
          {token ? (
            <>
              <button onClick={() => navigate("/customer-management")}>
                Customer Management
              </button>
              <button onClick={() => navigate("/bill-management")}>
                Bill Management
              </button>
              <button onClick={() => navigate("/bill-item-management")}>
                Item Management
              </button>
              <button onClick={() => navigate("/credit-card")}>
                Credit Card
              </button>
              <button onClick={() => navigate("/seller")}>Seller</button>
              <button onClick={() => navigate("/category")}>Category</button>
              <button onClick={() => navigate("/subcategory")}>
                SubCategory
              </button>
              <button onClick={() => navigate("/product")}>Product</button>
              <button onClick={() => navigate("/update-info")}>
                Update Information
              </button>
              <button onClick={handleLogout}>Logout</button>
              <button onClick={() => navigate("/")}>Home</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/customer-management"
            element={<CustomerManagement />}
          />
          <Route path="/bill-management" element={<BillManagement />} />
          <Route
            path="/bill-item-management"
            element={<BillItemManagement />}
          />
          <Route
            path="/registered-dashboard"
            element={<RegisteredUserDashboard />}
          />
          <Route path="/credit-card" element={<CreditCard />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/category" element={<Category />} />
          <Route path="/subcategory" element={<SubCategory />} />
          <Route path="/product" element={<Product />} />
          <Route path="/update-info" element={<UpdateInfo />} />
        </Routes>
      </div>
    </div>
  );
}
