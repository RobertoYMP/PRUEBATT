// src/api/history.js
import { getIdentityId } from '../pages/auth/identity.js';

function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch {
    return {};
  }
}

const RAW_BASE = (import.meta.env.VITE_API_BASE || '').trim();
const BASE = RAW_BASE.replace(/\/+$/, '');
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, '');
const API_BASE = STAGE ? `${BASE}/${STAGE}` : BASE;

function url(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

async function parseResponse(res, endpoint = '') {
  const ctype = res.headers.get('content-type') || '';
  const txt = await res.text().catch(() => '');

  if (!res.ok) {
    throw new Error(txt || `HTTP ${res.status}${endpoint ? ` en ${endpoint}` : ''}`);
  }

  if (ctype.includes('application/json')) {
    try {
      return JSON.parse(txt);
    } catch {
      throw new Error('La respuesta dice JSON pero no se pudo parsear');
    }
  }
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

export async function fetchHistoryList(pk) {
  const _pk = pk || await getIdentityId();
  const qs = `?pk=${encodeURIComponent(_pk)}`;
  const res = await fetch(url(`/history/list${qs}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res, '/history/list');
}
export async function fetchPredictionByKey(sk) {
  const res = await fetch(url(`/history/item?key=${encodeURIComponent(sk)}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res, '/history/item');
  return normalizePrediction(item?.prediction);
}
export async function fetchLatestPrediction(pk) {
  const _pk = pk || await getIdentityId();
  const qs = `?pk=${encodeURIComponent(_pk)}`;
  const res = await fetch(url(`/history/latest${qs}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res, '/history/latest');
  return normalizePrediction(item?.prediction);
}
