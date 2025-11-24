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
      className="stack"
      style={{
        width: '100%',
        padding: '1.5rem 1rem 2.5rem',
        boxSizing: 'border-box'
      }}
    >
      {/* MARCO PRINCIPAL */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          borderRadius: '24px',
          backgroundImage: 'linear-gradient(#ffffff,#ffffff),linear-gradient(135deg,#1b3a4e,#8facbf)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '4px solid transparent',
          boxSizing: 'border-box'
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)'
          }}
        >
          Recomendaciones
        </h2>

        {loading && <p style={{textAlign: 'center'}}>Cargando…</p>}
        {error && <p className="badge critico" style={{textAlign: 'center'}}>Error: {error}</p>}

        {/* CONTENEDOR FLEXIBLE PARA LOS CUADROS PRINCIPALES */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            marginBottom: '2.5rem'
          }}
        >
          {/* CUADRO AVISO */}
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              padding: '1.5rem 1.5rem',
              borderRadius: '20px',
              backgroundImage: 'linear-gradient(#f9fbfd,#f9fbfd),linear-gradient(135deg,#1b3a4e,#8facbf)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              border: '4px solid transparent',
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <p style={{ 
              lineHeight: 1.6, 
              margin: 0,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              textAlign: 'center'
            }}>
              <strong>Aviso:</strong>{' '}
              {nota || 'Contenido educativo; no sustituye valoración médica.'}
            </p>
          </div>

          {/* CUADRO PRIORITARIAS */}
          {dest.length > 0 && (
            <div
              style={{
                width: '100%',
                maxWidth: '800px',
                padding: '1.5rem 1.5rem',
                borderRadius: '20px',
                backgroundImage: 'linear-gradient(#f9fbfd,#f9fbfd),linear-gradient(135deg,#1b3a4e,#8facbf)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                border: '4px solid transparent',
                boxSizing: 'border-box',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ 
                marginBottom: '1rem',
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                textAlign: 'center'
              }}>
                Prioritarias
              </h3>
              <ul style={{ 
                paddingLeft: '1.5rem', 
                lineHeight: 1.7,
                margin: 0
              }}>
                {dest.map((r,i)=>
                  <li key={i} style={{marginBottom: '0.5rem'}}>
                    {r}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* POR PARÁMETRO */}
        <div className="stack" style={{ marginTop: '1.5rem' }}>
          <h3 style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            Por parámetro
          </h3>
          {(!loading && !error && específicas.length === 0) ? (
            <p style={{textAlign: 'center'}}>No hay hallazgos relevantes. Mantén hábitos saludables.</p>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
              {específicas.map((d, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-surface-2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <strong style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.3
                    }}>{d.Parametro}</strong>
                    <span className={`badge ${sevToBadge(d.Severidad)}`} style={{
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      flexShrink: 0
                    }}>
                      {d.Estado} · {d.Severidad}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.8rem', 
                    opacity: 0.85, 
                    marginBottom: '8px',
                    lineHeight: 1.4
                  }}>
                    Valor: <strong>{d.Valor}{d.Unidad ? ` ${d.Unidad}` : ''}</strong> · Referencia: {d.Min ?? '—'}–{d.Max ?? '—'}
                  </div>
                  {d.Recomendacion && (
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}>{d.Recomendacion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
