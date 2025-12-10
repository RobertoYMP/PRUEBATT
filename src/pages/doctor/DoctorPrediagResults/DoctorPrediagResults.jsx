// src/pages/doctor/DoctorPrediagResults/DoctorPrediagResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchPredictionByKey, saveDoctorRecommendations } from '../../../api/history';
import EditRecommendations from '../EditRecommendations/EditRecommendations';

export default function DoctorPrediagResults() {
  const { key } = useParams();
  const location = useLocation();
  const predictionKey = location.state?.predictionKey || key;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [doctorRec, setDoctorRec] = useState(null);
  const [pk, setPk] = useState(null);
  const [sk, setSk] = useState(null);

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await fetchPredictionByKey(predictionKey);

        if (!mounted) return;

        setPrediction(resp?.prediction || null);
        setDoctorRec(resp?.doctorRecommendations || null);
        setPk(resp?.PK || null);
        setSk(resp?.SK || null);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [predictionKey]);

  const detalles = Array.isArray(prediction?.detalles)
    ? prediction.detalles
    : [];

  if (editing) {
    return (
      <EditRecommendations
        pk={pk}
        sk={sk}
        initialText={doctorRec || ''}
        onBack={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="card results-card">
      <h1>Prediagnóstico del paciente</h1>

      {loading && <p>Consultando prediagnóstico…</p>}
      {error && <p style={{ color: '#b10808' }}>Error: {error}</p>}

      {prediction && (
        <>
          <section style={{ marginTop: 16 }}>
            <h2>Datos del paciente</h2>
            <ul>
              <li>
                Paciente:{' '}
                <strong>
                  {prediction.patientName ||
                    prediction.pacienteNombre ||
                    '—'}
                </strong>
              </li>
              <li>
                Sexo: <strong>{prediction.sexo || '—'}</strong>
              </li>
              <li>
                Cluster: <strong>{prediction.cluster ?? '—'}</strong>
              </li>
              {prediction.estado_global && (
                <li>
                  Estado global:{' '}
                  <strong>{prediction.estado_global}</strong>
                </li>
              )}
            </ul>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>Tabla de resultados</h2>
            {detalles.length === 0 ? (
              <p>No hay datos de parámetros en este resultado.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Parámetro</th>
                      <th>Valor</th>
                      <th>Unidad</th>
                      <th>Ref. Mín</th>
                      <th>Ref. Máx</th>
                      <th>Estado</th>
                      <th>Severidad</th>
                      <th>Recomendación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((r, i) => (
                      <tr key={`${r.Parametro}-${i}`}>
                        <td>{r.Parametro}</td>
                        <td>{r.Valor}</td>
                        <td>{r.Unidad || '—'}</td>
                        <td>{r.Min ?? '—'}</td>
                        <td>{r.Max ?? '—'}</td>
                        <td>{r.Estado || '—'}</td>
                        <td>{r.Severidad || '—'}</td>
                        <td style={{ whiteSpace: 'pre-line' }}>
                          {doctorRec || r.Recomendacion || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>Recomendaciones del doctor</h2>
            {doctorRec ? (
              <p style={{ whiteSpace: 'pre-line' }}>{doctorRec}</p>
            ) : (
              <p>No hay recomendaciones del doctor aún.</p>
            )}

            <button
              className="button-primary"
              style={{ marginTop: 16 }}
              onClick={() => setEditing(true)}
            >
              Editar recomendaciones
            </button>
          </section>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/doctor">← Regresar al panel</Link>
      </div>
    </div>
  );
}
