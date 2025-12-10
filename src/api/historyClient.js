// src/api/historyClient.js
import { getIdentityId } from '../pages/auth/identity.js';

// ===================== Auth header =====================
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
    } catch {
      console.warn('No se pudo parsear prediction string:', pred);
    }
  }
  return pred || null;
}

const API_BASE_RAW = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const STAGE = (import.meta.env.VITE_API_STAGE || 'prod').replace(/^\/+|\/+$/g, '');
const BASE = STAGE ? `${API_BASE_RAW}/${STAGE}` : API_BASE_RAW;

// ======================================================
//                     HISTORY
// ======================================================

export async function fetchHistoryList() {
  const pk = await getIdentityId();
  const url = `${BASE}/history/list?pk=${encodeURIComponent(pk)}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  return parseResponse(res);
}

export async function fetchPredictionByKey(sk) {
  const res = await fetch(
    `${BASE}/history/item?key=${encodeURIComponent(sk)}`,
    { headers: { 'Content-Type': 'application/json', ...authHeader() } }
  );

  const item = await parseResponse(res);

  // prediction viene como JSON string desde Dynamo
  const prediction = normalizePrediction(item?.prediction);

  if (prediction) {
    // Inyectamos recomendaciones del doctor si existen
    if (item?.doctorRecommendations !== undefined) {
      prediction.doctorRecommendations = item.doctorRecommendations;
    }
    // Inyectamos estado_global si viene en el registro
    if (item?.estado_global !== undefined && prediction.estado_global == null) {
      prediction.estado_global = item.estado_global;
    }
  }

  return {
    prediction,
    doctorRecommendations: item?.doctorRecommendations || null,
    PK: item?.PK || null,
    SK: item?.SK || sk || null
  };
}

// ===================== Última predicción =====================
// NO usamos /history/latest. Todo sale de /history/list + /history/item.
export async function fetchLatestPrediction() {
  const pk = await getIdentityId();

  // 1) Traemos todo el historial del usuario
  const list = await fetchHistoryList();

  if (!Array.isArray(list) || list.length === 0) {
    console.warn('fetchLatestPrediction: lista vacía');
    return null;
  }

  // 2) Ordenamos por createdAt desc si viene ese campo
  const sorted = [...list].sort((a, b) => {
    const da = new Date(a.createdAt || a.CreatedAt || 0).getTime();
    const db = new Date(b.createdAt || b.CreatedAt || 0).getTime();
    if (!isFinite(da) || !isFinite(db)) return 0;
    return db - da;
  });

  // 3) Vamos probando cada SK hasta encontrar una prediction "buena"
  for (const row of sorted) {
    const sk =
      row.SK ||
      row.sk ||
      row.key ||
      row.s3Key ||
      row.filename;

    if (!sk) continue;

    try {
      const { prediction } = await fetchPredictionByKey(sk);

      if (
        prediction &&
        Array.isArray(prediction.detalles) &&
        prediction.detalles.length > 0
      ) {
        // Esta sí trae datos de parámetros → usamos esta
        return prediction;
      }
    } catch (err) {
      console.warn('Error obteniendo item para SK', sk, err);
    }
  }

  // Si ninguna trae detalles, regresamos null
  console.warn('fetchLatestPrediction: no se encontró prediction con detalles');
  return null;
}

// ======================================================
//   PATCH: Guardar recomendaciones del doctor
// ======================================================

export async function saveDoctorRecommendations(pk, sk, text) {
  const url = `${BASE}/history/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}/recommendations`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({
      recomendacionesDoctor: text
    })
  });

  return parseResponse(res);
}

// ======================================================
//                PREDIAGNÓSTICO MANUAL
// ======================================================

export async function postManualPrediction(payload = {}) {
  const pk = payload.pk || await getIdentityId();

  const {
    sexo,
    metrics,
    patientName,
    pacienteNombre,
    userEmail,
    ...rest
  } = payload;

  const cleanedName =
    patientName && patientName !== 'Paciente'
      ? patientName
      : undefined;

  const cleanedPacienteNombre =
    pacienteNombre && pacienteNombre !== 'Paciente'
      ? pacienteNombre
      : undefined;

  const body = {
    pk,
    sexo,
    metrics,
    ...rest
  };

  if (cleanedName) {
    body.patientName = cleanedName;
  }
  if (cleanedPacienteNombre) {
    body.pacienteNombre = cleanedPacienteNombre;
  }
  if (userEmail) {
    body.userEmail = userEmail;
  }

  const res = await fetch(`${BASE}/history/manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(body)
  });

  // La Lambda de /history/manual regresa directamente prediction
  const item = await parseResponse(res);
  const prediction = normalizePrediction(item?.prediction ?? item);

  return prediction;
}

// ======================================================
//                 EXPORTS ORIGINALES
// ======================================================

export {
  fetchLatestPrediction as getLatestByPk,
  fetchPredictionByKey as getByKey,
  fetchHistoryList as listByPk
};
