import React from 'react'
import { getHistory } from '../../mock/api.js'

export default function History(){
  const data = getHistory()
  return (
    <div className="card">
      <h2>Historial</h2>
      {data.length === 0 ? <p>Aún no cuentas con historial de resultados.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Fecha</th><th>Estado</th><th>Examen</th><th></th></tr></thead>
          <tbody>
            {data.map((x,i)=> (
              <tr key={i}>
                <td>{x.fecha}</td>
                <td><span className="badge critico">{x.estado}</span></td>
                <td>{x.examen}</td>
                <td><button className="btn secondary">Visualizar</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </div>
  )
}
