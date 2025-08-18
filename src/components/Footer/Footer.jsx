import React from 'react'
import './footer.css'

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} HEMATEC</p>
      <p>Consulta nuestros términos y condiciones</p>
    </footer>
  )
}