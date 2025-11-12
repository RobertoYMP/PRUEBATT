import React, { useEffect, useState } from 'react'
import { fetchLatestPrediction, fetchPredictionByKey } from '../../api/historyClient'
import { deriveStatus, safeArray } from '../../lib/prediag'
import { useLocation } from 'react-router-dom'

export default function PrediagResults() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pred, setPred] = useState(null)
  const loc = useLocation()

  // Si venimos de "Visualizar" con ?key=... usamos ese; si no, latest por PK
  const sk = new URLSearchParams(loc.search).get('key')

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError('')
        const data = sk ? await fetchPredictionByKey(sk) : await fetchLatestPrediction()
        setPred(data || null)
      } catch (e) {
        setError(String(e?.message || e))
      } finally {
        setLoading(false)
      }
    })()
  }, [sk])

  if (loading) return <div className="card"><h2>Resultados del prediagnóstico</h2><p>Cargando…</p></div>
  if (error)   return <div className="card"><h2>Resultados del prediagnóstico</h2><div className="alert error">Error: {error}</div></div>
  if (!pred)   return <div className="card"><h2>Resultados del prediagnóstico</h2><p>No hay datos aún.</p></div>

  const status = deriveStatus(pred)
  const detalles = safeArray(pred.detalles)

  return (
    <div className="card">
      <h2>Resultados del prediagnóstico</h2>

      <div className="badge" style={{background: status.color}}>{status.label}</div>

      <h3>Datos del paciente</h3>
      <p>Paciente · Edad 32 · Sexo {pred.sexo || '—'}</p>
      <p>Fecha: {new Date().toLocaleDateString()}</p>

      <h3>Tabla de resultados</h3>
      {detalles.length === 0 ? (
        <p>No hay datos de parámetros en este resultado.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Parámetro</th><th>Valor</th><th>Rango</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {detalles.map((d, i) => (
                <tr key={i}>
                  <td>{d.Parametro}</td>
                  <td>{d.Valor} {d.Unidad || ''}</td>
                  <td>{d.Min} – {d.Max}</td>
                  <td>{d.Estado} {d.Severidad ? `(${d.Severidad})` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{marginTop:16, display:'flex', gap:24}}>
        <a href={sk ? `/patient/prediagcharts?key=${encodeURIComponent(sk)}` : '/patient/prediagcharts'}>Ver resultados en formato gráfico</a>
        <a href={sk ? `/patient/recommendations?key=${encodeURIComponent(sk)}` : '/patient/recommendations'}>Ver recomendaciones</a>
      </div>
    </div>
  )
}
