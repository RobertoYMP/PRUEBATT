// src/lib/prediag.js
export function deriveStatus(pred) {
  if (!pred) return { label: 'SIN DATOS', color: 'gray' };
  // criterio simple: si hay "altos" o "bajos" => ATENCIÓN; si no => ESTABLE
  const a = Array.isArray(pred?.resumen?.altos) ? pred.resumen.altos.length : 0;
  const b = Array.isArray(pred?.resumen?.bajos) ? pred.resumen.bajos.length : 0;
  if (a + b === 0) return { label: 'ESTADO ESTABLE', color: 'green' };
  return { label: 'REQUIERE ATENCIÓN', color: 'orange' };
}

export function safeArray(x) { return Array.isArray(x) ? x : []; }
