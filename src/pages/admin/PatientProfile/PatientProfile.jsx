import React from 'react'
export default function PatientProfile(){
  return (
    <div className="card stack">
      <h2>Perfil del paciente</h2>
      <div className="row">
        <div className="badge estable">Activo</div>
        <button className="btn danger">Eliminar paciente</button>
        <button className="btn secondary">Guardar cambios</button>
      </div>
      <h3>Historial de prediagnósticos</h3>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Fecha</th><th>Paciente</th><th>Examen</th><th></th></tr></thead>
        <tbody><tr><td>04/05/2025</td><td>Nombre del paciente</td><td>Biometría Hemática</td><td><button className="btn secondary">Visualizar</button></td></tr></tbody>
      </table></div>
    </div>
  )
}
