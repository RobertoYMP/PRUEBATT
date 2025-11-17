// src/pages/auth/cognito.js
// Polyfill para Vite: evita "global is not defined"
if (typeof window !== 'undefined' && !window.global) window.global = window;

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

const KEY = 'hematec.session';

const pool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COG_USER_POOL_ID,
  ClientId:   import.meta.env.VITE_COG_CLIENT_ID,
});

/* ========== Utilidades internas (SDK) ========== */
function _user() {
  return pool.getCurrentUser() || null;
}
function _sdkSession() {
  const u = _user();
  const s = u?.getSignInUserSession?.();
  return s && s.isValid && s.isValid() ? s : null;
}

/**
 * Hidrata/refresh la sesión del SDK al arrancar la app.
 * Úsalo en el bootstrap del router para evitar bucles de redirección.
 */
export function initSession() {
  return new Promise((resolve) => {
    const u = _user();
    if (!u || !u.getSession) return resolve(false);
    u.getSession((_err, sess) => {
      resolve(!!(sess && sess.isValid && sess.isValid()));
    });
  });
}

/* ========== Sesión local (opcional) ========== */
export function saveSession({ idToken, accessToken, refreshToken }) {
  const claims = jwtDecode(idToken);
  const exp = claims.exp; // unix seconds
  // 👇 Usar grupos de Cognito como fuente de verdad; fallback a custom:role y luego 'patient'
  const role =
    (Array.isArray(claims['cognito:groups']) && claims['cognito:groups'][0]) ||
    claims['custom:role'] ||
    'patient';

  const session = { idToken, accessToken, refreshToken, exp, claims, role };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}
function _local() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
function _localValid() {
  const s = _local();
  if (!s) return false;
  const skew = 30; // seg de holgura
  return s.exp * 1000 > Date.now() + skew * 1000;
}
export function clearSession() {
  localStorage.removeItem(KEY);
}

/* ========== API pública común ========== */
export function isSessionValid() {
  return _localValid() || !!_sdkSession();
}

export function getSession() {
  if (_localValid()) return _local();

  const s = _sdkSession();
  if (!s) return null;

  const idTok = s.getIdToken();
  const claims = idTok.payload || {};
  const role =
    (Array.isArray(claims['cognito:groups']) && claims['cognito:groups'][0]) ||
    claims['custom:role'] ||
    'patient';

  return {
    idToken: idTok.getJwtToken(),
    accessToken: s.getAccessToken().getJwtToken(),
    refreshToken: s.getRefreshToken().getToken(),
    exp: claims.exp,
    claims,
    role,
  };
}

export function getIdToken() {
  const s = getSession();
  return s?.idToken || null;
}
export function getAccessToken() {
  const s = getSession();
  return s?.accessToken || null;
}
export function getRefreshToken() {
  const s = getSession();
  return s?.refreshToken || null;
}
export function getAuthHeader() {
  const t = getIdToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
export function getRole() {
  return getSession()?.role || 'patient';
}

/* ========== Flujos de auth ========== */
// LOGIN
export function signIn({ email, password }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    const auth = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(auth, {
      onSuccess: (result) => {
        const idToken      = result.getIdToken().getJwtToken();
        const accessToken  = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        const session = saveSession({ idToken, accessToken, refreshToken });
        resolve({ role: session.role, claims: session.claims });
      },
      onFailure: (err) => {
        const map = {
          NotAuthorizedException:         'Usuario o contraseña incorrectos.',
          UserNotFoundException:          'No existe una cuenta con ese correo.',
          UserNotConfirmedException:      'Debes confirmar tu correo.',
          PasswordResetRequiredException: 'Debes restablecer tu contraseña.',
        };
        reject(new Error(map[err?.code] || err?.message || 'Error al autenticar'));
      },
      newPasswordRequired: () => reject(new Error('Debes definir una nueva contraseña.')),
    });
  });
}

// REGISTRO — NO enviar custom:role (el admin asigna grupos después)
// 👇 Ahora acepta "edad" y la envía como atributo personalizado custom:edad
export function signUp({ email, password, name, edad }) {
  return new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    if (name) {
      attrs.push(
        new CognitoUserAttribute({ Name: 'name', Value: name })
      );
    }

    // Atributo personalizado de edad (debes tener "custom:edad" creado en el User Pool)
    if (edad) {
      attrs.push(
        new CognitoUserAttribute({
          Name: 'custom:edad',
          Value: String(edad),
        })
      );
    }

    pool.signUp(email, password, attrs, null, (err, result) => {
      if (err) {
        const map = {
          InvalidPasswordException: 'La contraseña no cumple la política del usuario.',
          UsernameExistsException:  'Ya existe una cuenta con ese correo.',
        };
        return reject(new Error(map[err?.code] || err?.message || 'No se pudo registrar'));
      }
      resolve({
        userSub: result.userSub,
        userConfirmed: result.userConfirmed,
        codeDelivery: result.codeDeliveryDetails,
      });
    });
  });
}

// CONFIRMAR REGISTRO
export function confirmSignUp({ email, code }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmRegistration(code, true, (err, data) => {
      if (err) return reject(new Error(err?.message || 'Código inválido'));
      resolve(data);
    });
  });
}

// Opcionales
export function resendCode({ email }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.resendConfirmationCode((err, data) =>
      err ? reject(new Error(err?.message || 'No se pudo reenviar el código')) : resolve(data)
    );
  });
}
export function forgotPassword({ email }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.forgotPassword({
      onSuccess: resolve,
      onFailure: (err) => reject(new Error(err?.message || 'No se pudo iniciar el reseteo')),
      inputVerificationCode: resolve,
    });
  });
}
export function confirmPassword({ email, code, newPassword }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve('SUCCESS'),
      onFailure: (err) => reject(new Error(err?.message || 'No se pudo cambiar la contraseña')),
    });
  });
}

// LOGOUT
export function signOut() {
  try { _user()?.signOut(); } catch {}
  clearSession();
}
