import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import '../../styles/ForgotPassword.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Button from '../../components/Button/Button.jsx'

import { forgotPassword, resendCode } from './cognito';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [info, setInfo]     = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setError(''); setInfo('')
    setLoading(true)
    try {
      await forgotPassword({ email }) 
      try { sessionStorage.setItem('fp_email', email) } catch {}
      setSent(true)
      setInfo('Te enviamos un código de verificación a tu correo.')
    } catch (err) {
      const msg = err?.message || 'No se pudo iniciar el restablecimiento'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function onResend(){
    setError(''); setInfo('')
    if (!email) {
      setError('Escribe tu correo para reenviar el código.')
      return
    }
    setLoading(true)
    try {
      await resendCode({ email })
      setInfo('Código reenviado. Revisa tu bandeja de entrada y SPAM.')
    } catch (err) {
      const msg = err?.message || 'No se pudo reenviar el código'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='forgot-container'>
      <div className='forgot-logo'>
        <div className='forgot-container-logo'>
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
          {/* mensajes */}
          {error && <div className="badge critico" style={{ marginBottom: 12 }}>{error}</div>}
          {info  && <div className="badge estable" style={{ marginBottom: 12 }}>{info}</div>}

          {!sent ? (
            <form onSubmit={onSubmit} className="stack">
              <FormField
                label="Ingrese su correo electrónico a continuación:"
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
              />
              <button
                className="button-primary forgot-button"
                type="submit"
                disabled={loading}
                style={{ borderRadius: 'var(--default-radius)' }}
              >
                {loading ? 'Enviando…' : 'Enviar código de verificación'}
              </button>

              <button
                className="btn secondary"
                type="button"
                onClick={onResend}
                disabled={loading || !email}
                style={{ marginTop: 8 }}
              >
                Reenviar código
              </button>
            </form>
          ) : (
            <div className="mail-sent">
              <div className="badge estable" style={{ width: "80%" }}>Código enviado</div>
              <p>Te enviamos un código para restablecer tu contraseña. Revisa tu bandeja o SPAM.</p>
              <Button
                as={Link}
                to={`/reset?email=${encodeURIComponent(email)}`}
                typeButton={"button-primary"}
                content={"Continuar para restablecer"}
                borderRadius={"var(--default-radius)"}
              />

              <div style={{ marginTop: 12 }}>
                <Button
                  as={Link}
                  to="/login"
                  typeButton={"button-secondary"}
                  content={"Volver a iniciar sesión"}
                  borderRadius={"var(--default-radius)"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
