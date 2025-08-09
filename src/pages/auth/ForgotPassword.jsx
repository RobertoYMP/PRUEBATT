import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  function onSubmit(e){ e.preventDefault(); setSent(true) }
  return (
    <div className="card stack" style={{maxWidth: 520, margin: '40px auto'}}>
      <h2>Recuperar Contraseña</h2>
      {!sent ? (
        <form onSubmit={onSubmit} className="stack">
          <FormField label="Ingrese su correo electrónico" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="btn">Enviar correo de recuperación</button>
        </form>
      ) : (
        <div className="stack">
          <div className="badge estable">Correo enviado</div>
          <p>Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja o spam.</p>
          <Link to="/login" className="btn secondary">Iniciar Sesión</Link>
        </div>
      )}
    </div>
  )
}
