import { getIdToken } from '../pages/auth/cognito';

const RAW_BASE = import.meta.env.VITE_API_BASE || '';
const RAW_STAGE = import.meta.env.VITE_API_STAGE || '';

const BASE_NO_SLASH = RAW_BASE.replace(/\/+$/, '');
const STAGE_CLEAN = RAW_STAGE.replace(/^\/+/, '');

const API_BASE = STAGE_CLEAN
  ? `${BASE_NO_SLASH}/${STAGE_CLEAN}`
  : BASE_NO_SLASH;

export async function apiFetch(path, options = {}) {
  const token = getIdToken?.();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
  } catch {}

  if (!res.ok) {
    const msg = data?.error || data?.message || text || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
