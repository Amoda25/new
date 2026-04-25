import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const stats = [
    { label: "Resources", value: "24", icon: "🏢", link: "/admin/resources", className: "resources-card" },
    { label: "Bookings", value: "12", icon: "📅", link: "/admin/bookings", className: "bookings-card" },
    { label: "Open Tickets", value: "8", icon: "🎫", link: "/admin/tickets", className: "tickets-card" },
  ];

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Command Center</h1>
        <p>Overview of campus operations and management.</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.className}`}>
            <span className="stat-icon">{s.icon}</span>
            <h3 className="stat-label">{s.label}</h3>
            <p className="stat-value">{s.value}</p>
            <Link to={s.link} className="manage-link">Manage {s.label} →</Link>
          </div>
        ))}
      </div>

      <div className="quick-actions-panel">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/resources" className="action-btn">Add Resource</Link>
          <Link to="/admin/bookings" className="action-btn">Review Bookings</Link>
          <Link to="/admin/tickets" className="action-btn">View Tickets</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;