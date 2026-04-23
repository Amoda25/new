import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main style={{ paddingTop: "84px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}