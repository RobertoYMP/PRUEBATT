// src/hooks/usePrediction.js
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchLatestPrediction } from '../api/historyClient';  // 👈 cambiar aquí

export function usePrediction(autoFetch = true) {
  const { state } = useLocation();
  const [result, setResult] = useState(() => {
    if (state?.result) return state.result;
    try {
      const raw = localStorage.getItem('lastPrediction');
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          localStorage.removeItem('lastPrediction');
        }
      }
    } catch {}
    if (typeof window !== 'undefined' && window.MODEL_DEMO) return window.MODEL_DEMO;
    return null;
  });

  const [loading, setLoading] = useState(!result && autoFetch);
  const [error, setError] = useState('');

  useEffect(() => {
    if (result || !autoFetch) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const r = await fetchLatestPrediction();  // 👈 ahora llama al cliente nuevo
        if (!cancelled && r) {
          setResult(r);
          try { localStorage.setItem('lastPrediction', JSON.stringify(r)); } catch {}
        }
      } catch (e) {
        if (!cancelled) {
          setError(typeof e?.message === 'string' ? e.message : 'No fue posible obtener el resultado');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [result, autoFetch]);

  const detalles = useMemo(
    () => (Array.isArray(result?.detalles) ? result.detalles : []),
    [result]
  );

  return { result, detalles, loading, error, setResult };
}
