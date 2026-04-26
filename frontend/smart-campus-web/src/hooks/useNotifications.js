import { useEffect, useState } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch notifications: ${res.status}`);
        setNotifications([]);
        return;
      }

      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
      setNotifications([]);
    }
  };

  const fetchUnreadCount = async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/notifications/unread/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch unread count: ${res.status}`);
        setUnreadCount(0);
        return;
      }

      const data = await res.json();
      setUnreadCount(data);
    } catch (error) {
      console.error("Unread count fetch error:", error);
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8081/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`Failed to delete notification: ${res.status}`);
        return;
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnreadCount();
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  return { notifications, unreadCount, deleteNotification };
}
