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
      <Link to="/admin/dashboard" className="admin-navbar-brand">
        <div className="admin-navbar-brand-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.9" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#00d4ff" opacity="0.9" />
          </svg>
        </div>

        <span>
          Smart <span className="brand-word-campus">Campus</span>
          <span className="admin-badge" style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginLeft: '8px', padding: '2px 6px', background: 'rgba(255, 77, 79, 0.2)', border: '1px solid rgba(255, 77, 79, 0.3)', borderRadius: '4px', color: '#ff4d4f' }}>ADMIN</span>
        </span>

        <div className="nav-live-dot" />
      </Link>

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
        <Link className={pathname.includes("/admin/profile") ? "active" : ""} to="/admin/profile">
          Profile
        </Link>
        <NotificationBell />
        <button className="logout-btn" onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
