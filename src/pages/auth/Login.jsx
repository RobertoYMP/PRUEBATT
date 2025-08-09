import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import { login } from '../../mock/api.js'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      nav('/app')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card stack" style={{maxWidth: 480, margin: '40px auto'}}>
      <h2>Iniciar sesión</h2>
      <p style={{color:'var(--color-muted)'}}>Consulta nuestros términos y condiciones</p>
      {error && <div className="badge critico">{error}</div>}
      <form onSubmit={onSubmit} className="stack">
        <FormField label="Correo electrónico" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <FormField label="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" type="submit">Iniciar Sesión</button>
      </form>
      <div className="row" style={{justifyContent:'space-between'}}>
        <Link to="/forgot">¿Has olvidado tu contraseña?</Link>
        <Link to="/register">Registrarse</Link>
      </div>
    </div>
  )
}
