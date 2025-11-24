// src/pages/patient/PrediagResults.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLatestPrediction } from '../../api/historyClient'
import { useNotifications } from '../../context/NotificationContext'

export default function PrediagResults() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [notified, setNotified] = useState(false)    
  const { addNotification } = useNotifications()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const pred = await fetchLatestPrediction()
        if (!mounted) return
        setPrediction(pred) // puede ser null si aún va en proceso
      } catch (err) {
        if (!mounted) return
        setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // 🔔 NOTIFICACIÓN CUANDO YA HAY PREDICCIÓN
  useEffect(() => {
    if (!prediction || notified) return   // 👈 si ya notificamos, no repetir

    console.log('[PrediagResults] prediction lista, enviando notificación...')
    const notifId = `patient-analysis-${Date.now()}`

    addNotification(
      notifId,
      '✅ Se completó el análisis de tu estudio de biometría hemática',
      { borderLeft: '4px solid #28a745' }
    )

    setNotified(true)
  }, [prediction, notified, addNotification])

  const renderEstado = () => {
    if (loading) return <p>Consultando…</p>
    if (error) return <p style={{ color: '#b10808' }}>Error: {error}</p>
    if (!prediction) return <p><strong>EN PROCESO</strong></p>
    return null
  }

  const datosPaciente = () => {
    if (!prediction) return <p>No hay datos aún.</p>
    return (
      <ul>
        <li>Sexo detectado: <strong>{prediction.sexo || '—'}</strong></li>
        <li>Cluster: <strong>{prediction.cluster ?? '—'}</strong></li>
      </ul>
    )
  }

  const tablaResultados = () => {
    if (!prediction) return <p>No hay datos de parámetros en este resultado.</p>

    const det = Array.isArray(prediction.detalles) ? prediction.detalles : []
    if (!det.length) return <p>No hay datos de parámetros en este resultado.</p>

    return (
      <div style={{ overflowX: 'auto' }}>
        <table className="results-table">
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Valor</th>
              <th>Unidad</th>
              <th>Ref. Mín</th>
              <th>Ref. Máx</th>
              <th>Estado</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            {det.map((r, i) => (
              <tr key={`${r.Parametro}-${i}`}>
                <td>{r.Parametro}</td>
                <td>{r.Valor}</td>
                <td>{r.Unidad || '—'}</td>
                <td>{r.Min ?? '—'}</td>
                <td>{r.Max ?? '—'}</td>
                <td>{r.Estado || '—'}</td>
                <td>{r.Severidad || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="card results-card">
      <h1>Resultados del prediagnóstico</h1>

      {renderEstado()}

      <section>
        <h2>Datos del paciente</h2>
        {datosPaciente()}
      </section>

      <section>
        <h2>Tabla de resultados</h2>
        {tablaResultados()}
      </section>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Link to="/app/charts" className="text-link">Ver resultados en formato gráfico</Link>
        <Link to="/app/recommendations" className="text-link">Ver recomendaciones</Link>
      </div>
    </div>
  )
}
