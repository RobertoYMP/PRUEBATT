// src/auth/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import { signIn, getRoleFromClaims } from './cognito'
import '../../styles/login.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { claims } = await signIn({ email, password })
      const role = getRoleFromClaims(claims) // 'admin' | 'doctor' | 'patient'
      if (role === 'admin')  return nav('/admin/users')
      if (role === 'doctor') return nav('/doctor')
      return nav('/app') // patient
    } catch (err) {
      setError(err.message || String(err))
    }
  }

  return (
    <div className='login-container'>
      <div className='login-logo'>
        <div className='logo-container'>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
      <div className="login-card">
        <div className='login-header'>
          <div className='login-tittle'>
            <h2>Iniciar Sesión</h2>
          </div>
        </div>
        <div className='body-login-card'>
          {error && <div className="badge critico complete">{error}</div>}
          <form onSubmit={onSubmit} className="top-margin">
            <FormField
              label="Usuario (email):"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label="Contraseña:"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="button-primary login-button" type="submit" style={{borderRadius: "var(--default-radius)"}}>Iniciar Sesión</button>
          </form>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <Link to="/forgot">¿Has olvidado tu contraseña?</Link>
            <Link to="/register">Registrarse</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
