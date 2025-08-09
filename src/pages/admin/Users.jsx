import React from 'react'
import { Link } from 'react-router-dom'
export default function Users(){
  return (
    <div className="stack">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2>Gestión de roles y permisos</h2>
        <Link className="btn" to="/admin/new-specialist">Agregar médico especialista</Link>
      </div>
      <div className="card">
        <h3>Listado de usuarios</h3>
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Nombre</th><th>Tipo</th><th>Fecha de registro</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>
            <tr><td>Nombre completo</td><td>Paciente</td><td>04/05/2025</td><td>Activo</td><td><Link className="btn secondary" to="/admin/patient-profile">Gestionar</Link></td></tr>
            <tr><td>Nombre completo</td><td>Médico especialista</td><td>04/05/2025</td><td>Activo</td><td><Link className="btn secondary" to="/admin/specialist-profile">Gestionar</Link></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
