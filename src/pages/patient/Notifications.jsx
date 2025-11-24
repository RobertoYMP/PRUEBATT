// src/pages/patient/Notifications.jsx
import React, { useEffect, useState } from 'react'
import { fetchLatestPrediction } from '../../api/historyClient'

export default function Notifications() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        // 👉 Pedimos el último resultado del usuario
        const pred = await fetchLatestPrediction()
        if (!mounted) return
        // Si aún no hay análisis terminado, pred será null
        setPrediction(pred || null)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  let contenido

  if (loading) {
    contenido = <p>Cargando…</p>
  } else if (error) {
    contenido = <p style={{ color: '#b10808' }}>Error: {error}</p>
  } else if (!prediction) {
    // 👉 No hay análisis completado aún
    contenido = <p>Sin notificaciones</p>
  } else {
    // 👉 Ya hubo al menos un análisis completado: mostramos la notificación
    const fecha = prediction.updatedAt || prediction.createdAt || null
    const fechaTexto = fecha ? new Date(fecha).toLocaleString() : ''

    contenido = (
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
    )
  }

  return (
    <div className="card stack">
      <h2>Notificaciones</h2>
      {contenido}
    </div>
  )
}
