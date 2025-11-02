import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

// === Vars de entorno
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

// ---------- Rol desde grupos (opcional) ----------
export function getRoleFromClaims(claims) {
  const groups = claims?.['cognito:groups'] || [];
  if (groups.includes('admin'))  return 'admin';
  if (groups.includes('doctor')) return 'doctor';
  return 'patient';
}

// ---------- Login ----------
/**
 * Inicia sesión y devuelve { user, session, claims, role }.
 */
export function signIn({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        try {
          const idToken = session.getIdToken().getJwtToken();
          const claims  = jwtDecode(idToken);
          const role    = getRoleFromClaims(claims);

          localStorage.setItem('idToken', idToken);
          localStorage.setItem('claims', JSON.stringify(claims));

          console.debug('[auth] login OK', { role, sub: claims.sub });
          resolve({ user, session, claims, role });
        } catch (e) {
          reject(e);
        }
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
