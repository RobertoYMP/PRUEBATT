import React from 'react'
import { Link } from 'react-router-dom'
import './DoctorDashboard.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFileArrowDown, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../../../context/NotificationContext"; //Notificaciones

export default function DoctorDashboard(){
  const rows = [
    { fecha:'04/05/2025', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
    { fecha:'04/05/2024', paciente:'Nombre del paciente', examen:'Biometría Hemática' },
  ]

  const { addNotification } = useNotifications();

  const addForCurrentUser = () => {
    //123 = id simulado => en tu app real usa el id del usuario (auth)
    addNotification(123, "🚨 Nuevo paciente en estado crítico", { borderLeft: "4px solid #d9534f" });
  };

  return (
    <div className="doctordashboard-container">
      <h2>¡Es un placer tenerte aquí, Doctor!</h2>
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
      <p>* Ejemplo de como se crea una notificación</p>
      <button onClick={addForCurrentUser}>Notificar a 123 (yo)</button>
    </div>
  )
}