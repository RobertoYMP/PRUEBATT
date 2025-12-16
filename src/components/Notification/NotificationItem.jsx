import React from "react";
import "./Notifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function NotificationItem({ text, createdAt, style = {}, onDelete }) {
  const fecha = createdAt ? new Date(createdAt).toLocaleString() : "";

  return (
    <div className="notification-item" style={style}>
      <div className="notification-text">
        <b className="notification-date">{fecha}</b>
        <div className="notification-message">{text}</div>
      </div>
      <button
        className="icon-button trash-div"
        onClick={onDelete}
        aria-label="Eliminar notificación"
        title="Eliminar"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
}
