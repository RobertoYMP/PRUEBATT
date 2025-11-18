import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchHistoryList, fetchPredictionByKey } from '../../api/history'

function statusBadgeCls(st = 'PROCESSING') {
  const s = String(st).toUpperCase()
  if (s === 'PREDICTED' || s === 'COMPLETED') return 'estable'
  if (s === 'ERROR' || s === 'FAILED')   return 'grave'
  return 'critico'
}

export default function History(){
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [workingKey, setWorkingKey] = useState('')

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true)
        const list = await fetchHistoryList()
        if (!cancel) setRows(Array.isArray(list) ? list : [])
      } catch (e) {
        if (!cancel) setError(e?.message || 'No fue posible obtener el historial')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  const data = useMemo(() => rows.map(x => ({
    fecha: x.createdAt ? new Date(x.createdAt).toLocaleString() : '—',
    estado: x.status || '—',
    examen: x.filename || (x.SK ? x.SK.split('/').pop() : '—'),
    key: x.SK
  })), [rows])

  async function onVisualizar(sk) {
    try {
      setWorkingKey(sk)
      const result = await fetchPredictionByKey(sk)
      if (!result) throw new Error('Este elemento no tiene predicción disponible aún.')
      try { localStorage.setItem('lastPrediction', JSON.stringify(result)) } catch {}
      nav('/app/results', { state: { result } })
    } catch (e) {
      alert(e?.message || 'No fue posible cargar el resultado.')
    } finally {
      setWorkingKey('')
    }
  }

  return (
    <div className="card">
      <h2>Historial</h2>

      {loading && <p>Cargando historial…</p>}
      {error && <p className="badge critico">Error: {error}</p>}

      {(!loading && !error) && (
        data.length === 0 ? <p>Aún no cuentas con historial de resultados.</p> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Fecha</th><th>Estado</th><th>Examen</th><th></th></tr></thead>
              <tbody>
                {data.map((x,i)=> (
                  <tr key={i}>
                    <td>{x.fecha}</td>
                    <td><span className={`badge ${statusBadgeCls(x.estado)} complete`}>{x.estado}</span></td>
                    <td title={x.examen}>{x.examen}</td>
                    <td>
                      <button 
                        className="visualizar-btn"
                        onClick={() => onVisualizar(x.key)}
                        disabled={!x.key || workingKey === x.key}
                        style={{
                          // <<< SOLO CAMBIÓ EL COLOR >>>
                          background: 'linear-gradient(90deg, #54777e, #446373)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: workingKey === x.key ? 'not-allowed' : 'pointer',
                          opacity: workingKey === x.key ? 0.6 : 1,
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          minWidth: '100px'
                        }}
                        onMouseOver={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background =
                              'linear-gradient(90deg, #4b6c73, #3b5968)'; // un poquito más oscuro
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background =
                              'linear-gradient(90deg, #54777e, #446373)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {workingKey === x.key ? 'Abriendo…' : 'Visualizar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
