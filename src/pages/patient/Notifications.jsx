// src/pages/patient/Notifications.jsx
import React from 'react'
import { useNotifications } from '../../context/NotificationContext'
import NotificationList from '../../components/Notification/NotificationList'

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="card stack">
      <h2>Notificaciones</h2>
      <NotificationList
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  )
}
