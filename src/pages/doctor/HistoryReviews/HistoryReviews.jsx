import React from 'react'
import { Link } from 'react-router-dom'
import './HistoryReviews.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFileArrowDown, faEye } from "@fortawesome/free-solid-svg-icons";

export default function HistoryReviews(){
  const rows = [
    { fecha:'04/05/2025', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
    { fecha:'04/05/2024', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
  ]

  return (
    <div className="doctordashboard-container">
      <h2>Historial de pacientes revisados</h2>
      <div className='informative'>
        <b>PACIENTES EN ESTADO CRÍTICO</b>
      </div>
      <div className='header-container'>
        <div className='field input-search'>
          <input type="text" placeholder='Buscar paciente'/>
        </div>
        <div className='date-container'>
          Fecha:
          <div className='field'>
            <input type="date" />
          </div>
        </div>
      </div>
      <div className="table-wrap"><table className="global-table">
          <thead><tr><th>Fecha</th><th>Paciente</th><th>Examen</th><th>Ver prediagnóstico</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td><FontAwesomeIcon icon={faCalendarDays} style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}/> {r.fecha}</td>
                <td>{r.paciente}</td>
                <td><div className='download-file'><FontAwesomeIcon icon={faFileArrowDown} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
                <td><div className='visualize-button'><FontAwesomeIcon icon={faEye} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr className='buttons-separation'/>
      <div className="button-doctordashboard-container add-margin-top">
        <button className="button-secondary">Regresar</button>
      </div>
    </div>
  )
}