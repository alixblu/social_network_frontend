import React, { useState, useEffect } from "react";
import axios from "axios";

function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchNotificationsByUserId = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/notifications/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("API Response:", response.data); // Debug log
      const data = Array.isArray(response.data) ? response.data : [];
      return { success: true, data };
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return { success: false, error: "Lỗi khi tải thông báo" };
    }
  };

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/users/getUserByToken",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserId(response.data.id);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Không thể lấy thông tin người dùng");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      setLoading(true);
      const result = await fetchNotificationsByUserId(userId);
      if (result.success) {
        setNotifications(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error);
        setNotifications([]); // Reset to empty array on error
      }
      setLoading(false);
    };
    loadNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
      );
    } catch (err) {
      console.error("Đánh dấu đã đọc thất bại", err);
      setError("Không thể đánh dấu đã đọc");
    }
  };

  const markAsDismissed = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/notifications/${id}/dismiss`,
        null,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Bỏ qua thông báo thất bại", err);
      setError("Không thể bỏ qua thông báo");
    }
  };

  const markAllAsRead = async () => {
    if (!notifications.length) return; // Skip if no notifications
    try {
      await axios.put(
        `http://localhost:8080/notifications/user/${userId}/markAllAsRead`,
        null,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ" }))
      );
    } catch (err) {
      console.error("Không thể đánh dấu tất cả là đã đọc", err);
      setError("Không thể đánh dấu tất cả là đã đọc");
    }
  };

  return (
    <div className="fixed top-16 right-4 w-[400px] bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="p-4 border-b font-semibold text-blue-600 text-lg flex items-center justify-between">
        <span>Thông báo</span>
        {Array.isArray(notifications) && notifications.some((n) => n.status === "UNREAD") && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Đánh dấu tất cả
          </button>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto px-4 py-2 space-y-3">
        {loading && <p className="text-sm text-gray-500">Đang tải...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && notifications.length === 0 && (
          <p className="text-sm text-gray-500">Không có thông báo nào.</p>
        )}
        {Array.isArray(notifications) && [...notifications].reverse().map((n) => (

          <div
            key={n.id}
            className={`border-l-4 rounded-md p-2 transition-colors duration-200 ${
              n.status === "UNREAD"
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="text-sm font-bold text-gray-800 flex items-center justify-between">
              <span>
                {n.type.replace("_", " ")} -{" "}
                <span className="text-xs font-normal text-gray-500">
                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                </span>
              </span>
              {n.status === "UNREAD" && (
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
              )}
            </div>
            <div className="text-sm text-gray-700 mt-1">{n.message}</div>
            <div className="flex gap-2 mt-2">
              {n.status === "UNREAD" && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Đánh dấu đã đọc
                </button>
              )}
              <button
                onClick={() => markAsDismissed(n.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-2 text-center">
        <button
          onClick={onClose}
          className="text-sm text-red-600 font-semibold hover:text-gray-600 hover:underline"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export default NotificationPopup;