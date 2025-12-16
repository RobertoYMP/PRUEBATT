import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchLatestPrediction } from '../api/historyClient'; 

export function usePrediction(autoFetch = true) {
  const { state, search } = useLocation();

  const [result, setResult] = useState(() => {
    if (state?.result) return state.result;
    try {
      const params = new URLSearchParams(search || '');
      const src = params.get('src');
      if (src === 'manual') {
        const rawManual = sessionStorage.getItem('manualPrediction');
        if (rawManual) {
          try {
            return JSON.parse(rawManual);
          } catch {
            sessionStorage.removeItem('manualPrediction');
          }
        }
      }
    } catch {}
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
        const r = await fetchLatestPrediction(); 
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
