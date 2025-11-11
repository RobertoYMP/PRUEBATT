import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// Helpers de estado
function sevToBadgeClass(sev = 'ok') {
  const s = String(sev).toLowerCase()
  if (['grave', 'severo', 'severa', 'high'].includes(s)) return 'grave'
  if (['leve', 'moderado', 'moderada', 'medium'].includes(s)) return 'critico'
  return 'estable'
}
function globalStatus(detalles = []) {
  const severidades = detalles.map(d => String(d.Severidad || 'ok').toLowerCase())
  if (severidades.some(s => ['grave', 'severo', 'severa', 'high'].includes(s))) return {label:'ESTADO GRAVE', cls:'grave'}
  if (severidades.some(s => ['leve', 'moderado', 'moderada', 'medium'].includes(s))) return {label:'ESTADO CRÍTICO', cls:'critico'}
  return {label:'ESTADO ESTABLE', cls:'estable'}
}

// Fallbacks de demo (opcional)
const DEMO_PATIENT = { nombre: 'Paciente', edad: 32, sexo: 'Hombre', fecha: new Date().toLocaleDateString() }
const DEMO_RESULT = typeof window !== 'undefined' && window.MODEL_DEMO ? window.MODEL_DEMO : null

function useModelResult() {
  const { state } = useLocation()
  // 1) viene por navegación
  if (state?.result) return state.result
  // 2) quedó en localStorage (por tu lambda/API)
  try {
    const raw = localStorage.getItem('lastPrediction')
    if (raw) return JSON.parse(raw)
  } catch {}
  // 3) demo global
  if (DEMO_RESULT) return DEMO_RESULT
  return null
}

export default function PrediagResults() {
  const result = useModelResult()

  // Datos de cabecera
  const paciente = {
    ...DEMO_PATIENT,
    sexo: result?.sexo || DEMO_PATIENT.sexo
  }

  const detalles = Array.isArray(result?.detalles) ? result.detalles : []
  const g = globalStatus(detalles)

  return (
    <div className="stack">
      <div className="card">
        <h2>Resultados del prediagnóstico</h2>
        <p className={`badge ${g.cls}`} style={{display:'inline-block'}}>{g.label}</p>

        <h3>Datos del paciente</h3>
        <p>{paciente.nombre} · Edad {paciente.edad} · Sexo {paciente.sexo}</p>
        <p>Fecha: {paciente.fecha}</p>

        <h3>Tabla de resultados</h3>
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
              {detalles.map((r, i) => {
                const estado = r.Estado || 'normal'
                const sev    = r.Severidad || 'ok'
                const badge  = sevToBadgeClass(sev)
                const rango  = (r.Min!=null && r.Max!=null) ? `${r.Min}–${r.Max} ${r.Unidad||''}`.trim() : '—'
                return (
                  <tr key={i}>
                    <td>{r.Parametro}</td>
                    <td>{r.Valor}{r.Unidad ? ` ${r.Unidad}` : ''}</td>
                    <td>{rango}</td>
                    <td>
                      <span className={`badge ${badge}`} style={{textTransform:'uppercase'}}>
                        {estado} {sev !== 'ok' ? `· ${sev}` : ''}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row">
        <Link className="btn" to="/app/charts" state={{ result }}>Ver resultados en formato gráfico</Link>
        <Link className="btn secondary" to="/app/recommendations" state={{ result }}>Ver recomendaciones</Link>
      </div>
    </div>
  )
}
