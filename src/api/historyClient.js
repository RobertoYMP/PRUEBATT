// src/api/historyClient.js
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

function getUserPkFromToken() {
  try {
    const raw = localStorage.getItem('hematec.session');
    if (!raw) return null;
    const { idToken } = JSON.parse(raw);
    if (!idToken) return null;
    const parts = idToken.split('.');
    if (parts.length < 2) return null;
    const payloadJson = atob(
      parts[1].replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadJson);
    if (!payload.sub) return null;
    return `USER#${payload.sub}`;
  } catch {
    return null;
  }
}

const API_BASE_RAW = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, '');
const BASE = STAGE ? `${API_BASE_RAW}/${STAGE}` : API_BASE_RAW;

export async function fetchHistoryList() {
  const pk = getUserPkFromToken();
  if (!pk) {
    throw new Error('No se pudo determinar el usuario para cargar el historial.');
  }
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
  const pk = getUserPkFromToken();
  if (!pk) {
    throw new Error('No se pudo determinar el usuario para obtener la última predicción.');
  }
  const res = await fetch(
    `${BASE}/history/latest?pk=${encodeURIComponent(pk)}`,
    { headers: { 'Content-Type': 'application/json', ...authHeader() } }
  );
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}

export {
  fetchLatestPrediction as getLatestByPk,
  fetchPredictionByKey as getByKey,
  fetchHistoryList as listByPk,
};
