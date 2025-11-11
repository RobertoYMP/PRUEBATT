import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField.jsx';
import { forgotPassword, resendCode } from './cognito';

export default function Forgot() {
  const nav = useNavigate();
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const [info, setInfo]     = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      // Guarda email por si el usuario llega directo a /reset sin query
      sessionStorage.setItem('fp_email', email);
      setInfo('Te enviamos un código de verificación a tu correo.');
      // Redirige a la pantalla de redefinir contraseña con el email en la URL
      nav(`/reset?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (err) {
      const msg = err?.message || 'No se pudo iniciar el restablecimiento';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError(''); setInfo('');
    if (!email) {
      setError('Escribe tu correo para reenviar el código.');
      return;
    }
    setLoading(true);
    try {
      await resendCode({ email });
      setInfo('Código reenviado. Revisa tu bandeja de entrada y SPAM.');
    } catch (err) {
      setError(err?.message || 'No se pudo reenviar el código');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card stack" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>¿Olvidaste tu contraseña?</h2>

      {error && <div className="badge critico">{error}</div>}
      {info  && <div className="badge estable">{info}</div>}

      <form onSubmit={onSubmit} className="stack">
        <FormField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar código'}
        </button>
      </form>

      <button className="btn secondary" style={{ marginTop: 8 }} onClick={onResend} disabled={loading}>
        Reenviar código
      </button>
    </div>
  );
}
