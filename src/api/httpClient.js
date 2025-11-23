// src/api/httpClient.js
import { getIdToken } from '../pages/auth/cognito';

// Construimos la base de la API incluyendo el stage, si existe
const RAW_BASE  = import.meta.env.VITE_API_BASE || '';
const RAW_STAGE = import.meta.env.VITE_API_STAGE || '';

// Normalizamos para evitar dobles // o faltas de /
const BASE_NO_SLASH = RAW_BASE.replace(/\/+$/, '');
const STAGE_CLEAN   = RAW_STAGE.replace(/^\/+/, ''); // quita "/" al inicio

// Si hay stage, queda ...amazonaws.com/prod, si no, solo ...amazonaws.com
const API_BASE = STAGE_CLEAN
  ? `${BASE_NO_SLASH}/${STAGE_CLEAN}`
  : BASE_NO_SLASH;

/**
 * apiFetch: helper genérico para llamar a tu API
 * - concatena API_BASE + path
 * - agrega el idToken de Cognito en Authorization
 * - maneja errores y devuelve JSON
 */
export async function apiFetch(path, options = {}) {
  const token = getIdToken?.();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    // Si tu Lambda espera el token "pelón", deja esto:
    headers['Authorization'] = token;

    // Si algún día cambias a `Bearer <token>`, sería:
    // headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanPath = String(path || '').startsWith('/')
    ? path
    : `/${path || ''}`;

  const url = `${API_BASE}${cleanPath}`;

  const res = await fetch(url, {
    ...options,
    headers
  });

  const text = await res.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // no es JSON, dejamos data = null
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || text || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
