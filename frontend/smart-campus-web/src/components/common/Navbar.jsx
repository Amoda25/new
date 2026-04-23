import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-brand-icon">
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

      <div className="navbar-links">
        <Link to="/" className={pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/login" className={pathname === "/login" ? "active" : ""}>
          Login
        </Link>
      </div>
    </nav>
  );
}