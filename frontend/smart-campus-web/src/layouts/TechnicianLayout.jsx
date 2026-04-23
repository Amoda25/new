import React from "react";
import { Outlet } from "react-router-dom";
import TechnicianNavbar from "../components/technicianNav/TechnicianNavbar";

export default function TechnicianLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#eef3f9" }}>
      <TechnicianNavbar />

      <main
        style={{
          paddingTop: "84px",
          minHeight: "calc(100vh - 84px)",
          background: "#eef3f9",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}