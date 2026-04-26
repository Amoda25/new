import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TechnicianNavbar.css";
import NotificationBell from "../notifications/NotificationBell"; 

export default function TechnicianNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="technician-navbar">
      <Link to="/technician/dashboard" className="technician-navbar-brand">
        <div className="technician-navbar-brand-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.9" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#00d4ff" opacity="0.9" />
          </svg>
        </div>

        <span>
          Technician <span className="brand-word-panel">Panel</span>
        </span>

        <div className="nav-live-dot" />
      </Link>

      <div className="technician-navbar-links">
        <Link
          className={pathname.startsWith("/technician/dashboard") ? "active" : ""}
          to="/technician/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className={pathname.startsWith("/technician/tickets") ? "active" : ""}
          to="/technician/tickets"
        >
          Assigned Tickets
        </Link>
        <NotificationBell />
        <button className="logout-btn" onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>
          Logout
        </button>
      </div>
      
        
      
    </nav>
  );
}
