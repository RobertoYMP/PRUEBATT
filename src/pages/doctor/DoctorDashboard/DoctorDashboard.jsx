import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './DoctorDashboard.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFileArrowDown, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../../../context/NotificationContext";
import { getSession } from '../../auth/cognito'

import { fetchCriticalPatients } from '../../../api/doctorClient'

export default function DoctorDashboard(){
  const { addNotification } = useNotifications();

  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const claims = getSession()?.claims || {}
  const displayName =
    claims.name ||
    [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
    claims.email ||
    'Doctor'

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchCriticalPatients();
        if (cancelled) return;
        setRows(data);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Error al cargar pacientes críticos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredRows = rows.filter(r => {
      const matchName = !lower || (r.paciente || '').toLowerCase().includes(lower);
      const matchDate = !dateFilter || (r.fecha || '').slice(0,10) === dateFilter;
      return matchName && matchDate;
    });
    setFiltered(filteredRows);
  }, [rows, search, dateFilter]);

  const addForCurrentUser = () => {
    addNotification(
      123,
      "🚨 Nuevo paciente en estado crítico",
      { borderLeft: "4px solid #d9534f" }
    );
  };

  const handleDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="doctordashboard-container">
      <h2>¡Es un placer tenerte aquí, {displayName}!</h2>
      <div className='informative'><b>PACIENTES EN ESTADO CRÍTICO</b></div>

      <div className='header-container'>
        <div className='field input-search'>
          <input
            type="text"
            placeholder='Buscar paciente'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className='date-container'>
          Fecha:
          <div className='field'>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-wrap">
        {loading && <p>Cargando pacientes críticos…</p>}
        {error && <p className="badge critico">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p>No hay pacientes críticos con prediagnóstico listo.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="global-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Examen</th>
                <th>Ver prediagnóstico</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const isManual =
                  (r.s3Key && r.s3Key.startsWith('manual/')) ||
                  (r.downloadUrl && r.downloadUrl.includes('/manual/'));

                return (
                  <tr key={r.id || i}>
                    <td>
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}
                      />
                      {r.fecha ? new Date(r.fecha).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td>{r.paciente}</td>

                    {/* EXAMEN */}
                    <td>
                      {isManual ? (
                        <div className="manual-summary-cell">
                          <span className="no-file-label">
                            Sin PDF (captura manual)
                          </span>
                          <br />
                          <small className="manual-hint">
                            Revisa el prediagnóstico para ver el resumen.
                          </small>
                        </div>
                      ) : (
                        r.downloadUrl && (
                          <button
                            type="button"
                            className='download-file icon-button'
                            onClick={() => handleDownload(r.downloadUrl)}
                            title="Descargar archivo original"
                          >
                            <FontAwesomeIcon
                              icon={faFileArrowDown}
                              style={{color: "var(--color-secundary)", fontSize: "40px"}}
                            />
                          </button>
                        )
                      )}
                    </td>

                    <td>
                      <Link
                        to={`/doctor/prediag/${encodeURIComponent(r.s3Key || r.id)}`}
                        state={{ predictionKey: r.s3Key || r.id }}
                        className='visualize-button'
                        title="Ver prediagnóstico"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{color: "var(--color-secundary)", fontSize: "40px"}}
                          className='icon-button'
                        />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <button
        type="button"
        className="notify-button"
        onClick={addForCurrentUser}
      >
        Notificar
      </button>
    </div>
  )
}
