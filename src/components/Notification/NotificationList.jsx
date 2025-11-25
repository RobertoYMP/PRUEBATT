import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "./NotificationItem";
import "./Notifications.css";

export default function NotificationList() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <p className="empty-msg">No hay notificaciones</p>
      ) : (
        notifications.map((n, index) => (
          <NotificationItem
            key={n.id}
            // 👇 nuevos nombres de campos
            createdAt={n.createdAt}
            text={n.text}
            style={n.style}
            onDelete={() => removeNotification(index)}
          />
        ))
      )}
    </div>
  );
}
