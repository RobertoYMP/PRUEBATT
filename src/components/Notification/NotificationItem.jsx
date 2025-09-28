import React from "react";
import './Notifications.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function NotificationItem({ fecha, mensaje, onDelete }) {
  return (
    <div className="notification-item">
      <div className="notification-text">
        <div>
          <b><div className="notification-date">{fecha}</div></b>
        </div>
        <div className="notification-message">{mensaje}</div>
      </div>
      <div className="trash-div">
        <FontAwesomeIcon icon={faTrashCan} style={{color: "var(--color-primary)"}} onClick={onDelete} aria-label="Eliminar notificación" className='icon-button'/>
      </div>
    </div>
  );
}