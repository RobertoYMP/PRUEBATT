// src/auth/cognito.js
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

const USER_POOL_ID = import.meta.env.VITE_COG_USER_POOL_ID;
const CLIENT_ID    = import.meta.env.VITE_COG_CLIENT_ID;

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

// -------- Helpers de sesión --------
export function getCurrentCognitoUser() {
  return userPool.getCurrentUser() || null;
}

export function getSession() {
  return new Promise((resolve, reject) => {
    const u = getCurrentCognitoUser();
    if (!u) return reject(new Error('NO_AUTH'));
    u.getSession((err, session) => {
      if (err || !session?.isValid()) return reject(err || new Error('INVALID'));
      resolve(session);
    });
  });
}

export async function getIdToken() {
  const s = await getSession();
  return s.getIdToken().getJwtToken();
}

export async function getClaims() {
  const idt = await getIdToken();
  return jwtDecode(idt);
}

export function signOut() {
  const u = getCurrentCognitoUser();
  if (u) u.signOut();
}

// -------- Flujos de usuario --------
export function signUp({ email, password, attributes = {} }) {
  const attrs = [{ Name: 'email', Value: email }];
  // Si deseas enviar nombre/apellido a Cognito como atributos estándar:
  if (attributes.name)    attrs.push({ Name: 'name', Value: attributes.name });
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

export function signIn({ email, password }) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const auth = new AuthenticationDetails({ Username: email, Password: password });
  return new Promise((resolve, reject) => {
    user.authenticateUser(auth, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const claims = jwtDecode(idToken);
        // guarda lo útil para tu app
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('claims', JSON.stringify(claims));
        resolve({ user, session, claims });
      },
      onFailure: reject,
      newPasswordRequired: (data) => reject({ code: 'NEW_PASSWORD_REQUIRED', data }),
    });
  });
}

// -------- Derivar rol desde el token --------
export function getRoleFromClaims(claims) {
  // Ojo: si manejas grupos de Cognito
  const groups = claims?.['cognito:groups'] || [];
  if (groups.includes('admin'))  return 'admin';
  if (groups.includes('doctor')) return 'doctor';
  return 'patient';
}
