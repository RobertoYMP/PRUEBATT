// pages/auth/cognito.js
// Polyfill para Vite: evita "global is not defined"
if (typeof window !== 'undefined' && !window.global) window.global = window;

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

const KEY = 'hematec.session';

const pool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COG_USER_POOL_ID,
  ClientId:   import.meta.env.VITE_COG_CLIENT_ID,
});

// -------- helpers de sesión (reutilízalos en toda la app) -----------
export function saveSession({ idToken, accessToken, refreshToken }) {
  const claims = jwtDecode(idToken);
  const exp = claims.exp; // unix seconds
  const role =
    claims['custom:role'] ||
    (Array.isArray(claims['cognito:groups']) ? claims['cognito:groups'][0] : 'patient');

  const session = { idToken, accessToken, refreshToken, exp, claims, role };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function isSessionValid() {
  const s = getSession();
  if (!s) return false;
  const skew = 30; // segundos de holgura
  return s.exp * 1000 > Date.now() + skew * 1000;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function getAuthHeader() {
  const s = getSession();
  return s?.idToken ? { Authorization: `Bearer ${s.idToken}` } : {};
}

export function getRole() {
  return getSession()?.role || 'patient';
}
// --------------------------------------------------------------------

// LOGIN REAL CONTRA COGNITO
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
          NotAuthorizedException: 'Usuario o contraseña incorrectos.',
          UserNotFoundException: 'No existe una cuenta con ese correo.',
          UserNotConfirmedException: 'Debes confirmar tu correo.',
          PasswordResetRequiredException: 'Debes restablecer tu contraseña.',
        };
        reject(new Error(map[err?.code] || err?.message || 'Error al autenticar'));
      },
      newPasswordRequired: () => reject(new Error('Debes definir una nueva contraseña.')),
    });
  });
}
