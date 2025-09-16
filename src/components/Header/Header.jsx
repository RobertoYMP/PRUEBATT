import React from 'react'
import { useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../../mock/api'
import './header.css'
import Button from '../Button/Button'

export default function Header() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const session = getSession()
  const role = session?.role
  const loggedIn = !!session
  function onLogout() {
    logout().then(() => nav('/login'))
  }

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <header className="appbar-container">
        <div className="brand-container">
          <div className='name-brand'>
            {!loggedIn &&
              <Link to="/" style={{ textDecoration: 'none' }}>HEMATEC</Link>
            }
            {loggedIn && role === 'patient' &&
              <Link to="/app" style={{ textDecoration: 'none' }}>HEMATEC</Link>
            }
            {loggedIn && role === 'doctor' &&
              <Link to="/doctor" style={{ textDecoration: 'none' }}>HEMATEC</Link>
            }
            {loggedIn && role === 'admin' &&
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>HEMATEC</Link>
            }
          </div>
          <div className="logo-brand">
            {!loggedIn &&
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png'/>
              </Link>
            }
            {loggedIn && role === 'patient' &&
              <Link to="/app" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png'/>
              </Link>
            }
            {loggedIn && role === 'doctor' &&
              <Link to="/doctor" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png'/>
              </Link>
            }
            {loggedIn && role === 'admin' &&
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png'/>
              </Link>
            }
          </div>
        </div>

        <div className='nav-toggle-container'>
          <div className='nav-toggle'>
            <Button
              typeButton={'header-button'} 
              onClick={() => setOpen((o) => !o)}
              content={"☰"}
              borderRadius={"var(--default-radius)"}
            />
          </div>

          <div className={open ? "card-menu-container-open" : "card-menu-container-close"}>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <div className='row-content'>
                {!loggedIn && (
                  <>
                    {location.pathname === "/register" ? (
                      <Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                    ) : location.pathname === "/login" ? (
                      <Link to="/register" onClick={() => setOpen(false)}>Registrarse</Link>
                    ) : (
                      <><Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link><Link to="/register" onClick={() => setOpen(false)}>Registrarse</Link></>
                    )}
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
        </div>

        <nav className="menu-container">
          {!loggedIn && (
            <>
              {location.pathname === "/register" ? (
                <Button
                  as={Link}
                  to="/login"
                  typeButton={"header-button-primary"}
                  content={"Iniciar sesión"}
                  width={"7rem"}
                  borderRadius={"var(--default-radius)"}
                />
              ) : location.pathname === "/login" ? (
                <Button
                  as={Link}
                  to="/register"
                  typeButton={"header-button"}
                  content={"Registrarse"}
                  width={"7rem"}
                  borderRadius={"var(--half-radius)"}
                />
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    typeButton={"header-button-primary"}
                    content={"Iniciar sesión"}
                    width={"7rem"}
                    borderRadius={"var(--default-radius)"}
                  />
                  <Button
                    as={Link}
                    to="/register"
                    typeButton={"header-button"}
                    content={"Registrarse"}
                    width={"7rem"}
                    borderRadius={"var(--half-radius)"}
                  />
                </>
              )}
            </>
          )}

          {loggedIn && role === 'patient' && (
            <>
              <Button
                as={Link} 
                to="/app"  
                typeButton={'header-button-primary'} 
                content={"Paciente"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
              <Button
                as={Link} 
                to="/app/history"  
                typeButton={'header-button-primary'} 
                content={"Historial"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
              <Button
                as={Link} 
                to="/app/notifications"  
                typeButton={'header-button-primary'} 
                content={"Notificaciones"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
            </>
          )}

          {loggedIn && role === 'doctor' && (
            <>
              <Button
                as={Link} 
                to="/doctor"  
                typeButton={'header-button-primary'} 
                content={"Médico"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
              <Button
                as={Link} 
                to="/doctor/reviews"  
                typeButton={'header-button-primary'} 
                content={"Revisiones"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
              <Button
                as={Link} 
                to="/doctor/edit-recommendations"  
                typeButton={'header-button-primary'} 
                content={"Recomendaciones"} 
                width={"10rem"}
                borderRadius={"var(--default-radius)"}
              />
            </>
          )}

          {loggedIn && role === 'admin' && (
            <>
              <Button
                as={Link} 
                to="/admin/users"  
                typeButton={'header-button-primary'} 
                content={"Administrar"} 
                width={"7rem"}
                borderRadius={"var(--default-radius)"}
              />
              <Button
                as={Link} 
                to="/admin/new-specialist"  
                typeButton={'header-button-primary'} 
                content={"Agregar médico"} 
                width={"10rem"}
                borderRadius={"var(--default-radius)"}
              />
            </>
          )}

          {loggedIn && (
            <Button
              typeButton={'header-button'} 
              content={"Salir"} 
              width={"5rem"}
              borderRadius={"var(--half-radius)"}
              onClick={onLogout}
            />
          )}
        </nav>
      </header>
    </>
  )
}