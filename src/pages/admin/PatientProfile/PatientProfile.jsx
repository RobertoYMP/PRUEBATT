import React from 'react'
import './PatientProfile.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAddressCard, faPencil, faCalendarDays, faTriangleExclamation, faCircleExclamation, faFileArrowDown, faEye, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function PatientProfile(){
  const text = "Hola123";

  return (
    <div className='pacientprofile-container'>
      <h2><FontAwesomeIcon icon={faUser} /> Paciente</h2>
      <div className="card-data-pacient">
        <div className='left'>
          <div>Nombre completo</div>
          <div>Fecha de registro</div>
          <div className='edit-div'>Contraseña: {"*".repeat(text.length)} <FontAwesomeIcon icon={faPencil} className='icon-edit'/></div>
        </div>
        <div className="right">
          <div>Correo electrónico</div>
          <div className='edit-div'>
            <div className="badge estable">Activo</div>
            <FontAwesomeIcon icon={faPencil} className='icon-edit'/>
          </div>
        </div>
      </div>
      <div className="card-pacient">
        <hr></hr>
        <div className='card-header'>
          <div className='circle-icon'>
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <h3 style={{marginBottom: "0"}}>Historial de prediagnósticos</h3>
        </div>
        <hr></hr>
        <div className="table-wrap"><table className="pacient-table">
          <thead><tr><th>Fecha</th><th>Paciente</th><th>Examen</th><th>Visualizar</th></tr></thead>
          <tbody>
            <tr>
              <td><FontAwesomeIcon icon={faCalendarDays} style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}/> 04/05/2025</td>
              <td><FontAwesomeIcon icon={faTriangleExclamation} style={{color: "var(--color-danger)", paddingRight: "0.5rem"}}/> Estado Crítico</td>
              <td><div className='download-file'><FontAwesomeIcon icon={faFileArrowDown} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
              <td><div className='visualize-button'><FontAwesomeIcon icon={faEye} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
            </tr>
            <tr>
              <td><FontAwesomeIcon icon={faCalendarDays} style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}/> 04/05/2025</td>
              <td><FontAwesomeIcon icon={faCircleExclamation} style={{color: "var(--color-warning)", paddingRight: "0.5rem"}}/> Estado Inestable</td>
              <td><div className='download-file'><FontAwesomeIcon icon={faFileArrowDown} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
              <td><div className='visualize-button'><FontAwesomeIcon icon={faEye} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
            </tr>
            <tr>
              <td><FontAwesomeIcon icon={faCalendarDays} style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}/> 04/05/2025</td>
              <td><FontAwesomeIcon icon={faCircleCheck} style={{color: "var(--color-green)", paddingRight: "0.5rem"}}/> Estado Estable</td>
              <td><div className='download-file'><FontAwesomeIcon icon={faFileArrowDown} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
              <td><div className='visualize-button'><FontAwesomeIcon icon={faEye} style={{color: "var(--color-secundary)", fontSize: "40px"}} className='icon-button'/></div></td>
            </tr>
          </tbody>
        </table></div>
      </div>
      <hr className='buttons-separation'/>
      <div className="button-pacient-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <button className="button-primary">Guardar cambios</button>
        <button className="button-danger">Eliminar paciente</button>
      </div>
    </div>
  )
}
