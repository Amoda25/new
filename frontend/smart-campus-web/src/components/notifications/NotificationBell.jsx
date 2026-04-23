import { useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const [prefs, setPrefs] = useState({
    ticket: localStorage.getItem("notif_ticket") !== "false",
    booking: localStorage.getItem("notif_booking") !== "false",
  });
    

  const { notifications, unreadCount, deleteNotification } = useNotifications();

  function timeAgo(dateString) {
    const now = new Date();
    const created = new Date(dateString);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const togglePreference = (type) => {
    const newValue = !prefs[type];

    const updated = {
      ...prefs,
      [type]: newValue,
    };

    setPrefs(updated);
    localStorage.setItem(`notif_${type}`, newValue);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (n.type.startsWith("TICKET") && !prefs.ticket) return false;
    if (n.type.startsWith("BOOKING") && !prefs.booking) return false;
    return true;
  });

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 Bell */}
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              marginLeft: "5px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* 🔽 Dropdown */}
      {open && (
        <div
        
          style={{
            position: "fixed",
            right: "20px",
            top: "50px",
            width: "300px",
            background: "rgba(10, 20, 40, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(0, 140, 255, 0.3)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            color: "#e8f4ff",
            zIndex: 9999,
            maxHeight: "400px",
            overflowY: "auto",
            borderRadius: "12px",
          }}
        >

          <div style={{ padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
  
            <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              🔔 Ticket Notifications
              <input
                type="checkbox"
                checked={prefs.ticket}
                onChange={() => togglePreference("ticket")}
              />
            </label>

            <label style={{ display: "flex", justifyContent: "space-between" }}>
              📅 Booking Notifications
              <input
                type="checkbox"
                checked={prefs.booking}
                onChange={() => togglePreference("booking")}
              />
            </label>

          </div>



          {!token ? (
            <p style={{ padding: "12px", textAlign: "center", opacity: 0.6 }}>
              Login to see notifications
            </p>
          ) : !notifications || notifications.length === 0 ? (
            <p style={{ padding: "12px", textAlign: "center", opacity: 0.6 }}>
              No notifications
            </p>
          ) : (
            filteredNotifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.targetUrl) {
                    navigate(n.targetUrl);
                  }
                  deleteNotification(n.id);
                  setOpen(false);
                }}
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  background: n.isRead
                    ? "transparent"
                    : "rgba(0, 140, 255, 0.08)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "18px" }}>{getIcon(n.type)}</div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: n.isRead ? "400" : "600",
                    }}
                  >
                    {n.message}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.6,
                      marginTop: "4px",
                    }}
                  >
                    {timeAgo(n.createdAt)}
                  </div>
                </div>
              </div>
            ))
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
    case "BOOKING_REJECTED":
      return "❌❌"
    default:
      return "🔔";
  }
}

export default NotificationBell;