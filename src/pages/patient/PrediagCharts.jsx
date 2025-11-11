import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { usePrediction } from '../../hooks/usePrediction'

function tripletData(min, val, max) {
  const rows = []
  if (min != null) rows.push({ name: 'Mín', v: Number(min) })
  rows.push({ name: 'Usuario', v: Number(val) })
  if (max != null) rows.push({ name: 'Máx', v: Number(max) })
  return rows
}

export default function PrediagCharts(){
  const { detalles, loading, error } = usePrediction(true)

  return (
    <div className="card stack">
      <h2>Resultados en formato gráfico</h2>
      <p>Cada tarjeta muestra el mínimo, el valor del usuario y el máximo de referencia.</p>

      {loading && <p>Cargando…</p>}
      {error && <p className="badge critico">Error: {error}</p>}
      {!loading && !error && detalles.length === 0 && <p>No hay parámetros para graficar.</p>}

      <div className="grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'1rem'}}>
        {detalles.map((d, i) => {
          const data = tripletData(d.Min, d.Valor, d.Max)
          return (
            <div className="card" key={i} style={{padding:'0.75rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8}}>
                <h4 style={{margin:0}}>{d.Parametro}</h4>
                {d.Unidad ? <small style={{opacity:.7}}>{d.Unidad}</small> : null}
              </div>
              <div style={{width:'100%', height:220, marginTop:8}}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="v" stroke="currentColor" dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, opacity:.8}}>
                <span>Min: {d.Min ?? '—'}</span>
                <span>Usuario: {d.Valor}</span>
                <span>Max: {d.Max ?? '—'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
