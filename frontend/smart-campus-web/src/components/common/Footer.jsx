import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      {/* top electric line */}
      <div className="footer-top-line" />

      <div className="footer-inner">

        {/* ── Col 1: Brand ── */}
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => navigate("/")}>
            <div className="footer-logo-icon">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="3" fill="#3b82f6"/>
                <rect x="18" y="2" width="12" height="12" rx="3" fill="#60a5fa" opacity="0.7"/>
                <rect x="2" y="18" width="12" height="12" rx="3" fill="#60a5fa" opacity="0.7"/>
                <rect x="18" y="18" width="12" height="12" rx="3" fill="#3b82f6"/>
              </svg>
            </div>
            <span className="footer-logo-text">
              Smart <span>Campus</span>
            </span>
          </div>

          <p className="footer-tagline">
            A modern digital platform for managing and exploring university campus facilities — rooms, labs, and equipment in one place.
          </p>

          {/* Socials */}
          <div className="footer-socials">
            {[
              {
                label: "Facebook",
                href: "#",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              },
              {
                label: "Twitter",
                href: "#",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
              },
              {
                label: "Instagram",
                href: "#",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
              },
              {
                label: "LinkedIn",
                href: "#",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
              },
              {
                label: "YouTube",
                href: "#",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#020b1a"/></svg>,
              },
            ].map((s) => (
              <a key={s.label} href={s.href} className="footer-social-btn" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate("/")}>Home</button></li>
            <li><button onClick={() => navigate("/resources")}>Resource Catalogue</button></li>
            <li><button onClick={() => navigate("/manage-resources")}>Manage Resources</button></li>
          </ul>
        </div>

        {/* ── Col 3: Resources ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Resources</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate("/resources?type=ROOM")}>Rooms</button></li>
            <li><button onClick={() => navigate("/resources?type=LAB")}>Laboratories</button></li>
            <li><button onClick={() => navigate("/resources?type=EQUIPMENT")}>Equipment</button></li>
          </ul>
        </div>

        {/* ── Col 4: Contact ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-contact-list">
            <li>
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
              </span>
              123 University Ave,<br />Campus Building A
            </li>
            <li>
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
              +94 11 234 5678
            </li>
            <li>
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
              info@smartcampus.edu
            </li>
          </ul>
        </div>

        {/* ── Col 5: Newsletter ── */}
        <div className="footer-col footer-col-newsletter">
          <h4 className="footer-col-title">Stay Updated</h4>
          <p className="footer-newsletter-desc">
            Get notified about new resources, availability updates, and campus announcements.
          </p>
          {subscribed ? (
            <div className="footer-subscribed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="1.8"/><path d="M7 13l3 3 7-7" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              You're subscribed!
            </div>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">
            © {new Date().getFullYear()} Smart Campus. All rights reserved.
          </span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-bottom-dot" />
            <a href="#">Terms of Use</a>
            <span className="footer-bottom-dot" />
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
