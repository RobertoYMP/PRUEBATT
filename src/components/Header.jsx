import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../mock/api.js'

export default function Header() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const session = getSession()
  const role = session?.role
  const loggedIn = !!session
  function onLogout() {
    logout().then(() => nav('/login'))
  }

  // Menú móvil (si ya tenías toggle, lo puedes mantener)
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <header className="appbar">
        <div className="brand">
          <div className="logo">M</div>
          <strong>MEDICTT</strong>
        </div>

        <button
          className="btn secondary nav-toggle"
          aria-label="Abrir menú"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <nav className="primary">
          {!loggedIn && (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}

          {loggedIn && role === 'patient' && (
            <>
              <Link to="/app">Paciente</Link>
              <Link to="/app/history">Historial</Link>
              <Link to="/app/notifications">Notificaciones</Link>
            </>
          )}

          {loggedIn && role === 'doctor' && (
            <>
              <Link to="/doctor">Médico</Link>
              <Link to="/doctor/reviews">Revisiones</Link>
              <Link to="/doctor/edit-recommendations">Recomendaciones</Link>
            </>
          )}

          {loggedIn && role === 'admin' && (
            <>
              <Link to="/admin/users">Admin</Link>
              <Link to="/admin/new-specialist">Agregar médico</Link>
            </>
          )}

          {loggedIn && (
            <button className="btn secondary" onClick={onLogout}>
              Salir
            </button>
          )}
        </nav>
      </header>

      {/* Dropdown móvil simple */}
      {open && (
        <div className="card" style={{ margin: '8px 16px' }}>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <div style={{ display: 'grid', gap: 8 }}>
              {!loggedIn && (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                  <Link to="/register" onClick={() => setOpen(false)}>Registrarse</Link>
                </>
              )}

              {loggedIn && role === 'patient' && (
                <>
                  <Link to="/app" onClick={() => setOpen(false)}>Paciente</Link>
                  <Link to="/app/history" onClick={() => setOpen(false)}>Historial</Link>
                  <Link to="/app/notifications" onClick={() => setOpen(false)}>Notificaciones</Link>
                </>
              )}

              {loggedIn && role === 'doctor' && (
                <>
                  <Link to="/doctor" onClick={() => setOpen(false)}>Médico</Link>
                  <Link to="/doctor/reviews" onClick={() => setOpen(false)}>Revisiones</Link>
                  <Link to="/doctor/edit-recommendations" onClick={() => setOpen(false)}>Recomendaciones</Link>
                </>
              )}

              {loggedIn && role === 'admin' && (
                <>
                  <Link to="/admin/users" onClick={() => setOpen(false)}>Admin</Link>
                  <Link to="/admin/new-specialist" onClick={() => setOpen(false)}>Agregar médico</Link>
                </>
              )}

              {loggedIn && (
                <button className="btn secondary" onClick={() => { setOpen(false); onLogout() }}>
                  Salir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
