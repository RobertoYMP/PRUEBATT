// src/pages/auth/cognito.js  (ajusta la ruta según tu proyecto)
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

const USER_POOL_ID = import.meta.env.VITE_COG_USER_POOL_ID;
const CLIENT_ID    = import.meta.env.VITE_COG_CLIENT_ID;

const userPool = new CognitoUserPool({ UserPoolId: USER_POOL_ID, ClientId: CLIENT_ID });

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
  // cache para evitar hop extra
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

// ---------- Flujos de usuario ----------
export function signIn({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const claims  = jwtDecode(idToken);          // <- decodifica
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('claims', JSON.stringify(claims));
        resolve({ user, session, claims });          // <- **devuelve claims**
      },
      onFailure: reject,
      newPasswordRequired: (data) =>
        reject({ code: 'NEW_PASSWORD_REQUIRED', data }),
    });
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

export function signIn({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('claims', JSON.stringify(jwtDecode(idToken)));
        resolve({ user, session });
      },
      onFailure: reject,
      newPasswordRequired: (data) =>
        reject({ code: 'NEW_PASSWORD_REQUIRED', data }),
    });
  });
}

// ---------- Rol desde grupos (opcional) ----------
export function getRoleFromClaims(claims) {
  const groups = claims?.['cognito:groups'] || [];
  if (groups.includes('admin'))  return 'admin';
  if (groups.includes('doctor')) return 'doctor';
  return 'patient';
}
