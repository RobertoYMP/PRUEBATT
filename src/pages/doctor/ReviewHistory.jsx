import React from 'react'
export default function ReviewHistory(){
  const rows = [
    { fecha:'04/05/2025', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
    { fecha:'04/05/2024', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
  ]
  return (
    <div className="card">
      <h2>Historial de pacientes</h2>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Fecha</th><th>Paciente</th><th>Examen</th><th></th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.fecha}</td><td>{r.paciente}</td><td>{r.examen}</td>
              <td><button className="btn secondary">Ver prediagnóstico</button></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  )
}
