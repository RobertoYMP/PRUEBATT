// Cliente para tu API (usa VITE_API_BASE y opcionalmente VITE_API_STAGE)
// Incluye defensas cuando el backend no devuelve JSON.

function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch {
    return {};
  }
}

// Construcción robusta del BASE + STAGE
const RAW_BASE = (import.meta.env.VITE_API_BASE || '').trim();
const BASE = RAW_BASE.replace(/\/+$/, ''); // sin slash final
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, ''); // sin slashes

// Si VITE_API_STAGE está vacío, no añade stage (útil si ya mapeaste / a tu stage)
const API_BASE = STAGE ? `${BASE}/${STAGE}` : BASE;

function url(path) {
  // asegura un solo slash entre base y path
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

async function parseResponse(res, endpointDesc = '') {
  const ctype = res.headers.get('content-type') || '';
  const text = await res.text().catch(() => '');

  if (!res.ok) {
    // Devuelve texto del backend (útil para ver HTML/403, etc.)
    const msg = text || `HTTP ${res.status}${endpointDesc ? ` en ${endpointDesc}` : ''}`;
    throw new Error(msg);
  }
  if (ctype.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('La respuesta dice JSON, pero no se pudo parsear.');
    }
  }
  throw new Error(text || 'La respuesta no es JSON');
}

function normalizePrediction(pred) {
  if (pred && typeof pred === 'string') {
    try { return JSON.parse(pred); } catch { /* deja como string si no es JSON */ }
  }
  return pred || null;
}

/**
 * Lista de items del historial.
 * @param {string} [pk] identityId del usuario (si tu API lo requiere)
 */
export async function fetchHistoryList(pk) {
  const qs = pk ? `?pk=${encodeURIComponent(pk)}` : '';
  const res = await fetch(url(`/history/list${qs}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res, '/history/list');
}

/**
 * Predicción por SK (clave sort del item en DDB).
 */
export async function fetchPredictionByKey(sk) {
  const res = await fetch(url(`/history/item?key=${encodeURIComponent(sk)}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res, '/history/item');
  return normalizePrediction(item?.prediction);
}

/**
 * Última predicción disponible.
 * @param {string} [pk] identityId del usuario (si tu API lo requiere)
 */
export async function fetchLatestPrediction(pk) {
  const qs = pk ? `?pk=${encodeURIComponent(pk)}` : '';
  const res = await fetch(url(`/history/latest${qs}`), {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res, '/history/latest');
  return normalizePrediction(item?.prediction);
}
