import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const [open,setOpen] = React.useState(false)
  const { pathname } = useLocation()
  const loggedIn = pathname.startsWith('/app') || pathname.startsWith('/doctor') || pathname.startsWith('/admin')
  return (
    <header className="appbar">
      <div className="brand">
        <div className="logo">M</div>
        <strong>MEDICTT</strong>
      </div>
      <nav>
        {loggedIn ? (
          <>
            <Link to="/app">Paciente</Link>
            <Link to="/doctor">Médico</Link>
            <Link to="/admin/users">Admin</Link>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  )
}
