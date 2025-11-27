// src/pages/patient/PrediagResults.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLatestPrediction } from '../../api/historyClient'
import { useNotifications } from '../../context/NotificationContext'

export default function PrediagResults() {
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [prediction, setPrediction] = useState(null)
  const { addNotification, notifications } = useNotifications()

  const firedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const pred = await fetchLatestPrediction()
        if (!mounted) return
        setPrediction(pred)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (prediction) {
      console.log('LATEST PRED RAW =>', prediction)
    }
  }, [prediction])

  useEffect(() => {
    if (!prediction || firedRef.current) return

    const lastKey = localStorage.getItem('hematec.lastUploadKey') || ''
    const fallback = `${prediction?.updatedAt || ''}|${prediction?.cluster ?? ''}`
    const notifId = `analysis:${lastKey || fallback}`

    const already = notifications?.some(n => n.id === notifId)
    if (already) {
      firedRef.current = true
      return
    }

    addNotification(
      notifId,
      '✅ Se completó el análisis de tu estudio de biometría hemática',
      { borderLeft: '4px solid #28a745' }
    )
    firedRef.current = true
  }, [prediction, notifications, addNotification])
  
  const renderEstado = () => {
    if (loading) return <p>Consultando…</p>
    if (error)   return <p style={{ color: '#b10808' }}>Error: {error}</p>
    if (!prediction) return <p><strong>EN PROCESO</strong></p>
    return null
  }

  const datosPaciente = () => {
    if (!prediction) return <p>No hay datos aún.</p>
    return (
      <ul>
        <li>Sexo detectado: <strong>{prediction.sexo || '—'}</strong></li>
        <li>Cluster: <strong>{prediction.cluster ?? '—'}</strong></li>
        {prediction.estado_global && (
          <li>Estado global: <strong>{prediction.estado_global}</strong></li>
        )}
        {prediction.nota && (
          <li style={{ maxWidth: 640, marginTop: 8 }}>
            <small><em>{prediction.nota}</em></small>
          </li>
        )}
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
              <th>Parámetro</th><th>Valor</th><th>Unidad</th>
              <th>Ref. Mín</th><th>Ref. Máx</th><th>Estado</th><th>Severidad</th>
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

  const renderPatrones = () => {
    if (loading) return <p>Consultando…</p>
    if (error)   return null
    if (!prediction) return <p>No hay datos de patrones todavía.</p>

    const patrones = Array.isArray(prediction.patrones_hematologicos)
      ? prediction.patrones_hematologicos
      : []

    const fromPred = !patrones.length && Array.isArray(prediction.prediagnostico)
      ? prediction.prediagnostico.map((t, i) => ({
          codigo: `pred-${i}`,
          titulo: t,
          descripcion: '',
          severidad: 'informativo'
        }))
      : []

    const list = patrones.length ? patrones : fromPred

    if (!list.length) {
      return (
        <p>No se identificaron patrones hematológicos relevantes con los parámetros analizados.</p>
      )
    }

    return (
      <ul>
        {list.map((p, idx) => (
          <li key={p.codigo || idx} style={{ marginBottom: 8 }}>
            <strong>{p.titulo || p}</strong>
            {p.descripcion && (
              <span> — {p.descripcion}</span>
            )}
          </li>
        ))}
      </ul>
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

      <section>
        <h2>Patrones hematológicos identificados</h2>
        {renderPatrones()}
      </section>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Link to="/app/charts" className="text-link">Ver resultados en formato gráfico</Link>
        <Link to="/app/recommendations" className="text-link">Ver recomendaciones</Link>
      </div>
    </div>
  )
}
