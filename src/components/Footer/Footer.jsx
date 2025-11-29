import React from 'react'
import './Footer.css'
import { Link, useLocation } from 'react-router-dom'
import { isSessionValid, getSession } from '../../pages/auth/cognito'

export default function Footer() {
  const location = useLocation()

  const loggedIn = isSessionValid()
  const session = getSession()
  const role = session?.role

  let target = '/'

  if (loggedIn) {
    if (role === 'patient') target = '/app'
    else if (role === 'doctor') target = '/doctor'
    else if (role === 'admin') target = '/admin/users'
  }

  return (
    <footer>
      <p>
        <Link to={target} style={{ textDecoration: 'none' }}>
          © {new Date().getFullYear()} HEMATEC
        </Link>
      </p>

      <p className="footer-links">
        <Link to="/terms" style={{ textDecoration: 'none' }}>
          Términos y condiciones
        </Link>
        <span className="footer-separator">·</span>
        <Link to="/privacy" style={{ textDecoration: 'none' }}>
          Aviso de privacidad
        </Link>
      </p>
    </footer>
  )
}