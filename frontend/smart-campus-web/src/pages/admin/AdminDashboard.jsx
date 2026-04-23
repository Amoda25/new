import React from "react";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: "2.2rem", color: "#0f172a" }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#475569" }}>
          Welcome to the admin panel.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;