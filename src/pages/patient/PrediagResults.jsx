import React from 'react'
import { Link } from 'react-router-dom'
import { usePrediction } from '../../hooks/usePrediction'

function sevToBadgeClass(sev = 'ok') {
  const s = String(sev).toLowerCase()
  if (['grave','severo','severa','high'].includes(s)) return 'grave'
  if (['leve','moderado','moderada','medium'].includes(s)) return 'critico'
  return 'estable'
}
function globalStatus(detalles = []) {
  const severidades = detalles.map(d => String(d.Severidad || 'ok').toLowerCase())
  if (severidades.some(s => ['grave','severo','severa','high'].includes(s))) return {label:'ESTADO GRAVE', cls:'grave'}
  if (severidades.some(s => ['leve','moderado','moderada','medium'].includes(s))) return {label:'ESTADO CRÍTICO', cls:'critico'}
  return {label:'ESTADO ESTABLE', cls:'estable'}
}

export default function PrediagResults() {
  const { result, detalles, loading, error } = usePrediction(true)

  const paciente = {
    nombre: 'Paciente',
    edad: 32,
    sexo: result?.sexo || '—',
    fecha: new Date().toLocaleDateString()
  }

  const g = globalStatus(detalles)

  return (
    <div className="stack">
      <div className="card">
        <h2>Resultados del prediagnóstico</h2>

        {loading && <p>Cargando resultados…</p>}
        {error && <p className="badge critico">Error: {error}</p>}

        {!loading && !error && (
          <>
            <p className={`badge ${g.cls}`} style={{display:'inline-block'}}>{g.label}</p>

            <h3>Datos del paciente</h3>
            <p>{paciente.nombre} · Edad {paciente.edad} · Sexo {paciente.sexo}</p>
            <p>Fecha: {paciente.fecha}</p>

            <h3>Tabla de resultados</h3>
            {detalles.length === 0 ? (
              <p>No hay datos de parámetros en este resultado.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Parámetro</th>
                      <th>Valor</th>
                      <th>Rango</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((r,i)=> {
                      const estado = r.Estado || 'normal'
                      const sev = r.Severidad || 'ok'
                      const badge = sevToBadgeClass(sev)
                      const rango = (r.Min!=null && r.Max!=null)
                        ? `${r.Min}–${r.Max} ${r.Unidad||''}`.trim()
                        : '—'
                      return (
                        <tr key={i}>
                          <td>{r.Parametro}</td>
                          <td>{r.Valor}{r.Unidad ? ` ${r.Unidad}` : ''}</td>
                          <td>{rango}</td>
                          <td><span className={`badge ${badge}`} style={{textTransform:'uppercase'}}>{estado}{sev!=='ok' ? ` · ${sev}` : ''}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="row">
        <Link className="btn" to="/app/charts">Ver resultados en formato gráfico</Link>
        <Link className="btn secondary" to="/app/recommendations">Ver recomendaciones</Link>
      </div>
    </div>
  )
}
