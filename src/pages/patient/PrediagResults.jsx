// src/pages/patient/PrediagResults.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLatestPrediction } from '../../api/historyClient'
import { useNotifications } from '../../context/NotificationContext'

function derivePatternsFromResumen(prediction) {
  if (!prediction) return []

  const resumen = prediction.resumen || {}
  const altos = Array.isArray(resumen.altos) ? resumen.altos : []
  const bajos  = Array.isArray(resumen.bajos) ? resumen.bajos : []

  const hasAny = (lista, candidatos) =>
    candidatos.some(c => lista.includes(c))

  const patterns = []

  // Serie roja (glóbulos rojos)
  const serieRojaAltBaj = hasAny(bajos, [
    'Hemoglobina',
    'Hematocrito',
    'Eritrocitos'
  ]) || hasAny(altos, [
    'Hemoglobina',
    'Hematocrito',
    'Eritrocitos',
    'Volumen Corpuscular Medio',
    'Hemoglobina Corpuscular Media',
    'Conc. Media de HB Corpuscular',
    'Ancho de Distribución Eritrocitaria (D.E.)',
    'Ancho de Distribución Eritrocitaria (C.V.)'
  ])

  if (serieRojaAltBaj) {
    patterns.push({
      codigo: 'serie_roja',
      titulo: 'Patrón de cambios en glóbulos rojos (serie roja)',
      descripcion:
        'Se observan parámetros relacionados con eritrocitos y/o hemoglobina fuera de rango. Este patrón puede ser compatible con alteraciones en la oxigenación o en el recambio de glóbulos rojos y requiere interpretación médica.'
    })
  }

  // Serie blanca (leucocitos y diferenciación)
  const serieBlancaAltBaj = hasAny(altos, [
    'Leucocitos',
    'Neutrofilos (%)',
    'Neutrofilos',
    'Linfocitos (%)',
    'Linfocitos',
    'Monocitos (%)',
    'Monocitos',
    'Eosinofilos (%)',
    'Eosinofilos',
    'Basofilos (%)',
    'Basofilos'
  ]) || hasAny(bajos, [
    'Leucocitos',
    'Neutrofilos (%)',
    'Neutrofilos',
    'Linfocitos (%)',
    'Linfocitos'
  ])

  if (serieBlancaAltBaj) {
    patterns.push({
      codigo: 'serie_blanca',
      titulo: 'Patrón de activación de serie blanca',
      descripcion:
        'Se identifican leucocitos y/o sus subpoblaciones fuera de rango. Este patrón puede asociarse a procesos infecciosos, inflamatorios u otras condiciones y debe ser valorado por un profesional de la salud.'
    })
  }

  // Plaquetas
  const plaquetasAltBaj = hasAny(altos, [
    'Plaquetas',
    'Volumen Plaquetario Medio',
    'Amplitud de Distribución Plaquetaria'
  ]) || hasAny(bajos, [
    'Plaquetas',
    'Volumen Plaquetario Medio'
  ])

  if (plaquetasAltBaj) {
    patterns.push({
      codigo: 'plaquetas',
      titulo: 'Patrón de cambios plaquetarios',
      descripcion:
        'Se observan variaciones en el número o tamaño de las plaquetas. Estos hallazgos deben complementarse con la valoración clínica para descartar trastornos de coagulación u otras causas.'
    })
  }

  // Si no hay nada alto/bajo, no devolvemos patrones
  if (!patterns.length && !altos.length && !bajos.length) {
    return []
  }

  return patterns
}

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

    const patrones = derivePatternsFromResumen(prediction)

    if (!patrones.length) {
      return (
        <p>No se identificaron patrones hematológicos relevantes con los parámetros analizados.</p>
      )
    }

    return (
      <ul>
        {patrones.map((p, idx) => (
          <li key={p.codigo || idx} style={{ marginBottom: 8 }}>
            <strong>{p.titulo}</strong>
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
