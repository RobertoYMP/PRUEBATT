import React from 'react'
import { useLocation } from 'react-router-dom'

function sevToOrder(sev='ok'){
  const s = String(sev).toLowerCase()
  if (['grave','severo','severa','high'].includes(s)) return 2
  if (['leve','moderado','moderada','medium'].includes(s)) return 1
  return 0
}
function sevToBadge(sev='ok'){
  const s = String(sev).toLowerCase()
  if (['grave','severo','severa','high'].includes(s)) return 'grave'
  if (['leve','moderado','moderada','medium'].includes(s)) return 'critico'
  return 'estable'
}

function useModelResult() {
  const { state } = useLocation()
  if (state?.result) return state.result
  try {
    const raw = localStorage.getItem('lastPrediction')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export default function Recommendations(){
  const result = useModelResult()
  const detalles = Array.isArray(result?.detalles) ? result.detalles : []
  const dest = Array.isArray(result?.recomendaciones_destacadas) ? result.recomendaciones_destacadas : []
  const nota = result?.nota

  // Recomendaciones por parámetro con desviación (no ok)
  const específicas = detalles
    .filter(d => String(d.Severidad||'ok').toLowerCase() !== 'ok')
    .sort((a,b) => sevToOrder(b.Severidad) - sevToOrder(a.Severidad))

  return (
    <div className="card stack">
      <h2>Recomendaciones</h2>

      {/* Aviso general */}
      <div className="card" style={{background:'var(--color-surface-2)'}}>
        <p><strong>Aviso:</strong> {nota || 'Recomendaciones informativas; no sustituyen valoración médica.'}</p>
      </div>

      {/* Destacadas del modelo */}
      {dest.length > 0 && (
        <div className="card stack">
          <h3>Prioritarias</h3>
          <ul>
            {dest.map((r,i)=><li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {/* Por parámetro con estado no-ok */}
      <div className="stack">
        <h3>Por parámetro</h3>
        {específicas.length === 0 ? (
          <p>No hay hallazgos relevantes. Mantén hábitos saludables.</p>
        ) : (
          <ul className="stack" style={{gap:'0.75rem'}}>
            {específicas.map((d, i) => (
              <li key={i} className="card" style={{padding:'0.75rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                  <strong>{d.Parametro}</strong>
                  <span className={`badge ${sevToBadge(d.Severidad)}`} style={{textTransform:'uppercase'}}>
                    {d.Estado} · {d.Severidad}
                  </span>
                </div>
                <div style={{fontSize:13, opacity:.85, marginTop:4}}>
                  Valor: <strong>{d.Valor}{d.Unidad ? ` ${d.Unidad}` : ''}</strong> · Referencia: {d.Min ?? '—'}–{d.Max ?? '—'}
                </div>
                {d.Recomendacion && (
                  <p style={{marginTop:6}}>{d.Recomendacion}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
