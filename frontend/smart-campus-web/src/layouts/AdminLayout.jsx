import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/adminNav/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminNavbar />
      <main style={{ paddingTop: "84px", minHeight: "100vh", background: "#eef3f9" }}>
        <Outlet />
      </main>
    </div>
  );
}
