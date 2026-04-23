import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./UserNavbar.css";
import NotificationBell from "../notifications/NotificationBell"; 

export default function UserNavbar() {
  const { pathname } = useLocation();

  return (
    <nav className="user-navbar">
      <Link to="/user/home" className="user-navbar-brand">
        <div className="user-navbar-brand-icon">
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.9" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="#7dc8ff" opacity="0.5" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="#00d4ff" opacity="0.9" />
          </svg>
        </div>

        <span>
          Smart <span className="brand-word-campus">Campus</span>
        </span>

        <div className="nav-live-dot" />
      </Link>

      <div className="user-navbar-links">
        <Link
          className={pathname.startsWith("/user/resources") ? "active" : ""}
          to="/user/resources"
        >
          Resources
        </Link>

        <Link
          className={pathname.startsWith("/user/bookings") ? "active" : ""}
          to="/user/bookings"
        >
          My Bookings
        </Link>

        <Link
          className={
            pathname.startsWith("/user/tickets") && !pathname.includes("/create")
              ? "active"
              : ""
          }
          to="/user/tickets"
        >
          My Tickets
        </Link>

        <Link
          className={pathname.startsWith("/user/tickets/create") ? "active" : ""}
          to="/user/tickets/create"
        >
          Create Ticket
        </Link>

        <Link
          className={pathname.startsWith("/user/profile") ? "active" : ""}
          to="/user/profile"
        >
          Profile
        </Link>

        <NotificationBell />
      </div>
    </nav>
  );
}