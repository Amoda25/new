import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../components/userNav/UserNavbar";
import Footer from "../components/common/Footer";
import Chatbot from "../components/Chatbot/Chatbot";

export default function UserLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#eef3f9" }}>
      <UserNavbar />

      <main
        style={{
          paddingTop: "84px",
          minHeight: "calc(100vh - 84px)",
          background: "#eef3f9",
        }}
      >
        <Outlet />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}