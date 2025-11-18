// src/pages/patient/PrediagCharts.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { fetchLatestPrediction, fetchPredictionByKey } from '../../api/historyClient'

function tripletData(min, val, max) {
  const rows = []
  if (min != null) rows.push({ name: 'Mín', v: Number(min) })
  rows.push({ name: 'Usuario', v: Number(val) })
  if (max != null) rows.push({ name: 'Máx', v: Number(max) })
  return rows
}

export default function PrediagCharts() {
  const [params] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detalles, setDetalles] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const key = params.get('key')
        const pred = key
          ? await fetchPredictionByKey(key)
          : await fetchLatestPrediction()

        const det = Array.isArray(pred?.detalles) ? pred.detalles : []
        if (mounted) setDetalles(det)
      } catch (err) {
        if (mounted) setError(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [params])

  const elementos = [
    "LEUCOCITOS", "ERITROCITOS", "HEMOGLOBINA", "HEMATOCRITO", "VOLUMEN CORPUSCULAR MEDIO",
    "HEMOGLOBINA CORPUSCULAR MEDIA", "CONC. MEDIA DE HB CORPUSCULAR", "ANCHO DE DISTRIBUCIÓN ERITROCITARIA (D.E.)",
    "ANCHO DE DISTRIBUCIÓN ERITROCITARIA (C.V.)", "PLAQUETAS", "VOLUMEN PLAQUETARIO MEDIO", "NRBC", "NRBC%",
    "IG", "IG%", "LINFOCITOS (%)", "MONOCITOS (%)", "EOSINÓFILOS (%)", "BASÓFILOS (%)", "NEUTRÓFILOS (%)",
    "LINFOCITOS", "MONOCITOS", "EOSINÓFILOS", "BASÓFILOS", "NEUTRÓFILOS"
  ]

  return (
    <div
      className="card stack"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        Resultados en formato gráfico
      </h2>
      <p style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.5rem' }}>
        Cada tarjeta muestra el mínimo, el valor del usuario y el máximo de referencia.
      </p>

      {loading && <p>Cargando…</p>}
      {error && <p className="badge critico">Error: {error}</p>}
      {!loading && !error && detalles.length === 0 && <p>No hay parámetros para graficar.</p>}

      {!loading && !error && detalles.length > 0 && (
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}
        >
          {detalles.map((d, i) => {
            const data = tripletData(d.Min, d.Valor, d.Max)
            return (
              <div
                className="card"
                key={`${d.Parametro}-${i}`}
                style={{
                  padding: '1rem 1.25rem 1.25rem',
                  borderRadius: '18px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 8
                  }}
                >
                  <h4 style={{ margin: 0 }}>{d.Parametro}</h4>
                  {d.Unidad ? (
                    <small style={{ opacity: 0.7 }}>{d.Unidad}</small>
                  ) : null}
                </div>

                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis orientation="left" />
                      <Tooltip />
                      {d.Min != null && (
                        <ReferenceLine
                          y={d.Min}
                          stroke="#ff6b6b"
                          strokeDasharray="3 3"
                          label={{ value: 'Mín', position: 'left', fill: '#ff6b6b' }}
                        />
                      )}
                      {d.Max != null && (
                        <ReferenceLine
                          y={d.Max}
                          stroke="#ff6b6b"
                          strokeDasharray="3 3"
                          label={{ value: 'Máx', position: 'left', fill: '#ff6b6b' }}
                        />
                      )}
                      <Line type="monotone" dataKey="v" stroke="#4dabf7" dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    opacity: 0.8,
                    marginTop: '0.25rem'
                  }}
                >
                  <span>Min: {d.Min ?? '—'}</span>
                  <span>Usuario: {d.Valor}</span>
                  <span>Max: {d.Max ?? '—'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div
        style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <h3 style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
          Los 25 elementos de la biometría hemática considerados para el prediagnostico
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {elementos.map((elemento, index) => (
            <div
              key={index}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: '#f5f7f9',
                borderRadius: '8px',
                fontSize: 14
              }}
            >
              {elemento}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
