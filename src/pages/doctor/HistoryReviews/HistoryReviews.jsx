import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HistoryReviews.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFileArrowDown, faEye } from "@fortawesome/free-solid-svg-icons";

// 👇 usamos el mismo cliente que en DoctorDashboard
import { fetchCriticalPatients } from '../../../api/doctorClient';

export default function HistoryReviews() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchCriticalPatients();
        if (cancelled) return;
        // Aquí podrías filtrar solo los ya revisados si luego guardas un flag,
        // por ahora mostramos la misma lista crítica que en el dashboard.
        setRows(data);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Error al cargar historial de pacientes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Filtro por nombre y fecha
  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredRows = rows.filter(r => {
      const matchName = !lower || (r.paciente || '').toLowerCase().includes(lower);
      const matchDate = !dateFilter || (r.fecha || '').slice(0, 10) === dateFilter;
      return matchName && matchDate;
    });
    setFiltered(filteredRows);
  }, [rows, search, dateFilter]);

  const handleDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="doctordashboard-container">
      <h2>Historial de pacientes revisados</h2>

      <div className='informative'>
        <b>PACIENTES</b>
      </div>

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

      <div className="doctor-table-wrap">
        {loading && <p>Cargando historial…</p>}
        {error && <p className="badge critico">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p>No hay registros en el historial.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Examen</th>
                <th>Ver prediagnóstico</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i}>
                  <td>
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      style={{ color: "var(--color-primary)", paddingRight: "0.5rem" }}
                    />
                    {r.fecha ? new Date(r.fecha).toLocaleDateString('es-MX') : '—'}
                  </td>
                  <td>{r.paciente}</td>
                  <td>
                    <button
                      type="button"
                      className='download-file icon-button'
                      onClick={() => handleDownload(r.downloadUrl)}
                      title="Descargar archivo original"
                    >
                      <FontAwesomeIcon
                        icon={faFileArrowDown}
                        style={{ color: "var(--color-secundary)", fontSize: "40px" }}
                      />
                    </button>
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
                        style={{ color: "var(--color-secundary)", fontSize: "40px" }}
                        className='icon-button'
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr className='buttons-separation' />
      <div className="button-doctordashboard-container add-margin-top">
        <Link to="/doctor">
          <button className="button-secondary">Regresar</button>
        </Link>
      </div>
    </div>
  );
}
