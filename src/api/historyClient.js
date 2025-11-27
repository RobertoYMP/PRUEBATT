// src/api/historyClient.js
import { getIdentityId } from '../pages/auth/identity.js';

// ---------- Auth header ----------
function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch {
    return {};
  }
}

async function parseResponse(res) {
  const ctype = res.headers.get('content-type') || '';
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `HTTP ${res.status}`);
  }
  if (ctype.includes('application/json')) return res.json();
  const txt = await res.text().catch(() => '');
  throw new Error(txt || 'La respuesta no es JSON');
}

function normalizePrediction(pred) {
  if (pred && typeof pred === 'string') {
    try {
      return JSON.parse(pred);
    } catch {}
  }
  return pred || null;
}

const API_BASE_RAW = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, '');
const BASE = STAGE ? `${API_BASE_RAW}/${STAGE}` : API_BASE_RAW;

// ======================================
//             HISTORY
// ======================================

export async function fetchHistoryList() {
  const pk = await getIdentityId();
  const url = `${BASE}/history/list?pk=${encodeURIComponent(pk)}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res);
}

export async function fetchPredictionByKey(sk) {
  const res = await fetch(`${BASE}/history/item?key=${encodeURIComponent(sk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}

export async function fetchLatestPrediction() {
  const pk = await getIdentityId();
  const res = await fetch(
    `${BASE}/history/latest?pk=${encodeURIComponent(pk)}`,
    { headers: { 'Content-Type': 'application/json', ...authHeader() } }
  );
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}

// ======================================
//   NUEVO: PREDIAGNÓSTICO MANUAL
// ======================================

export async function postManualPrediction(payload) {
  const pk = await getIdentityId();
  const url = `${BASE}/history/manual`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ pk, ...payload })
  });

  const item = await parseResponse(res);

  // Tu Lambda /history/manual devuelve directamente el objeto prediction
  // (no viene envuelto en { prediction: ... })
  const pred = normalizePrediction(item);
  return pred;
}

/* NO TOQUÉ NADA DE ESTO */
export {
  fetchLatestPrediction as getLatestByPk,
  fetchPredictionByKey as getByKey,
  fetchHistoryList as listByPk
};
