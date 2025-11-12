// src/api/historyClient.js
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

// ---- Auth header por idToken (User Pool) ----
function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch { return {}; }
}

// ---- Helpers de API ----
async function parseResponse(res) {
  const ctype = res.headers.get('content-type') || '';
  if (!res.ok) {
    const txt = await res.text().catch(()=>'');
    throw new Error(txt || `HTTP ${res.status}`);
  }
  if (ctype.includes('application/json')) return res.json();
  const txt = await res.text().catch(()=>'');
  throw new Error(txt || 'La respuesta no es JSON');
}
function normalizePrediction(pred) {
  if (pred && typeof pred === 'string') { try { return JSON.parse(pred) } catch {} }
  return pred || null;
}

// ---- JWT decode rápido (para armar `logins`) ----
function parseJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(b64).split('').map(c => '%' + ('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(json);
  } catch { return null; }
}

// ---- Resolver PK (identityId) de forma robusta ----
async function ensureIdentityId() {
  // 1) Cache local del último upload
  const cached = localStorage.getItem('hematec.identityId');
  if (cached) return cached;

  // 2) Resolver con Identity Pool AUTENTICADO (evita "Unauthenticated access...")
  const raw = localStorage.getItem('hematec.session');
  const idToken = raw ? JSON.parse(raw).idToken : null;
  if (!idToken) throw new Error('Sesión inválida. Vuelve a iniciar sesión.');

  const payload = parseJwt(idToken);
  const provider = payload?.iss?.replace(/^https?:\/\//, ''); // ej: cognito-idp.us-east-2.amazonaws.com/POOL_ID
  if (!provider) throw new Error('No se pudo resolver el proveedor de identidad.');

  const credentials = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
    logins: { [provider]: idToken },
  });

  const resolved = await credentials();
  const identityId = resolved.identityId;
  if (!identityId) throw new Error('No se pudo resolver tu IdentityId');

  localStorage.setItem('hematec.identityId', identityId);
  return identityId;
}

// ---- BASE de la API ----
const RAW_BASE = (import.meta.env.VITE_API_BASE || '').trim();
const BASE = RAW_BASE.replace(/\/+$/, '');
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, '');
const API_BASE = STAGE ? `${BASE}/${STAGE}` : BASE;

// ================= API pública =================
export async function fetchHistoryList() {
  const pk = await ensureIdentityId();
  const res = await fetch(`${API_BASE}/history/list?pk=${encodeURIComponent(pk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res);
}

export async function fetchPredictionByKey(sk) {
  const res = await fetch(`${API_BASE}/history/item?key=${encodeURIComponent(sk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}

export async function fetchLatestPrediction() {
  const pk = await ensureIdentityId();
  const res = await fetch(`${API_BASE}/history/latest?pk=${encodeURIComponent(pk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}
