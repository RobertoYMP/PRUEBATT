import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popup } from '../../components/Popup/Popup'
import { fetchHistoryList, fetchPredictionByKey } from '../../api/history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

function statusBadgeCls(st = 'PROCESSING') {
  const s = String(st).toUpperCase()
  if (s === 'PREDICTED' || s === 'COMPLETED' || s === 'DONE') return 'estable' 
  if (s === 'ERROR' || s === 'FAILED') return 'grave'                          
  return 'critico'                                                            
}

function statusLabel(st = 'PROCESSING') {
  const s = String(st).toUpperCase()

  if (s === 'PREDICTED' || s === 'COMPLETED' || s === 'DONE') return 'Completado'
  if (s === 'PROCESSING' || s === 'IN_PROGRESS' || s === 'PENDING') return 'En proceso'
  if (s === 'ERROR' || s === 'FAILED') return 'Error'

  return 'Desconocido'
}

export default function History(){
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [workingKey, setWorkingKey] = useState('')
  const [showOpeningPopup, setShowOpeningPopup] = useState(false)

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
      setShowOpeningPopup(true)
      const result = await fetchPredictionByKey(sk)
      if (!result) throw new Error('Este elemento no tiene predicción disponible aún.')
      try { localStorage.setItem('lastPrediction', JSON.stringify(result)) } catch {}
      nav('/app/results', { state: { result } })
    } catch (e) {
      alert(e?.message || 'No fue posible cargar el resultado.')
    } finally {
      setWorkingKey('')
      setShowOpeningPopup(false)
    }
  }

  return (
    <>
      <h2>Historial</h2>
        <div className="card-history">
        {loading && <p>Cargando historial…</p>}
        {error && <p className="badge critico">Error: {error}</p>}

        {(!loading && !error) && (
          data.length === 0 ? <p>Aún no cuentas con historial de resultados.</p> : (
            <div className="history-table-inner">
              <table className="table">
                <thead><tr><th>Fecha</th><th>Estado</th><th>Examen</th><th></th></tr></thead>
                <tbody>
                  {data.map((x,i)=> (
                    <tr key={i}>
                      <td>{x.fecha}</td>
                      <td>
                        <span className={`badge ${statusBadgeCls(x.estado)} complete`}>
                          {statusLabel(x.estado)}
                        </span>
                      </td>
                      <td title={x.examen}>{x.examen}</td>
                      <td>
                        <button
                          type="button"
                          className="history-view-button"
                          onClick={() => onVisualizar(x.key)}
                          disabled={!x.key || workingKey === x.key}
                        >
                          <FontAwesomeIcon icon={faEye} className="history-view-icon" />
                          <span>
                            {workingKey === x.key ? 'Abriendo' : 'Visualizar'}
                          </span>
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
      <hr style={{marginTop: '2.5rem'}}/>
      <div className="button-back-container">
        <button className="button-secondary" onClick={() => nav(-1)}>
          Regresar
        </button>
      </div>
      <Popup
        isVisible={showOpeningPopup}
        onClose={() => {}}
        width="32rem"
        type="info"
        icon={faCircleNotch}
        tittle="Abriendo resultados"
        message="opening_results"
        showButton={false}
        closable={false}
      />
    </>
  )
}
