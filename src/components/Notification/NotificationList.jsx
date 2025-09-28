import NotificationItem from "./NotificationItem";
import './Notifications.css'

export default function NotificationList({ notifications, removeNotification }) {
  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <p className="empty-msg">No hay notificaciones</p>
      ) : (
        notifications.map((n, index) => (
          <NotificationItem
            key={n.id}
            fecha={n.fecha}
            mensaje={n.mensaje}
            onDelete={() => removeNotification(index)}
          />
        ))
      )}
    </div>
  );
}