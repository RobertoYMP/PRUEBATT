import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField.jsx'; 
import { signIn } from './cognito';
import '../../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function targetByRole(role) {
  if (role === 'admin')  return '/admin/users';
  if (role === 'doctor') return '/doctor';
  return '/app';
}

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { role } = await signIn({ email, password });
      const dest = targetByRole(role);
      console.debug('[auth] redirect →', dest);

      // 1) navegación SPA
      nav(dest, { replace: true });

      // 2) “cinturón y tirantes”: si por alguna razón el router no empuja,
      //   forzamos el cambio de URL (útil en S3/CloudFront con reglas de rewrite)
      setTimeout(() => {
        if (location.pathname !== dest) {
          window.location.assign(dest);
        }
      }, 100);
    } catch (err) {
      // Mensaje legible
      const msg =
        err?.message ||
        err?.code ||
        (typeof err === 'string' ? err : 'Error al iniciar sesión');
      console.error('[auth] onSubmit error:', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-container">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-tittle">
            <h2>Iniciar Sesión</h2>
          </div>
        </div>

        <div className="body-login-card">
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
            <button
              className="button-primary login-button"
              type="submit"
              disabled={loading}
              style={{ borderRadius: 'var(--default-radius)' }}
            >
              {loading ? 'Ingresando…' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <Link to="/forgot">¿Has olvidado tu contraseña?</Link>
            <Link to="/register">Registrarse</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
