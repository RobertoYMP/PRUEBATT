import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

/**
 * NotificationProvider recibe currentUserId (simulado desde App.jsx)
 * y expone:
 * - notifications: solo las del usuario actual (tienen id, fecha, mensaje, design)
 * - addNotification(userId, mensaje, design)
 * - removeNotification(index)  <-- compatible con tu NotificationList
 * - removeNotificationById(id) <-- útil si quieres migrar a eliminación por id
 */
export const NotificationProvider = ({ children, currentUserId }) => {
  const [allNotifications, setAllNotifications] = useState([]);

  const addNotification = (userId, mensaje, design = {}) => {
    const newNotification = {
      id: Date.now().toString(),
      userId,
      fecha: new Date().toLocaleString("es-ES"),
      mensaje,
      design,
    };
    // añadimos al inicio (más reciente primero)
    setAllNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotificationById = (id) =>
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));

  // Función compatible con tu NotificationList: recibe index relativo a la lista del usuario
  const removeNotification = (index) => {
    const userNotifications = allNotifications.filter(
      (n) => n.userId === currentUserId
    );
    const item = userNotifications[index];
    if (!item) return;
    removeNotificationById(item.id);
  };

  // Notificaciones filtradas para el usuario actual (mantienen id, fecha, mensaje, design)
  const notifications = allNotifications.filter(
    (n) => n.userId === currentUserId
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        removeNotificationById,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};