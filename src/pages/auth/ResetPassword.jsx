import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FormField from '../../components/FormField.jsx';
import { confirmPassword } from './cognito';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const emailFromQS = params.get('email') || '';
  const emailFromSS = typeof window !== 'undefined' ? (sessionStorage.getItem('fp_email') || '') : '';
  const initialEmail = emailFromQS || emailFromSS;

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode]   = useState('');
  const [a, setA]         = useState(''); // nueva contraseña
  const [b, setB]         = useState(''); // confirmación
  const [ok, setOk]       = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email && code && a && b && a === b, [email, code, a, b]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!canSubmit) {
      setError('Completa los campos y asegúrate de que las contraseñas coincidan.');
      return;
    }
    setLoading(true);
    try {
      await confirmPassword({ email, code, newPassword: a });
      setOk(true);
      // Limpia el email temporal
      try { sessionStorage.removeItem('fp_email'); } catch {}
    } catch (err) {
      const msg = err?.message || 'No se pudo cambiar la contraseña';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card stack" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>Restablecer contraseña</h2>

      {!ok ? (
        <>
          {error && <div className="badge critico">{error}</div>}

          <form onSubmit={onSubmit} className="stack">
            {/* Email: editable por si el usuario cambió de idea */}
            <FormField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />

            {/* Código que llegó por correo */}
            <FormField
              label="Código de verificación"
              type="text"
              value={code}
              onChange={e=>setCode(e.target.value)}
              placeholder="Ej. 123456"
              required
            />

            <FormField
              label="Nueva contraseña"
              type="password"
              value={a}
              onChange={e=>setA(e.target.value)}
              required
            />
            <FormField
              label="Confirmación de contraseña"
              type="password"
              value={b}
              onChange={e=>setB(e.target.value)}
              required
            />

            <button className="btn" type="submit" disabled={loading || !canSubmit}>
              {loading ? 'Guardando…' : 'Restablecer contraseña'}
            </button>
          </form>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <Link className="btn secondary" to="/forgot">¿No te llegó el código?</Link>
            <Link className="btn secondary" to="/login">Volver a iniciar sesión</Link>
          </div>
        </>
      ) : (
        <div className="stack">
          <div className="badge estable">Contraseña restablecida con éxito</div>
          <Link className="btn secondary" to="/login">Iniciar Sesión</Link>
        </div>
      )}
    </div>
  );
}
