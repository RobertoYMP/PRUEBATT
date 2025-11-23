// src/api/httpClient.js
import { getIdToken } from '../pages/auth/cognito';

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * apiFetch: helper genérico para llamar a tu API
 * - concatena VITE_API_BASE + path
 * - agrega el idToken de Cognito en el header Authorization
 * - maneja errores sencillos y devuelve JSON
 */
export async function apiFetch(path, options = {}) {
  const token = getIdToken?.();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    // 🔁 Ajusta esto según cómo espera el token tu API Gateway.
    // Si tu Lambda ya usa el token "pelón", deja así:
    headers['Authorization'] = token;

    // Si tu API espera "Bearer <token>", usa esta en su lugar:
    // headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers
  });

  const text = await res.text().catch(() => '');
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // si no es JSON, data se queda en null
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || text || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
