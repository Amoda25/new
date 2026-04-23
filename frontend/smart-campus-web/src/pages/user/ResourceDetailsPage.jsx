import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResourceById } from "../../services/resourceService";
import "./ResourceDetailsPage.css";

/* ── Type-specific config: Unsplash images + color themes ── */
const TYPE_CONFIG = {
  LAB: {
    label: "Laboratory",
    accent: "#059669",
    accentLight: "#ecfdf5",
    accentBorder: "#6ee7b7",
    accentDark: "#047857",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&q=80",
    tag: "Science & Research",
  },
  ROOM: {
    label: "Room",
    accent: "#2563eb",
    accentLight: "#eff6ff",
    accentBorder: "#93c5fd",
    accentDark: "#1d4ed8",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80",
    tag: "Campus Facility",
  },
  EQUIPMENT: {
    label: "Equipment",
    accent: "#7c3aed",
    accentLight: "#f5f3ff",
    accentBorder: "#c4b5fd",
    accentDark: "#6d28d9",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=80",
    tag: "Device & Tool",
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG.ROOM;

export default function ResourceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResourceById(id);
        setResource(data);
      } catch (err) {
        setError("Failed to load resource details");
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-state-screen">
          <div className="rd-spinner" />
          <p>Loading resource…</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="rd-page">
        <div className="rd-state-screen">
          <p>{error || "Resource not found."}</p>
          <button className="rd-ghost-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  const cfg = TYPE_CONFIG[resource.type] ?? DEFAULT_CONFIG;
  const isActive = resource.status === "ACTIVE";
  const imgSrc = imgError ? cfg.imageFallback : cfg.image;

  return (
    <div
      className="rd-page"
      style={{
        "--rd-accent": cfg.accent,
        "--rd-accent-light": cfg.accentLight,
        "--rd-accent-border": cfg.accentBorder,
        "--rd-accent-dark": cfg.accentDark,
      }}
    >
      {/* ── Full-width image cover ── */}
      <div className="rd-cover">
        <img
          src={imgSrc}
          alt={cfg.label}
          className="rd-cover-img"
          onError={() => setImgError(true)}
        />
        <div className="rd-cover-overlay" />

        {/* nav inside hero */}
        <div className="rd-cover-nav">
          <button className="rd-nav-back" onClick={() => navigate(-1)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Catalogue
          </button>
          <div className="rd-nav-tag" style={{ background: cfg.accentLight, color: cfg.accentDark, borderColor: cfg.accentBorder }}>
            {cfg.tag}
          </div>
        </div>

        {/* hero text */}
        <div className="rd-cover-content">
          <div className="rd-cover-type" style={{ background: cfg.accent }}>
            {cfg.label}
          </div>
          <h1 className="rd-cover-title">{resource.name}</h1>
          <div className="rd-cover-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
            </svg>
            {resource.location}
          </div>
        </div>

        {/* floating status pill */}
        <div className={`rd-float-status ${isActive ? "rd-float-active" : "rd-float-inactive"}`}>
          <span className="rd-float-dot" />
          {isActive ? "Available" : "Out of Service"}
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="rd-body">

        {/* quick stats bar */}
        <div className="rd-stats-bar">
          <div className="rd-stat-item">
            <span className="rd-stat-label">Type</span>
            <span className="rd-stat-val" style={{ color: cfg.accent }}>{resource.type}</span>
          </div>
          <div className="rd-stat-div" />
          <div className="rd-stat-item">
            <span className="rd-stat-label">Location</span>
            <span className="rd-stat-val">{resource.location}</span>
          </div>
          <div className="rd-stat-div" />
          <div className="rd-stat-item">
            <span className="rd-stat-label">Capacity</span>
            <span className="rd-stat-val">{resource.capacity != null ? `${resource.capacity} people` : "N/A"}</span>
          </div>
          <div className="rd-stat-div" />
          <div className="rd-stat-item">
            <span className="rd-stat-label">Status</span>
            <span className={`rd-stat-status ${isActive ? "rd-s-active" : "rd-s-inactive"}`}>
              <span className="rd-dot-sm" />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* main two-column grid */}
        <div className="rd-grid">

          {/* LEFT: main content */}
          <div className="rd-main">
            <div className="rd-about-card">
              <div className="rd-about-stripe" style={{ background: cfg.accent }} />
              <h2 className="rd-about-title">About this Resource</h2>
              <p className="rd-about-desc">
                {resource.description || "No description has been provided for this campus resource."}
              </p>
            </div>

            <div className="rd-detail-grid">
              <div className="rd-detail-box">
                <div className="rd-detail-icon" style={{ background: cfg.accentLight, color: cfg.accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <span className="rd-detail-label">Type</span>
                <span className="rd-detail-val" style={{ color: cfg.accent }}>{resource.type}</span>
              </div>
              <div className="rd-detail-box">
                <div className="rd-detail-icon" style={{ background: cfg.accentLight, color: cfg.accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg>
                </div>
                <span className="rd-detail-label">Location</span>
                <span className="rd-detail-val">{resource.location}</span>
              </div>
              <div className="rd-detail-box">
                <div className="rd-detail-icon" style={{ background: cfg.accentLight, color: cfg.accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <span className="rd-detail-label">Capacity</span>
                <span className="rd-detail-val">{resource.capacity != null ? resource.capacity : "N/A"}</span>
              </div>
              <div className="rd-detail-box">
                <div className="rd-detail-icon" style={{ background: isActive ? "#ecfdf5" : "#fff5f5", color: isActive ? "#059669" : "#dc2626" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <span className="rd-detail-label">Status</span>
                <span className="rd-detail-val" style={{ color: isActive ? "#059669" : "#dc2626" }}>
                  {resource.status?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: sidebar */}
          <div className="rd-sidebar">

            {/* capacity highlight */}
            {resource.capacity != null && (
              <div className="rd-capacity-card" style={{ borderTopColor: cfg.accent }}>
                <div className="rd-capacity-label">Maximum Capacity</div>
                <div className="rd-capacity-num" style={{ color: cfg.accent }}>{resource.capacity}</div>
                <div className="rd-capacity-sub">people</div>
                <div className="rd-cap-bar-bg">
                  <div
                    className="rd-cap-bar-fill"
                    style={{ background: cfg.accent, width: `${Math.min(100, (resource.capacity / 200) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* quick info */}
            <div className="rd-info-card">
              <div className="rd-info-row">
                <span className="rd-info-label">Resource ID</span>
                <span className="rd-info-mono">#{resource.id}</span>
              </div>
              <div className="rd-info-hr" />
              <div className="rd-info-row">
                <span className="rd-info-label">Category</span>
                <span className="rd-info-badge" style={{ background: cfg.accentLight, color: cfg.accentDark, borderColor: cfg.accentBorder }}>
                  {cfg.label}
                </span>
              </div>
              <div className="rd-info-hr" />
              <div className="rd-info-row">
                <span className="rd-info-label">Availability</span>
                <span style={{ color: isActive ? "#059669" : "#dc2626", fontWeight: 600, fontSize: "0.84rem" }}>
                  {isActive ? "Available Now" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* actions */}
            <div className="rd-action-stack">
              <button
                className="rd-btn-primary"
                style={{ background: cfg.accent }}
                onClick={() => navigate(-1)}
              >
                ← Back to Catalogue
              </button>
            
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
