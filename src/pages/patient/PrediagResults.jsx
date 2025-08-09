import React from 'react'
import { DEMO_PATIENT, DEMO_RESULTS } from '../../utils/constants.js'
import { Link } from 'react-router-dom'

export default function PrediagResults() {
  return (
    <div className="stack">
      <div className="card">
        <h2>Resultados del prediagnóstico</h2>
        <p className="badge critico" style={{display:'inline-block'}}>ESTADO CRÍTICO</p>
        <h3>Datos del paciente</h3>
        <p>{DEMO_PATIENT.nombre} · Edad {DEMO_PATIENT.edad} · Sexo {DEMO_PATIENT.sexo}</p>
        <p>Fecha: {DEMO_PATIENT.fecha}</p>

        <h3>Tabla de resultados</h3>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Parámetro</th><th>Valor</th><th>Rango</th><th>Estado</th></tr></thead>
          <tbody>
            {DEMO_RESULTS.map((r,i)=>(
              <tr key={i}><td>{r.parametro}</td><td>{r.valor}</td><td>{r.rango}</td><td>{r.estado}</td></tr>
            ))}
          </tbody>
        </table></div>
      </div>

      <div className="row">
        <Link className="btn" to="/app/charts">Ver resultados en formato gráfico</Link>
        <Link className="btn secondary" to="/app/recommendations">Ver recomendaciones</Link>
      </div>
    </div>
  )
}
