import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
export default function ResetPassword(){
  const [a,setA] = useState('')
  const [b,setB] = useState('')
  const [ok,setOk] = useState(false)
  function onSubmit(e){ e.preventDefault(); if(a && a===b) setOk(true) }
  return (
    <div className="card stack" style={{maxWidth:520, margin:'40px auto'}}>
      <h2>Restablecer contraseña</h2>
      {!ok ? (
        <form onSubmit={onSubmit} className="stack">
          <FormField label="Nueva contraseña" type="password" value={a} onChange={e=>setA(e.target.value)} required />
          <FormField label="Confirmación de contraseña" type="password" value={b} onChange={e=>setB(e.target.value)} required />
          <button className="btn">Restablecer contraseña</button>
        </form>
      ) : (
        <div className="stack">
          <div className="badge estable">Contraseña restablecida con éxito</div>
          <Link className="btn secondary" to="/login">Iniciar Sesión</Link>
        </div>
      )}
    </div>
  )
}
