// src/pages/patient/Notifications.jsx
import React from 'react'
import { usePrediction } from '../../hooks/usePrediction'

export default function Notifications() {
  // 👇 Usamos el hook, pero SIN volver a llamar a la API (autoFetch = false)
  const { result } = usePrediction(false)

  // Si no hay ningún resultado guardado, no hay de qué avisar
  if (!result) {
    return (
      <div className="card stack">
        <h2>Notificaciones</h2>
        <p>Sin notificaciones</p>
      </div>
    )
  }

  // Si sí hay resultado, significa que al menos un análisis ya se hizo
  const fecha = result.updatedAt || result.createdAt || null
  const fechaTexto = fecha ? new Date(fecha).toLocaleString() : ''

  return (
    <div className="card stack">
      <h2>Notificaciones</h2>

      <div className="notif-card">
        <p>
          <strong>✅ Se realizó el análisis de tu estudio de biometría hemática.</strong>
        </p>
        {fechaTexto && (
          <p style={{ fontSize: 14, opacity: 0.8 }}>
            Última actualización: {fechaTexto}
          </p>
        )}
      </div>
    </div>
  )
}
