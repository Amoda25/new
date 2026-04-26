import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/userNav/UserNavbar";
import Footer from "../components/common/Footer";

export default function UserLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <UserNavbar />

      <main
        style={{
          paddingTop: "84px",
          minHeight: "calc(100vh - 84px)",
          background: "#0f172a",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}