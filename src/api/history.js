// Cliente simple para tu API

function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    return idToken ? { Authorization: `Bearer ${idToken}` } : {};
  } catch { return {}; }
}

// Lista de items del historial (los últimos N)
export async function fetchHistoryList() {
  const res = await fetch('/api/history/list', {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // Esperado: [{ PK, SK, status, createdAt, filename, ... }, ...]
  return res.json();
}

// Obtiene un item por clave (SK) y regresa prediction normalizado
export async function fetchPredictionByKey(sk) {
  const res = await fetch(`/api/history/item?key=${encodeURIComponent(sk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const item = await res.json();
  return item?.prediction || null;
}

// Última predicción disponible (cómodo para pantallas directas)
export async function fetchLatestPrediction() {
  const res = await fetch('/api/history/latest', {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const item = await res.json();
  return item?.prediction || null;
}
