import React from 'react'
import { usePrediction } from '../../hooks/usePrediction'
import { fetchLatestPrediction, fetchPredictionByKey } from '../../api/historyClient'
import { safeArray } from '../../lib/prediag'

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

export default function Recommendations(){
  const { result, detalles, loading, error } = usePrediction(true)
  const dest = Array.isArray(result?.recomendaciones_destacadas) ? result.recomendaciones_destacadas : []
  const nota = result?.nota

  const específicas = detalles
    .filter(d => String(d.Severidad||'ok').toLowerCase() !== 'ok')
    .sort((a,b) => sevToOrder(b.Severidad) - sevToOrder(a.Severidad))

  return (
    <div
      className="card stack"
      style={{
        maxWidth: '720px',
        margin: '3rem auto 4rem',
        padding: '2.5rem 3rem',
        borderRadius: '32px',
        backgroundImage: 'linear-gradient(#ffffff,#ffffff),linear-gradient(135deg,#1b3a4e,#8facbf)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        border: '6px solid transparent'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.75rem' }}>Recomendaciones</h2>

      {loading && <p>Cargando…</p>}
      {error && <p className="badge critico">Error: {error}</p>}

      {/* Cuadro de AVISO, grande como en el mockup */}
      <div
        className="card"
        style={{
          marginTop: '0.5rem',
          padding: '1.75rem 2rem',
          borderRadius: '28px',
          backgroundImage: 'linear-gradient(#f9fbfd,#f9fbfd),linear-gradient(135deg,#1b3a4e,#8facbf)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '5px solid transparent',
          minHeight: '220px',
          display: 'flex',
          alignItems: 'flex-start'
        }}
      >
        <p style={{ lineHeight: 1.5 }}>
          <strong>Aviso:</strong>{' '}
          {nota || 'Contenido educativo; no sustituye valoración médica.'}
        </p>
      </div>

      {/* Cuadro de PRIORITARIAS, mismo estilo que el de arriba */}
      {dest.length > 0 && (
        <div
          className="card stack"
          style={{
            marginTop: '1.75rem',
            padding: '1.75rem 2rem',
            borderRadius: '28px',
            backgroundImage: 'linear-gradient(#f9fbfd,#f9fbfd),linear-gradient(135deg,#1b3a4e,#8facbf)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            border: '5px solid transparent'
          }}
        >
          <h3 style={{ marginBottom: '0.75rem' }}>Prioritarias</h3>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.6 }}>
            {dest.map((r,i)=><li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {/* Sección por parámetro (queda debajo de los cuadros anteriores) */}
      <div className="stack" style={{ marginTop: '2rem' }}>
        <h3>Por parámetro</h3>
        {(!loading && !error && específicas.length === 0) ? (
          <p>No hay hallazgos relevantes. Mantén hábitos saludables.</p>
        ) : (
          <ul className="stack" style={{gap:'0.75rem'}}>
            {específicas.map((d, i) => (
              <li
                key={i}
                className="card"
                style={{
                  padding:'0.75rem 1rem',
                  borderRadius: '18px',
                  backgroundColor: 'var(--color-surface-2)'
                }}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                  <strong>{d.Parametro}</strong>
                  <span className={`badge ${sevToBadge(d.Severidad)}`} style={{textTransform:'uppercase'}}>
                    {d.Estado} · {d.Severidad}
                  </span>
                </div>
                <div style={{fontSize:13, opacity:.85, marginTop:4}}>
                  Valor: <strong>{d.Valor}{d.Unidad ? ` ${d.Unidad}` : ''}</strong> · Referencia: {d.Min ?? '—'}–{d.Max ?? '—'}
                </div>
                {d.Recomendacion && <p style={{marginTop:6}}>{d.Recomendacion}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
