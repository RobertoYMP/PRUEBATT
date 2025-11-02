// src/pages/auth/cognito.js
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

// === Vars de entorno (deben existir)
const USER_POOL_ID = import.meta.env.VITE_COG_USER_POOL_ID;
const CLIENT_ID    = import.meta.env.VITE_COG_CLIENT_ID;
if (!USER_POOL_ID || !CLIENT_ID) {
  throw new Error('Both UserPoolId and ClientId are required.');
}

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

// ---------- Helpers de sesión ----------
export const getCurrentCognitoUser = () => userPool.getCurrentUser() ?? null;

export const getSession = () =>
  new Promise((resolve, reject) => {
    const u = getCurrentCognitoUser();
    if (!u) return reject(new Error('NO_AUTH'));
    u.getSession((err, session) =>
      err || !session?.isValid() ? reject(err || new Error('INVALID')) : resolve(session)
    );
  });

export async function getIdToken() {
  const cached = localStorage.getItem('idToken');
  if (cached) return cached;
  const s = await getSession();
  const t = s.getIdToken().getJwtToken();
  localStorage.setItem('idToken', t);
  return t;
}

export async function getClaims() {
  return jwtDecode(await getIdToken());
}

export function signOut() {
  localStorage.removeItem('idToken');
  localStorage.removeItem('claims');
  getCurrentCognitoUser()?.signOut();
}

// ---------- Rol ----------
export function getRoleFromClaims(claims) {
  // Prefiere atributo custom:role; si no, usa grupos
  const custom = claims?.['custom:role'];
  if (custom === 'admin' || custom === 'doctor' || custom === 'patient') return custom;
  const groups = claims?.['cognito:groups'] || [];
  if (groups.includes('admin'))  return 'admin';
  if (groups.includes('doctor')) return 'doctor';
  return 'patient';
}

// ---------- Errores legibles ----------
export function humanizeCognitoError(err) {
  const code = err?.code || err?.name || '';
  switch (code) {
    case 'UserNotFoundException':         return 'No existe una cuenta con ese correo.';
    case 'UserNotConfirmedException':     return 'Debes confirmar tu correo antes de iniciar sesión.';
    case 'NotAuthorizedException':        return 'Usuario o contraseña incorrectos.';
    case 'PasswordResetRequiredException':return 'Debes restablecer tu contraseña.';
    case 'TooManyRequestsException':      return 'Demasiados intentos. Intenta de nuevo en unos minutos.';
    case 'NEW_PASSWORD_REQUIRED':         return 'Debes establecer una nueva contraseña.';
    default: return err?.message || 'Error al iniciar sesión.';
  }
}

// ---------- Login (ÚNICA definición) ----------
export function signIn({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const claims  = jwtDecode(idToken);
        console.debug('[auth] claims:', claims);   // inspección
        const role    = getRoleFromClaims(claims);

        localStorage.setItem('idToken', idToken);
        localStorage.setItem('claims', JSON.stringify(claims));

        resolve({ user, session, claims, role });
      },
      onFailure: (err) => {
        console.error('[auth] login FAIL', err);
        reject(err);
      },
      newPasswordRequired: (data) => {
        console.warn('[auth] NEW_PASSWORD_REQUIRED', data);
        reject({ code: 'NEW_PASSWORD_REQUIRED', data });
      },
    });
  });
}

// ---------- Registro ----------
export function signUp({ email, password, attributes = {} }) {
  const attrs = [{ Name: 'email', Value: email }];
  if (attributes.name)        attrs.push({ Name: 'name', Value: attributes.name });
  if (attributes.family_name) attrs.push({ Name: 'family_name', Value: attributes.family_name });

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attrs, null, (err, result) =>
      err ? reject(err) : resolve(result?.user)
    );
  });
}

export function confirmSignUp({ email, code }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}
