// Cliente simple para tu API con defensas anti "no-JSON"

function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch { return {}; }
}

async function parseResponse(res) {
  const ctype = res.headers.get('content-type') || '';
  if (!res.ok) {
    // intenta leer como texto para ver errores del backend / 401 de CDN
    const txt = await res.text().catch(()=>'');
    const msg = txt || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  if (ctype.includes('application/json')) {
    return res.json();
  }
  // si no es JSON, lee texto y falla con contenido
  const txt = await res.text().catch(()=>'');
  throw new Error(txt || 'La respuesta no es JSON');
}

function normalizePrediction(pred) {
  // Si prediction viene como string JSON, parsearlo
  if (pred && typeof pred === 'string') {
    try { return JSON.parse(pred); } catch { /* deja pasar abajo */ }
  }
  return pred || null;
}

// Lista de items del historial
export async function fetchHistoryList() {
  const res = await fetch('/api/history/list', {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res);
}

// Predicción por SK
export async function fetchPredictionByKey(sk) {
  const res = await fetch(`/api/history/item?key=${encodeURIComponent(sk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}

// Última predicción disponible
export async function fetchLatestPrediction() {
  const res = await fetch('/api/history/latest', {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  const item = await parseResponse(res);
  return normalizePrediction(item?.prediction);
}
