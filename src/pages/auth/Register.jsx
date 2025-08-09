import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import { register } from '../../mock/api.js'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', password:'', confirm:'', edad:'', sexo:'Mujer' })
  const [error, setError] = useState('')
  function set(k,v){ setForm(s=>({...s,[k]:v})) }

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return }
    try {
      await register({ ...form, fechaRegistro: new Date().toISOString().slice(0,10) })
      nav('/login')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="card stack" style={{maxWidth: 640, margin: '40px auto'}}>
      <h2>Registro</h2>
      {error && <div className="badge critico">{error}</div>}
      <form onSubmit={onSubmit} className="stack">
        <div className="stack-2" style={{gap:16}}>
          <div style={{flex:1}}><FormField label="Nombre" value={form.nombre} onChange={e=>set('nombre',e.target.value)} required /></div>
          <div style={{flex:1}}><FormField label="Apellido" value={form.apellido} onChange={e=>set('apellido',e.target.value)} required /></div>
        </div>
        <FormField label="Correo electrónico" type="email" value={form.email} onChange={e=>set('email',e.target.value)} required />
        <div className="stack-2" style={{gap:16}}>
          <div style={{flex:1}}><FormField label="Contraseña" type="password" value={form.password} onChange={e=>set('password',e.target.value)} required /></div>
          <div style={{flex:1}}><FormField label="Confirmación de contraseña" type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} required /></div>
        </div>
        <div className="stack-2">
          <div style={{flex:1}} className="field">
            <label>Edad</label>
            <input type="number" value={form.edad} onChange={e=>set('edad',e.target.value)} />
          </div>
          <div style={{flex:1}} className="field">
            <label>Sexo</label>
            <select value={form.sexo} onChange={e=>set('sexo',e.target.value)}>
              <option>Mujer</option><option>Hombre</option><option>Otro</option>
            </select>
          </div>
        </div>
        <button className="btn" type="submit">Registrarse</button>
        <Link to="/login">Iniciar sesión</Link>
      </form>
    </div>
  )
}
