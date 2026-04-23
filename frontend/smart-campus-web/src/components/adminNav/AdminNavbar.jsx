import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminNavbar.css";
import NotificationBell from "../notifications/NotificationBell"; 

export default function AdminNavbar() {
  const { pathname } = useLocation();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <Link to="/admin/dashboard">Admin Panel</Link>
      </div>

      <div className="admin-navbar-links">
        <Link className={pathname.includes("/admin/dashboard") ? "active" : ""} to="/admin/dashboard">
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
        <Link className={pathname.includes("/admin/users") ? "active" : ""} to="/admin/users">
          Users
        </Link>
        <NotificationBell />
      </div>
      
    </nav>
  );
}