import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <div className="stack">
      <div className="card">
        <h2>¡Te damos la bienvenida, Nombre!</h2>
        <p className="muted">Consulta nuestros términos y condiciones</p>
        <div className="row" style={{marginTop:12}}>
          <Link to="/app/upload" className="btn">Subir archivo de Biometría Hemática</Link>
          <Link to="/app/history" className="btn secondary">Ver historial</Link>
          <Link to="/app/notifications" className="btn ghost">Notificaciones</Link>
          <Link to="/app/specialists" className="btn ghost">Especialistas</Link>
        </div>
      </div>
      <div className="card">
        <h3>Notificaciones</h3>
        <p>No hay notificaciones.</p>
      </div>
    </div>
  )
}
