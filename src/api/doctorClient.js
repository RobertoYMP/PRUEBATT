// src/api/doctorClient.js
import { apiFetch } from './httpClient'; // el mismo helper que uses en historyClient

export async function fetchCriticalPatients() {
  const res = await apiFetch('/doctor/critical'); // ruta del API Gateway
  return res.items || [];
}
