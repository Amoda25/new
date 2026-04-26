import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import sliitImg from "../../assets/SLIIT.jpg";

const IMAGES = {
  heroBg:   sliitImg,
  room:     "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  lab:      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  building: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
  tech:     "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
};

const stats = [
  { num: "200+", label: "Resources" },
  { num: "1.2K", label: "Students" },
  { num: "98%",  label: "Uptime" },
  { num: "24/7", label: "Support" },
];

const features = [
  {
    tag: "BOOKING",
    title: "Reserve Any Space",
    sub:   "Anywhere.",
    body:  "Lecture halls, computer labs, projectors — book in real-time with instant confirmation and zero friction.",
    img:   IMAGES.room,
    acc:   "#00eec8",
  },
  {
    tag: "TRACKING",
    title: "Every Asset",
    sub:   "Always Live.",
    body:  "Real-time status for every piece of campus equipment. Know what's free before you even leave your desk.",
    img:   IMAGES.lab,
    acc:   "#7dc8ff",
  },
  {
    tag: "TICKETING",
    title: "Issues Reported",
    sub:   "Rapidly Resolved.",
    body:  "Submit and track maintenance tickets through a full-cycle system managed by dedicated technicians.",
    img:   IMAGES.tech,
    acc:   "#c4a0ff",
  },
];

const roles = [
  {
    role:  "Students",
    cls:   "role-student",
    icon:  "🎓",
    desc:  "Browse and book resources. Track your reservations. File support tickets instantly.",
  },
  {
    role:  "Technicians",
    cls:   "role-tech",
    icon:  "🔧",
    desc:  "Receive assigned tickets. Update repair status. Create and submit maintenance reports.",
  },
  {
    role:  "Admins",
    cls:   "role-admin",
    icon:  "⚙️",
    desc:  "Manage all resources. Approve bookings. Oversee the entire campus platform.",
  },
];

/* scroll reveal hook */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-wrap ${visible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  return (
    <div className="hp">

      {/* ═══════════ HERO ═══════════ */}
      <section className="hp-hero">
        <div className="hero-img-wrap">
          <img src={IMAGES.heroBg} alt="campus" className="hero-bg-img" />
          <div className="hero-img-overlay" />
        </div>


        <div className={`hero-content ${loaded ? "hero-in" : ""}`}>


          <h1 className="hero-heading">
            <span className="hh-sub">The Smarter</span>
            <span className="hh-display">CAMPUS</span>
            <span className="hh-accent">Experience.</span>
          </h1>

          <p className="hero-body">
            Book resources, track equipment, file tickets — one unified
            platform for the entire campus community.
          </p>

          <div className="hero-ctas">
            <Link to="/login"    className="cta-filled">Get Started →</Link>
            <Link to="/register" className="cta-outline">Create Account</Link>
            <Link to="/login?role=admin" className="cta-admin">Admin Login</Link>
          </div>
        </div>

        <div className="hero-ticker">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="ticker-inner">
              RESOURCE BOOKING &nbsp;·&nbsp; LIVE STATUS &nbsp;·&nbsp;
              TICKET MANAGEMENT &nbsp;·&nbsp; ROLE ACCESS &nbsp;·&nbsp;
              SMART CAMPUS &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </section>



      {/* ═══════════ INTRO ═══════════ */}
      <section className="hp-intro">
        <RevealSection className="intro-left">
          <p className="intro-overline">About the Platform</p>
          <h2 className="intro-heading">
            One platform.<br />
            <em>Endless</em><br />
            possibilities.
          </h2>
        </RevealSection>

        <RevealSection className="intro-right" delay={120}>
          <p className="intro-body">
            Smart Campus is a unified management platform designed for modern
            universities. It connects students, technicians, and administrators
            into a seamless ecosystem — from reserving a lecture hall to resolving
            a maintenance ticket in minutes.
          </p>
          <p className="intro-body">
            Built with role-based access control, it ensures every user gets
            exactly the tools they need, and nothing they don't.
          </p>
          <Link to="/register" className="intro-link">
            Explore the platform ↗
          </Link>
        </RevealSection>

        <RevealSection className="intro-img-wrap" delay={200}>
          <img src={IMAGES.building} alt="university building" className="intro-img" />
          <div className="intro-img-caption">
            <span>EST. 2024</span>
            <span>Smart Campus v2.0</span>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="hp-features">
        <RevealSection>
          <div className="features-header">
            <span className="features-overline">Core Features</span>
            <h2 className="features-heading">What we do.</h2>
          </div>
        </RevealSection>

        <div className="features-list">
          {features.map((f, i) => (
            <RevealSection key={f.tag} delay={i * 100} className="feature-row-wrap">
              <div
                className={`feature-row ${i % 2 === 1 ? "feature-row--flip" : ""}`}
                style={{ "--acc": f.acc }}
              >
                <div className="feature-img-col">
                  <div className="feature-img-frame" style={{ "--acc": f.acc }}>
                    <img src={f.img} alt={f.title} className="feature-img" />
                    <div className="feature-img-num">0{i + 1}</div>
                  </div>
                </div>
                <div className="feature-text-col">
                  <span className="feature-tag">{f.tag}</span>
                  <h3 className="feature-title">
                    {f.title}<br />{f.sub}
                  </h3>
                  <p className="feature-body">{f.body}</p>
                  <div className="feature-bar" />
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════ ROLES ═══════════ */}
      <section className="hp-roles">
        <RevealSection>
          <p className="roles-overline">Who It's For</p>
          <h2 className="roles-heading">
            Built for everyone<br />on campus.
          </h2>
        </RevealSection>

        <div className="roles-grid">
          {roles.map((r, i) => (
            <RevealSection key={r.role} delay={i * 110}>
              <div className={`role-card ${r.cls}`}>
                <div className="role-card-strip" />
                <div className="role-card-inner">
                  <div className="role-icon-wrap">
                    <span style={{ fontSize: "1.4rem" }}>{r.icon}</span>
                  </div>
                  <h3 className="role-name">{r.role}</h3>
                  <p className="role-desc">{r.desc}</p>
                  <Link to="/login" className="role-link">
                    Sign in as {r.role} →
                  </Link>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="hp-cta">
        <div className="cta-bg-wrap">
          <img src={IMAGES.building} alt="" className="cta-bg-img" />
          <div className="cta-bg-overlay" />
          <div className="cta-bg-grid" />
        </div>
        <RevealSection className="cta-content-wrap">
          <div className="cta-content">
            <p className="cta-overline">Join Today</p>
            <h2 className="cta-heading">
              Ready to transform<br />your campus life?
            </h2>
            <div className="cta-row">
              <Link to="/register" className="cta-filled">Create Free Account →</Link>
              <Link to="/login" className="cta-outline cta-outline--light">
                I already have an account
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

    </div>
  );
}
