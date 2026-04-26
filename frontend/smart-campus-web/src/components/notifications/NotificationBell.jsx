import { useState, useRef, useEffect } from "react";
import useNotifications from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");

  const [prefs, setPrefs] = useState({
    ticket: localStorage.getItem("notif_ticket") !== "false",
    booking: localStorage.getItem("notif_booking") !== "false",
    comment: localStorage.getItem("notif_comment") !== "false",
  });

  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function timeAgo(dateString) {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const togglePreference = (type) => {
    const newValue = !prefs[type];
    const updated = { ...prefs, [type]: newValue };
    setPrefs(updated);
    localStorage.setItem(`notif_${type}`, newValue);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (n.type.startsWith("TICKET") && !prefs.ticket) return false;
    if (n.type.startsWith("BOOKING") && !prefs.booking) return false;
    if (n.type === "NEW_COMMENT" && !prefs.comment) return false;
    return true;
  });

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markAsRead(n.id);
    }
    if (n.targetUrl) {
      navigate(n.targetUrl);
    }
    setOpen(false);
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      {/* 🔔 Bell */}
      <div className="notification-bell-icon" onClick={() => setOpen(!open)}>
        <span role="img" aria-label="notifications">🔔</span>
        {unreadCount > 0 && (
          <span className="unread-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* 🔽 Dropdown */}
      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <div className="notification-settings">
              <label className="notif-setting-item">
                <span>🎫 Tickets</span>
                <input
                  type="checkbox"
                  checked={prefs.ticket}
                  onChange={() => togglePreference("ticket")}
                />
              </label>
              <label className="notif-setting-item">
                <span>📅 Bookings</span>
                <input
                  type="checkbox"
                  checked={prefs.booking}
                  onChange={() => togglePreference("booking")}
                />
              </label>
              <label className="notif-setting-item">
                <span>💬 Comments</span>
                <input
                  type="checkbox"
                  checked={prefs.comment}
                  onChange={() => togglePreference("comment")}
                />
              </label>
            </div>
          </div>

          <div className="notification-list">
            {!token ? (
              <p className="notif-empty">Please login to view notifications</p>
            ) : filteredNotifications.length === 0 ? (
              <p className="notif-empty">No notifications yet</p>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.isRead ? "" : "unread"}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="notif-icon">{getIcon(n.type)}</div>
                  <div className="notif-content">
                    <div className="notif-message">{n.message}</div>
                    <div className="notif-time">{timeAgo(n.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {unreadCount > 0 && (
            <div className="notif-footer">
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getIcon(type) {
  switch (type) {
    case "TICKET_CREATED":
      return "🆕";
    case "TICKET_ASSIGNED":
      return "👨‍🔧";
    case "TICKET_RESOLVED":
      return "✅";
    case "TICKET_STATUS_UPDATED":
      return "🔄";
    case "BOOKING_CREATED":
      return "📅";
    case "BOOKING_APPROVED":
      return "✔️";
    case "BOOKING_REJECTED":
      return "❌";
    case "NEW_COMMENT":
      return "💬";
    default:
      return "🔔";
  }
}

export default NotificationBell;
