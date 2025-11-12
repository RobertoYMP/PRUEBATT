// src/api/historyClient.js
function authHeader() {
  try {
    const raw = localStorage.getItem('hematec.session')
    const idToken = raw ? JSON.parse(raw).idToken : null
    return idToken ? { Authorization: `Bearer ${idToken}` } : {}
  } catch { return {} }
}

async function parseResponse(res) {
  const ctype = res.headers.get('content-type') || ''
  if (!res.ok) {
    const txt = await res.text().catch(()=>'')
    throw new Error(txt || `HTTP ${res.status}`)
  }
  if (ctype.includes('application/json')) return res.json()
  const txt = await res.text().catch(()=>'')
  throw new Error(txt || 'La respuesta no es JSON')
}

function normalizePrediction(pred) {
  if (pred && typeof pred === 'string') { try { return JSON.parse(pred) } catch {} }
  return pred || null
}

// -------- helpers para obtener PK --------
function pkFromCache() {
  // 1) guardado explícito
  const pk = localStorage.getItem('hematec.identityId')
  if (pk) return pk

  // 2) intentar deducirlo del último s3Key guardado
  const lastKey = localStorage.getItem('hematec.lastUploadKey') // ej: "private/us-east-2:xxx/archivo.pdf"
  if (lastKey && lastKey.startsWith('private/')) {
    const parts = lastKey.split('/')
    if (parts.length >= 2) return parts[1] // "us-east-2:xxxx-…"
  }
  return null
}

async function pkFromList(BASE) {
  try {
    const res = await fetch(`${BASE}/history/list`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() }
    })
    const items = await parseResponse(res) // se espera array [{PK, SK, ...}]
    if (Array.isArray(items) && items.length && items[0].PK) return items[0].PK
  } catch { /* ignore */ }
  return null
}

// BASE de la API
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
const BASE = /\/prod$/.test(API_BASE) ? API_BASE : `${API_BASE}/prod`

// -------- API pública --------
export async function fetchHistoryList() {
  const res = await fetch(`${BASE}/history/list`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  })
  return parseResponse(res)
}

export async function fetchPredictionByKey(sk) {
  const res = await fetch(`${BASE}/history/item?key=${encodeURIComponent(sk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  })
  const item = await parseResponse(res)
  return normalizePrediction(item?.prediction)
}

export async function fetchLatestPrediction() {
  // Obtener pk de cache o de /history/list
  let pk = pkFromCache()
  if (!pk) pk = await pkFromList(BASE)
  if (!pk) throw new Error('No se pudo determinar tu PK (identityId). Sube un PDF o inicia sesión de nuevo.')

  const res = await fetch(`${BASE}/history/latest?pk=${encodeURIComponent(pk)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  })
  const item = await parseResponse(res)
  return normalizePrediction(item?.prediction)
}
