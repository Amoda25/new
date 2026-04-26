import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import NotificationBell from "../notifications/NotificationBell"; 

export default function AdminNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <Link to="/admin/dashboard">Admin Panel</Link>
      </div>

      <div className="admin-navbar-links">
        <Link className={pathname === "/admin/dashboard" ? "active" : ""} to="/admin/dashboard">
          Dashboard
        </Link>
        <Link className={pathname.includes("/admin/resources") ? "active" : ""} to="/admin/resources">
          Resources
        </Link>
        <Link className={pathname.includes("/admin/bookings") ? "active" : ""} to="/admin/bookings">
          Bookings
        </Link>
        <Link className={pathname.includes("/admin/tickets") ? "active" : ""} to="/admin/tickets">
          Tickets
        </Link>
        <NotificationBell />
        <button className="logout-btn" onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>
          Logout
        </button>
      </div>
      
    </nav>
  );
}
