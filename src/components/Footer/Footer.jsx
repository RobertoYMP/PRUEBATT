import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} HEMATEC</p>
      <p>
        <Link to="/terms" style={{ textDecoration: 'none' }}>
          Consulta nuestros términos y condiciones
        </Link>
      </p>
    </footer>
  )
}
