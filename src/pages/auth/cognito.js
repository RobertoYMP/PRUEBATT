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

/* ================= Helpers de sesión ================= */
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
  const skew = 30; // segundos
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
/* ===================================================== */

/* ===================== Auth flows ===================== */

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
          NotAuthorizedException:       'Usuario o contraseña incorrectos.',
          UserNotFoundException:        'No existe una cuenta con ese correo.',
          UserNotConfirmedException:    'Debes confirmar tu correo.',
          PasswordResetRequiredException:'Debes restablecer tu contraseña.',
        };
        reject(new Error(map[err?.code] || err?.message || 'Error al autenticar'));
      },
      newPasswordRequired: () => reject(new Error('Debes definir una nueva contraseña.')),
    });
  });
}

// REGISTRO
export function signUp({ email, password, name, role = 'patient' }) {
  return new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];
    if (name) attrs.push(new CognitoUserAttribute({ Name: 'name', Value: name }));
    // Solo envía el custom:role si lo quieres/tu app client lo permite
    if (role) attrs.push(new CognitoUserAttribute({ Name: 'custom:role', Value: String(role) }));

    pool.signUp(email, password, attrs, null, (err, result) => {
      if (err) {
        const map = {
          InvalidPasswordException:
            'La contraseña no cumple la política del usuario.',
          UsernameExistsException:
            'Ya existe una cuenta con ese correo.',
        };
        reject(new Error(map[err?.code] || err?.message || 'No se pudo registrar'));
        return;
      }
      resolve({
        userSub: result.userSub,
        userConfirmed: result.userConfirmed,
        codeDelivery: result.codeDeliveryDetails, // {AttributeName, DeliveryMedium, Destination}
      });
    });
  });
}

// CONFIRMAR REGISTRO (código enviado por email)
export function confirmSignUp({ email, code }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmRegistration(code, true, (err, data) => {
      if (err) return reject(new Error(err?.message || 'Código inválido'));
      resolve(data); // 'SUCCESS'
    });
  });
}

// Reenviar código de confirmación (opcional)
export function resendCode({ email }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.resendConfirmationCode((err, data) => {
      if (err) return reject(new Error(err?.message || 'No se pudo reenviar el código'));
      resolve(data);
    });
  });
}

// Flujo de "olvidé contraseña" (envía código al correo)
export function forgotPassword({ email }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(new Error(err?.message || 'No se pudo iniciar el reseteo')),
      inputVerificationCode: (data) => resolve(data), // se llama cuando se envía el código
    });
  });
}

// Confirmar nueva contraseña con código
export function confirmPassword({ email, code, newPassword }) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve('SUCCESS'),
      onFailure: (err) => reject(new Error(err?.message || 'No se pudo cambiar la contraseña')),
    });
  });
}

// Cerrar sesión local (y remoto si hay sesión cargada)
export function signOut() {
  try {
    const s = getSession();
    if (s?.claims?.sub) {
      const user = new CognitoUser({ Username: s.claims.email || s.claims.sub, Pool: pool });
      try { user.signOut(); } catch {}
    }
  } catch {}
  clearSession();
}
/* ===================================================== */
