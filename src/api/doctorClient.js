import { apiFetch } from './httpClient'; 

export async function fetchCriticalPatients() {
  const res = await apiFetch('/doctor/critical');
  return res.items || [];
}
