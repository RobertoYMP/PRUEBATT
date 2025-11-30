// src/pages/patient/PrediagResults.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  // 👇 saber si venimos de /results?src=manual
  const params = new URLSearchParams(location.search || '')
  const fromManual = params.get('src') === 'manual'

  const firedRef = useRef(false)

  // 1) Si venimos de ManualEntry (o de otro lado) con state.result, úsalo
  useEffect(() => {
    const stateResult = location.state?.result
    if (!stateResult) return

    setPrediction(stateResult)
    setLoading(false)
    setError('')

    try {
      localStorage.setItem('lastPrediction', JSON.stringify(stateResult))
    } catch {}
  }, [location.state])

  // 2) Sólo si NO hay prediction todavía, consulta /history/latest (flujo anterior)
  useEffect(() => {
    if (prediction) return

    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const pred = await fetchLatestPrediction()
        if (!mounted) return
        setPrediction(pred)
        try {
          localStorage.setItem('lastPrediction', JSON.stringify(pred))
        } catch {}
      } catch (err) {
        if (!mounted) return
        setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [prediction])

  // 3) Log de la predicción actual
  useEffect(() => {
    if (prediction) {
      console.log('LATEST PRED RAW =>', prediction)
    }
  }, [prediction])

  // 4) Notificación (igual que antes, pero usando la prediction actual)
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
      'Se completó el análisis de tu estudio de biometría hemática',
      { borderLeft: '4px solid #28a745' }
    )
    firedRef.current = true
  }, [prediction, notifications, addNotification])
  
  const renderEstado = () => {
    // 👇 Cambio mínimo: si YA hay prediction, no mostramos "Consultando..."
    if (prediction) return null
    if (loading) return <p>Consultando…</p>
    if (error)   return <p style={{ color: '#b10808' }}>Error: {error}</p>
    return <p><strong>EN PROCESO</strong></p>
  }

  const datosPaciente = () => {
    if (!prediction) return <p>No hay datos aún.</p>
    return (
      <ul>
        <li>Sexo detectado: <strong>{prediction.sexo || '—'}</strong></li>
      </ul>
    )
  }

  function estadoToLabel(estado = '') {
    const s = String(estado).toLowerCase()

    if (['normal', 'en rango', 'ok'].includes(s)) {
      return 'En rango'
    }

    if (['alto', 'alta', 'elevado', 'elevada'].includes(s)) {
      return 'Alto'
    }

    if (['bajo', 'baja', 'disminuido', 'disminuida'].includes(s)) {
      return 'Bajo'
    }

    return estado || 'No evaluado'
  }

  function estadoToClass(estado = '') {
    const s = String(estado).toLowerCase()

    if (['normal', 'en rango', 'ok'].includes(s)) return 'estado-normal'
    if (['alto', 'alta', 'elevado', 'elevada'].includes(s)) return 'estado-alto'
    if (['bajo', 'baja', 'disminuido', 'disminuida'].includes(s)) return 'estado-bajo'

    return 'estado-desconocido'
  }

  function sevToLabel(sev = '') {
    const s = String(sev).toLowerCase()

    if (['ok', 'normal'].includes(s)) return 'Dentro de rango'
    if (['leve', 'mild'].includes(s)) return 'Alteración leve'
    if (['moderado', 'moderada', 'medium'].includes(s)) return 'Alteración moderada'
    if (['grave', 'severo', 'severa', 'high'].includes(s)) return 'Alteración marcada'

    return sev || '—'
  }

  function sevToClass(sev = '') {
    const s = String(sev).toLowerCase()

    if (['ok', 'normal'].includes(s)) return 'sev-ok'
    if (['leve', 'mild'].includes(s)) return 'sev-leve'
    if (['moderado', 'moderada', 'medium'].includes(s)) return 'sev-moderado'
    if (['grave', 'severo', 'severa', 'high'].includes(s)) return 'sev-grave'

    return 'sev-unknown'
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
                <td>
                  {r.Estado ? (
                    <span className={`estado-indicator ${estadoToClass(r.Estado)}`}>
                      <span className="estado-dot" />
                      <span className="estado-text">
                        {estadoToLabel(r.Estado)}
                      </span>
                    </span>
                  ) : '—'}
                </td>
                <td>
                  {r.Severidad ? (
                    <span className={`severity-pill ${sevToClass(r.Severidad)}`}>
                      {sevToLabel(r.Severidad)}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderPatrones = () => {
    // 👇 Cambio mínimo: mientras NO haya prediction y esté cargando, sí mostramos "Consultando…"
    if (!prediction && loading) return <p>Consultando…</p>
    if (!prediction) return <p>No hay datos de patrones todavía.</p>
    if (error && !prediction) return null

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
    <>
      <h2>Resultados del prediagnóstico</h2>
      <div className="card results-card">
        {renderEstado()}

        <section>
          <h3>Datos del paciente</h3>
          {datosPaciente()}
        </section>

        <section>
          <h3>Tabla de resultados</h3>
          {tablaResultados()}
        </section>

        <section>
          <h3>Patrones hematológicos identificados</h3>
          {renderPatrones()}
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Link
            to={fromManual ? "/app/charts?src=manual" : "/app/charts"}
            state={prediction ? { result: prediction } : undefined}
            className="text-link"
          >
            Ver resultados en formato gráfico
          </Link>
          <Link
            to={fromManual ? "/app/recommendations?src=manual" : "/app/recommendations"}
            state={prediction ? { result: prediction } : undefined}
            className="text-link"
          >
            Ver recomendaciones
          </Link>
        </div>
      </div>
    </>
  )
}