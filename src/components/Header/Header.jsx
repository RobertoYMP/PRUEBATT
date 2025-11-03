import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import Button from '../Button/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faChevronDown, faBell, faBars, faRightFromBracket, faFile, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from 'react-transition-group';
import NotificationList from "../Notification/NotificationList";
import { useNotifications } from "../../context/NotificationContext";

// ⬇️ Usa helpers reales de Cognito
import { isSessionValid, getSession, signOut } from '../../pages/auth/cognito'

export default function Header() {
  const { pathname } = useLocation()
  const nav = useNavigate()

  const loggedIn = isSessionValid()
  const session = getSession()
  const role = session?.role

  const claims = session?.claims || {}
  const displayName =
    claims.name ||
    [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
    claims.email || 'Usuario'

  function onLogout() {
    try { signOut() } finally {
      setIsOpen(false)
      nav('/login', { replace: true })
    }
  }

  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { notifications, removeNotification } = useNotifications()

  useEffect(() => { setIsOpen(false) }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <header className="appbar-container">
        <div className="brand-container">
          <div className='name-brand'>
            {!loggedIn &&
              <Link to="/" style={{ textDecoration: 'none' }}><strong>HEMATEC</strong></Link>
            }
            {loggedIn && role === 'patient' &&
              <Link to="/app" style={{ textDecoration: 'none' }}><strong>HEMATEC</strong></Link>
            }
            {loggedIn && role === 'doctor' &&
              <Link to="/doctor" style={{ textDecoration: 'none' }}><strong>HEMATEC</strong></Link>
            }
            {loggedIn && role === 'admin' &&
              <Link to="/admin/users" style={{ textDecoration: 'none' }}><strong>HEMATEC</strong></Link>
            }
          </div>
          <div className="logo-brand">
            {!loggedIn &&
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png' alt="Hematec" />
              </Link>
            }
            {loggedIn && role === 'patient' &&
              <Link to="/app" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png' alt="Hematec" />
              </Link>
            }
            {loggedIn && role === 'doctor' &&
              <Link to="/doctor" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png' alt="Hematec" />
              </Link>
            }
            {loggedIn && role === 'admin' &&
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                <img src='/Logo/whiteLogo.png' alt="Hematec" />
              </Link>
            }
          </div>
        </div>

        <div className='nav-toggle-container'>
          <div className='nav-toggle'>
            <Button
              typeButton={'header-button'} 
              onClick={() => setOpen(o => !o)}
              content={"☰"}
              borderRadius={"var(--default-radius)"}
            />
          </div>

          <div className={open ? "card-menu-container-open" : "card-menu-container-close"}>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <div className='row-content'>
                {!loggedIn && (
                  <>
                    {pathname === "/register" ? (
                      <Link to="/login?force=1" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                    ) : pathname === "/login" ? (
                      <Link to="/register?force=1" onClick={() => setOpen(false)}>Registrarse</Link>
                    ) : (
                      <>
                        <Link to="/login?force=1" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                        <Link to="/register?force=1" onClick={() => setOpen(false)}>Registrarse</Link>
                      </>
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
                    <Link to="/doctor/history-reviews" onClick={() => setOpen(false)}>Revisiones</Link>
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
              {pathname === "/register" ? (
                <Button
                  as={Link}
                  to="/login?force=1"
                  typeButton={"header-button-primary"}
                  content={"Iniciar sesión"}
                  width={"7rem"}
                  borderRadius={"var(--default-radius)"}
                />
              ) : pathname === "/login" ? (
                <Button
                  as={Link}
                  to="/register?force=1"
                  typeButton={"header-button"}
                  content={"Registrarse"}
                  width={"7rem"}
                  borderRadius={"var(--half-radius)"}
                />
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login?force=1"
                    typeButton={"header-button-primary"}
                    content={"Iniciar sesión"}
                    width={"7rem"}
                    borderRadius={"var(--default-radius)"}
                  />
                  <Button
                    as={Link}
                    to="/register?force=1"
                    typeButton={"header-button"}
                    content={"Registrarse"}
                    width={"7rem"}
                    borderRadius={"var(--half-radius)"}
                  />
                </>
              )}
            </>
          )}

          {loggedIn && (role === 'admin' || role === 'doctor' || role === 'patient') && (
            <div className='user-header-container' onClick={toggleMenu}>
              <div className='user-container-header'>
                <div className='icon'>
                  <FontAwesomeIcon icon={faCircleUser} style={{color: "white", paddingRight: "0.5rem"}}/>
                </div>
                <div className='name'>
                  <p>| </p>
                  <p>{displayName}</p>
                </div>
              </div>
            </div>
          )}

          {loggedIn && isOpen && (
            <CSSTransition in={isOpen} timeout={300} classNames="submenu" unmountOnExit>
              <div className="submenu">
                {(role === 'doctor' || role === 'patient') && (
                  <>
                    <div className={`submenu-item ${notifOpen ? 'open' : ''}`} onClick={() => setNotifOpen(s => !s)}>
                      <FontAwesomeIcon icon={faBell} style={{ marginRight: "1rem" }} />
                      Notificaciones
                      <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "auto" }} />
                    </div>
                    {notifOpen && (
                      <>
                        <hr/>
                        <div className="notif-submenu">
                          <NotificationList
                            notifications={notifications}
                            removeNotification={removeNotification}
                          />
                        </div>
                      </>
                    )}
                    <hr />
                  </>
                )}

                {role === 'doctor' && (
                  <>
                    <Link to="/doctor/history-reviews" className="submenu-item">
                      <FontAwesomeIcon icon={faBars} style={{ marginRight: "1rem" }} />
                      Historial de pacientes
                    </Link>
                    <hr/>
                    <Link to="/doctor/edit-recommendations" className="submenu-item">
                      <FontAwesomeIcon icon={faBars} style={{ marginRight: "1rem" }} />
                      Editar recomendaciones
                    </Link>
                    <hr/>
                  </>
                )}

                {role === 'patient' && (
                  <>
                    <Link to="/app/history" className="submenu-item">
                      <FontAwesomeIcon icon={faBars} style={{ marginRight: "1rem" }} />
                      Historial
                    </Link>
                    <hr/>
                    <Link to="/app/upload" className="submenu-item">
                      <FontAwesomeIcon icon={faFile} style={{ marginRight: "1rem" }} />
                      Subir archivo
                    </Link>
                    <hr/>
                    <Link to="/app/specialists" className="submenu-item">
                      <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: "1rem" }} />
                      Especialistas
                    </Link>
                    <hr/>
                  </>
                )}

                <div className="submenu-item logout-header" onClick={onLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} style={{ marginLeft: "auto" }} />
                  Salir
                </div>
              </div>
            </CSSTransition>
          )}
        </nav>
      </header>
    </>
  )
}
