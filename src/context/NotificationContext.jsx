// src/context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getSession } from '../pages/auth/cognito' // <-- ya lo tienes en tu proyecto

const NotificationContext = createContext(null)
export const useNotifications = () => useContext(NotificationContext)

// ——— helpers ———
function storageKey(sub) {
  // cada usuario tiene su propio espacio de notificaciones
  const who = sub || 'anon'
  return `hematec.notifications.${who}`
}

export function NotificationProvider({ children }) {
  // ---- quién es el usuario actual (Cognito) ----
  const sub = getSession()?.claims?.sub || null

  // ---- estado ----
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(sub))
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // set para deduplicar por id
  const known = useRef(new Set(items.map(i => i.id)))

  // cuando cambie el usuario (sub), recargamos sus notifs del storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(sub))
      const next = raw ? JSON.parse(raw) : []
      known.current = new Set(next.map(i => i.id))
      setItems(next)
    } catch {
      known.current = new Set()
      setItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub])

  // persistencia por usuario
  useEffect(() => {
    try { localStorage.setItem(storageKey(sub), JSON.stringify(items)) } catch {}
  }, [items, sub])

  // ---- API ----
  const addNotification = (id, text, style = {}, ttlMs = 0) => {
    if (!id || !text) return
    if (known.current.has(id)) return // no duplicar
    known.current.add(id)
    const n = {
      id,
      text,
      style,
      createdAt: Date.now(),
      read: false,
    }
    setItems(prev => [n, ...prev])

    if (ttlMs > 0) {
      setTimeout(() => removeNotificationById(id), ttlMs)
    }
  }

  const removeNotificationById = (id) => {
    known.current.delete(id)
    setItems(prev => prev.filter(n => n.id !== id))
  }

  // compat: borrar por índice relativo a la lista actual
  const removeNotification = (index) => {
    setItems(prev => {
      const n = prev[index]
      if (!n) return prev
      known.current.delete(n.id)
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
  }

  const markAsRead = (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearAll = () => {
    known.current = new Set()
    setItems([])
  }

  const value = useMemo(() => ({
    notifications: items,
    addNotification,
    removeNotification,
    removeNotificationById,
    markAsRead,
    clearAll,
  }), [items])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
