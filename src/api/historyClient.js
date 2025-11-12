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
    const msg = txt || `HTTP ${res.status}`
    throw new Error(msg)
  }
  if (ctype.includes('application/json')) return res.json()
  const txt = await res.text().catch(()=>'')
  throw new Error(txt || 'La respuesta no es JSON')
}

// Normaliza prediction si llegó como string
function normalizePrediction(pred) {
  if (pred && typeof pred === 'string') {
    try { return JSON.parse(pred) } catch {}
  }
  return pred || null
}

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
// Si tu API usa stage /prod y NO viene ya en VITE_API_BASE, se lo agregamos:
const BASE = /\/prod$/.test(API_BASE) ? API_BASE : `${API_BASE}/prod`

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
  const res = await fetch(`${BASE}/history/latest`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  })
  const item = await parseResponse(res)
  return normalizePrediction(item?.prediction)
}
