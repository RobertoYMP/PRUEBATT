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
    // CONTENEDOR QUE OCUPE TODO EL ANCHO
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        padding: '2rem 1rem 3rem',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #1b3a4e, #8facbf)'
      }}
    >
      {/* MARCO GRANDE CON BORDE REDONDEADO COMPLETO */}
      <div
        style={{
          width: '100%',
          minHeight: '80vh',
          padding: '2.5rem 2rem 3rem',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          // Borde gradiente redondeado CORREGIDO
          border: '4px solid',
          borderImage: 'linear-gradient(135deg, #1b3a4e, #8facbf) 1',
          borderImageSlice: 1
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
            fontSize: '2rem',
            color: '#1b3a4e'
          }}
        >
          Recomendaciones
        </h2>

        {loading && <p style={{textAlign: 'center'}}>Cargando…</p>}
        {error && <p className="badge critico" style={{textAlign: 'center'}}>Error: {error}</p>}

        {/* CUADRO AVISO CON BORDE REDONDEADO COMPLETO */}
        <div
          style={{
            width: '90%',
            margin: '0 auto 2.5rem',
            padding: '2rem',
            borderRadius: '20px',
            backgroundColor: '#f8fafc',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            // Borde gradiente redondeado CORREGIDO
            border: '3px solid',
            borderImage: 'linear-gradient(135deg, #1b3a4e, #8facbf) 1',
            borderImageSlice: 1
          }}
        >
          <p style={{ 
            lineHeight: 1.6, 
            margin: 0,
            fontSize: '1.1rem',
            textAlign: 'center',
            color: '#374151'
          }}>
            <strong style={{color: '#dc2626'}}>Aviso:</strong>{' '}
            {nota || 'Contenido educativo; no sustituye valoración médica.'}
          </p>
        </div>

        {/* CUADRO PRIORITARIAS CON BORDE REDONDEADO COMPLETO */}
        {dest.length > 0 && (
          <div
            style={{
              width: '90%',
              margin: '0 auto 2.5rem',
              padding: '2rem',
              borderRadius: '20px',
              backgroundColor: '#f8fafc',
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              // Borde gradiente redondeado CORREGIDO
              border: '3px solid',
              borderImage: 'linear-gradient(135deg, #1b3a4e, #8facbf) 1',
              borderImageSlice: 1
            }}
          >
            <h3 style={{ 
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              textAlign: 'center',
              color: '#1b3a4e'
            }}>
              Prioritarias
            </h3>
            <ul style={{ 
              paddingLeft: '1.5rem', 
              lineHeight: 1.7,
              margin: 0
            }}>
              {dest.map((r,i)=>
                <li key={i} style={{
                  marginBottom: '0.75rem',
                  fontSize: '1.05rem'
                }}>
                  {r}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* POR PARÁMETRO - TARJETAS CON BORDES REDONDEADOS COMPLETOS */}
        <div style={{ 
          marginTop: '2.5rem',
          width: '100%'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#1b3a4e'
          }}>
            Por parámetro
          </h3>
          {(!loading && !error && específicas.length === 0) ? (
            <p style={{
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#6b7280'
            }}>
              No hay hallazgos relevantes. Mantén hábitos saludables.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
            }}>
              {específicas.map((d, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: '#f8fafc',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease',
                    // Borde gradiente redondeado CORREGIDO
                    border: '2px solid',
                    borderImage: 'linear-gradient(135deg, #1b3a4e, #8facbf) 1',
                    borderImageSlice: 1
                  }}
                >
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <strong style={{
                      fontSize: '1.1rem',
                      color: '#1b3a4e'
                    }}>{d.Parametro}</strong>
                    <span className={`badge ${sevToBadge(d.Severidad)}`} style={{
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      padding: '4px 12px'
                    }}>
                      {d.Estado} · {d.Severidad}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.9rem', 
                    color: '#6b7280',
                    marginBottom: '12px',
                    lineHeight: 1.5
                  }}>
                    Valor: <strong style={{color: '#1b3a4e'}}>{d.Valor}{d.Unidad ? ` ${d.Unidad}` : ''}</strong> · Referencia: {d.Min ?? '—'}–{d.Max ?? '—'}
                  </div>
                  {d.Recomendacion && (
                    <p style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      color: '#374151',
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      borderLeft: '4px solid #8facbf'
                    }}>
                      {d.Recomendacion}
                    </p>
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
