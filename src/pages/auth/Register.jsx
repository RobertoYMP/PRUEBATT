import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import { signUp, confirmSignUp } from './cognito'
import '../../styles/register.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    nombre:'', apellido:'', email:'', password:'', confirm:'', edad:'', sexo:'Mujer',
    role:'patient' // 👈 opcional (para pruebas). En prod puedes ocultarlo y asignar por grupos.
  })
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [step, setStep] = useState('signup') // signup | confirm
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function set(k,v){ setForm(s=>({...s,[k]:v})) }

  async function onSubmit(e){
    e.preventDefault()
    setError(''); setMsg('')
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        name: `${form.nombre} ${form.apellido}`.trim(), // atributo "name" en Cognito
        role: form.role // 👈 si usas custom:role; si usas Groups, puedes quitar esto
      })
      setMsg('Usuario creado. Revisa tu correo y escribe el código de confirmación.')
      setStep('confirm')
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  async function onConfirm(e){
    e.preventDefault()
    setError(''); setMsg('Confirmando...')
    setConfirming(true)
    try {
      await confirmSignUp({ email: form.email, code })
      setMsg('Cuenta confirmada. Ahora puedes iniciar sesión.')
      setTimeout(()=> nav('/login'), 800)
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="register-container">
      <div className='register-logo'>
        <div className='logo-container'>
          <FontAwesomeIcon icon={faUserPlus} />
        </div>
      </div>
      <div className='register-card'>
        <div className='login-header'>
          <div className='login-tittle'>
            <h2>Registro</h2>
          </div>
        </div>
        <div className='body-login-card'>
          {error && <div className="badge critico complete">{error}</div>}
          {msg && <div className="badge complete">{msg}</div>}

          {step === 'signup' && (
            <form onSubmit={onSubmit} className="stack top-margin">
              <div className="stack-2" style={{gap:16}}>
                <div style={{flex:1}}>
                  <FormField label="Nombre:" value={form.nombre} onChange={e=>set('nombre',e.target.value)} required />
                </div>
                <div style={{flex:1}}>
                  <FormField label="Apellido:" value={form.apellido} onChange={e=>set('apellido',e.target.value)} required />
                </div>
              </div>

              <FormField
                label="Correo electrónico:"
                type="email"
                value={form.email}
                onChange={e=>set('email',e.target.value)}
                required
              />

              <div className="stack-2" style={{gap:16}}>
                <div style={{flex:1}}>
                  <FormField label="Contraseña:" type="password" value={form.password} onChange={e=>set('password',e.target.value)} required />
                </div>
                <div style={{flex:1}}>
                  <FormField label="Confirmación de contraseña:" type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} required />
                </div>
              </div>

              <div className="stack-2">
                <div style={{flex:1}} className="field">
                  <label>Edad:</label>
                  <input type="number" value={form.edad} onChange={e=>set('edad',e.target.value)} />
                </div>
                <div style={{flex:1}} className="field">
                  <label>Sexo:</label>
                  <select value={form.sexo} onChange={e=>set('sexo',e.target.value)}>
                    <option>Mujer</option>
                    <option>Hombre</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              {/* 👇 Selector de rol: útil para pruebas con custom:role.
                  Si usas Cognito Groups, quítalo del UI y asigna rol por CLI/Consola. */}
              <div className="field">
                <label>Rol (solo pruebas):</label>
                <select value={form.role} onChange={e=>set('role', e.target.value)}>
                  <option value="patient">Paciente</option>
                  <option value="doctor">Médico</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button className="button-primary register-button" type="submit" disabled={loading}>
                {loading ? 'Registrando…' : 'Registrarse'}
              </button>
            </form>
          )}

          {step === 'confirm' && (
            <form onSubmit={onConfirm} className="stack top-margin">
              <FormField
                label="Correo (para confirmar):"
                type="email"
                value={form.email}
                onChange={e=>set('email',e.target.value)}
                required
              />
              <FormField
                label="Código de confirmación:"
                value={code}
                onChange={e=>setCode(e.target.value)}
                required
              />
              <button className="button-primary" type="submit" disabled={confirming}>
                {confirming ? 'Confirmando…' : 'Confirmar'}
              </button>
            </form>
          )}

          <div className='row' style={{ justifyContent: 'space-between', marginTop: 12 }}>
            <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
