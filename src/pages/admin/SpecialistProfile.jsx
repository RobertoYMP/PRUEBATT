import React from 'react'
export default function SpecialistProfile(){
  return (
    <div className="card stack">
      <h2>Perfil del médico especialista</h2>
      <div className="row">
        <div className="badge estable">Activo</div>
        <button className="btn danger">Eliminar médico</button>
        <button className="btn secondary">Editar médico</button>
      </div>
      <h3>Historial de pacientes revisados</h3>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Fecha de revisión</th><th>Paciente</th><th>Examen</th><th></th></tr></thead>
        <tbody><tr><td>04/05/2025</td><td>Nombre del paciente</td><td>Biometría Hemática</td><td><button className="btn secondary">Ver prediagnóstico</button></td></tr></tbody>
      </table></div>
    </div>
  )
}
