import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import '../../styles/ForgotPassword.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Button from '../../components/Button/Button.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  function onSubmit(e){ e.preventDefault(); setSent(true) }
  return (
    <div className='forgot-container'>
      <div className='forgot-logo'>
        <div className='forgot-container'>
          <FontAwesomeIcon icon={faLock} />
        </div>
      </div>
      <div className="forgot-card">
        <div className='forgot-header'>
          <div className='forgot-tittle'>
            <h2>Recuperar Contraseña</h2>
          </div>
        </div>
        <div className='body-forgot-card'>
          {!sent ? (
            <form onSubmit={onSubmit} className="stack">
              <FormField label="Ingrese su correo electrónico a continuación:" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <button className="button-primary forgot-button">Enviar correo de recuperación</button>
            </form>
          ) : (
            <div className="mail-sent">
              <div className="badge estable" style={{width: "80%"}}>Correo enviado</div>
              <p>Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja o spam.</p>
              <Button
                as={Link}
                to="/login"
                typeButton={"button-primary"}
                content={"Iniciar sesión"}
                borderRadius={"var(--default-radius)"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
