import React from 'react';
import { usePrediction } from '../../hooks/usePrediction';
import { useNavigate } from 'react-router-dom';

function sevToOrder(sev = 'ok') {
  const s = String(sev).toLowerCase();
  if (['grave', 'severo', 'severa', 'high'].includes(s)) return 2;
  if (['leve', 'moderado', 'moderada', 'medium'].includes(s)) return 1;
  return 0;
}

function sevToBadge(sev = 'ok') {
  const s = String(sev).toLowerCase();
  if (['grave', 'severo', 'severa', 'high'].includes(s)) return 'grave';
  if (['leve', 'moderado', 'moderada', 'medium'].includes(s)) return 'critico';
  return 'estable';
}

export default function Recommendations() {
  const nav = useNavigate();
  const { result, detalles, loading, error } = usePrediction(true);

  const doctorRec =
    typeof result?.doctorRecommendations === 'string' &&
    result.doctorRecommendations.trim().length > 0
      ? result.doctorRecommendations
      : null;

  const dest = Array.isArray(result?.recomendaciones_destacadas)
    ? result.recomendaciones_destacadas
    : [];

  const nota = result?.nota;

  const notaFront = nota
    ? nota.replace(/educativo/gi, 'orientativo')
    : 'La información mostrada es orientativa y no sustituye una valoración médica profesional.';

  const específicas = detalles
    .filter((d) => String(d.Severidad || 'ok').toLowerCase() !== 'ok')
    .sort((a, b) => sevToOrder(b.Severidad) - sevToOrder(a.Severidad));

  return (
    <>
      <h2>Recomendaciones</h2>

      <div className="results-card">
        {loading && <p className="results-status">Cargando…</p>}
        {error && (
          <p className="results-status badge critico">
            Error: {error}
          </p>
        )}

        <div className="results-alert">
          <div className="results-alert-accent" />
          <div className="results-alert-body">
            <h3 className="results-alert-title">¡Aviso!</h3>
            <p className="results-alert-text">
              {notaFront}
            </p>
          </div>
        </div>

        {doctorRec && (
          <section className="results-section">
            <h3 className="results-section-title">Recomendación médica</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{doctorRec}</p>
          </section>
        )}

        {!doctorRec && dest.length > 0 && (
          <section className="results-priority">
            <h3 className="results-section-title">Prioritarias</h3>
            <ul className="results-priority-list">
              {dest.map((r, i) => (
                <li key={i} className="results-priority-item">
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="results-params">
          <h3 className="results-section-title">Por parámetro</h3>

          {!loading && !error && específicas.length === 0 ? (
            <p className="results-empty-text">
              No hay hallazgos relevantes. Mantén hábitos saludables.
            </p>
          ) : (
            <div className="results-params-grid">
              {específicas.map((d, i) => (
                <article
                  className={`results-param-card ${sevToBadge(d.Severidad)}`}
                  key={i}
                >
                  <header className="results-param-header">
                    <strong className="results-param-name">
                      {d.Parametro}
                    </strong>
                    <span
                      className={`badge ${sevToBadge(
                        d.Severidad
                      )} results-param-badge`}
                    >
                      {d.Estado} · {d.Severidad}
                    </span>
                  </header>

                  <div className="results-param-values">
                    Valor{' '}
                    <strong className="results-param-value-highlight">
                      {d.Valor}
                      {d.Unidad ? ` ${d.Unidad}` : ''}
                    </strong>{' '}
                    · Referencia: {d.Min ?? '—'}–{d.Max ?? '—'}
                  </div>

                  <p className="results-param-recommendation">
                    {d.Recomendacion || ''}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <hr style={{ marginTop: '2.5rem' }} />

      <div className="button-back-container">
        <button className="button-secondary" onClick={() => nav(-1)}>
          Regresar
        </button>
      </div>
    </>
  );
}
