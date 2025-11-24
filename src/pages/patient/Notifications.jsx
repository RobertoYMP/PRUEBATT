import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

export default function Notifications(){
  const { notifications } = useNotifications();
  const hasNotifications = notifications && notifications.length > 0;

  return (
    <div className="card stack">
      <h2>Notificaciones</h2>

      {!hasNotifications && <p>Sin notificaciones</p>}

      {hasNotifications && (
        <ul className="notif-list">
          {notifications.map(n => (
            <li
              key={n.id}
              className="notif-item"
              style={n.style || {}}
            >
              <span className="notif-text">{n.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
