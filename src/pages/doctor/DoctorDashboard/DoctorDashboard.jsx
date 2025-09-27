import React from 'react'
import { Link } from 'react-router-dom'
import './DoctorDashboard.css'

export default function DoctorDashboard(){
  return (
    <div className="doctordashboard-container">
      <h2>¡Es un placer tenerte aquí, Doctor!</h2>
      <div className='informative'>
        <b>PACIENTES EN ESTADO CRÍTICO</b>
      </div>
      <div className="card">
        <div className="row">
          <Link className="btn" to="/doctor/reviews">Pacientes en estado crítico</Link>
          <Link className="btn secondary" to="/doctor/edit-recommendations">Editar recomendaciones</Link>
        </div>
      </div>
      <div className="card">
        <h3>Notificaciones</h3>
        <p>Nuevo paciente en estado crítico (05/02/2025)</p>
      </div>
    </div>
  )
}
