// src/pages/patient/PrediagResults.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { getLatestByPk } from '../../api/historyClient';
import { fetchLatestPrediction } from '../../api/historyClient';

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

// Obtiene el identityId actual (pk) desde el Identity Pool
async function getIdentityId() {
  const creds = fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID
  });
  const c = await creds();
  return c.identityId; // us-east-2:xxxx-...
}

export default function PrediagResults() {
  const [params] = useSearchParams();
  const [pk, setPk] = useState(params.get('pk') || '');
  const [data, setData] = useState(null);   // { prediction: ... } | null
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const _pk = pk || await getIdentityId();
        if (alive && !pk) setPk(_pk);
        const res = await getLatestByPk(_pk);
        if (!alive) return;
        setData(res || { prediction: null });
      } catch (e) {
        if (!alive) return;
        setErr(e.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [pk]);

  const pred = data?.prediction || null;

  const estadoPill = useMemo(() => {
    if (!pred) return { text: 'EN PROCESO', className: 'bg-yellow-200' };
    // Si tienes una lógica de estado global, cámbiala aquí:
    const tieneAlto = (pred.resumen?.altos?.length || 0) > 0;
    return tieneAlto
      ? { text: 'REVISIÓN SUGERIDA', className: 'bg-red-200' }
      : { text: 'ESTADO ESTABLE', className: 'bg-green-200' };
  }, [pred]);

  const disabledLinks = loading || !pred;

  return (
    <div className="prediag-wrapper" style={{ padding: 24 }}>
      <div className="card" style={{
        borderRadius: 20, padding: 24, border: '6px solid transparent',
        background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg,#86a8a2,#7ea4b9) border-box'
      }}>
        <h1 style={{ fontFamily: 'Caslon 2000, serif', fontSize: 42, margin: 0 }}>
          Resultados del prediagnóstico
        </h1>

        <div style={{ marginTop: 18 }}>
          <span style={{
            display: 'inline-block', padding: '8px 16px', borderRadius: 999,
            fontWeight: 700
          }} className={estadoPill.className}>
            {estadoPill.text}
          </span>
        </div>

        {err && (
          <p style={{ marginTop: 16, color: '#a33' }}>
            Error: {err}
          </p>
        )}

        {/* Datos del paciente */}
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 28, margin: '8px 0' }}>Datos del paciente</h2>
          {loading ? (
            <p>Cargando…</p>
          ) : pred ? (
            <p>
              {/* Edad: si la tienes en otro lado, colócala aquí */}
              Sexo: <strong>{pred.sexo || '—'}</strong>
            </p>
          ) : (
            <p>No hay datos aún.</p>
          )}
        </section>

        {/* Tabla de resultados */}
        <section style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 28, margin: '8px 0' }}>Tabla de resultados</h2>
          {loading && <p>Cargando…</p>}
          {!loading && pred && Array.isArray(pred.detalles) && pred.detalles.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Parámetro</th>
                    <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Valor</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Unidad</th>
                    <th style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: 8 }}>Rango</th>
                    <th style={{ textAlign: 'center', borderBottom: '1px solid #ddd', padding: 8 }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pred.detalles.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: 8 }}>{r.Parametro}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{r.Valor}</td>
                      <td style={{ padding: 8 }}>{r.Unidad}</td>
                      <td style={{ padding: 8, textAlign: 'center' }}>{r.Min} – {r.Max}</td>
                      <td style={{ padding: 8, textAlign: 'center' }}>{r.Estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !loading && <p>No hay datos de parámetros en este resultado.</p>}
        </section>

        {/* Enlaces persistentes (si no hay datos, quedan deshabilitados visualmente) */}
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <Link
            to={disabledLinks ? '#' : `/app/prediag/graph?pk=${encodeURIComponent(pk)}`}
            aria-disabled={disabledLinks}
            style={{
              pointerEvents: disabledLinks ? 'none' : 'auto',
              opacity: disabledLinks ? 0.5 : 1,
              textDecoration: 'none', fontWeight: 600
            }}
          >
            Ver resultados en formato gráfico
          </Link>

          <Link
            to={disabledLinks ? '#' : `/app/prediag/recs?pk=${encodeURIComponent(pk)}`}
            aria-disabled={disabledLinks}
            style={{
              pointerEvents: disabledLinks ? 'none' : 'auto',
              opacity: disabledLinks ? 0.5 : 1,
              textDecoration: 'none', fontWeight: 600
            }}
          >
            Ver recomendaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
