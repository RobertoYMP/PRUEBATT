import React from 'react'
import './SpecialistProfile.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faPencil, faCalendarDays, faFileArrowDown, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom'
import Button from '../../../components/Button/Button'

export default function SpecialistProfile(){
  return (
    <div className='specialist-container'>
      <div className='specialist-title'>
        <img src='../../../Logo/blueLogo.png'></img>
        <h2>Médico Especialista</h2>
      </div>
      <div className="card-data-specialist">
        <div className='left'>
          <div>Nombre completo</div>
          <div>Especialidad</div>
          <div>Fecha de registro</div>
        </div>
        <div className="right">
          <div>Correo electrónico</div>
          <div>Cédula profesional</div>
          <div>
            <div className="badge estable">Activo</div>
          </div>
        </div>
      </div>
      <div className="card-specialist">
        <hr></hr>
        <div className='card-header'>
          <div className='circle-icon'>
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <h3 style={{marginBottom: "0"}}>Historial de pacientes revisados</h3>
        </div>
        <hr></hr>
        <div className="table-wrap"><table className="specialist-table">
          <thead><tr><th>Fecha de revisión</th><th>Paciente</th><th>Examen</th><th>Ver prediagnóstico</th></tr></thead>
          <tbody>
            <tr>
              <td><FontAwesomeIcon icon={faCalendarDays} style={{color: "var(--color-primary)", paddingRight: "0.5rem"}}/> 04/05/2025</td>
              <td>Nombre del paciente</td>
              <td><div className='download-file'><FontAwesomeIcon icon={faFileArrowDown} style={{color: "var(--color-secundary)", fontSize: "40px", cursor: "pointer"}}/></div></td>
              <td><div className='visualize-button'><FontAwesomeIcon icon={faEye} style={{color: "var(--color-secundary)", fontSize: "40px", cursor: "pointer"}}/></div></td>
            </tr>
          </tbody>
        </table></div>
      </div>
      <hr className='buttons-separation'/>
      <div className="button-pacient-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <Button
          as={Link}
          to="/admin/edit-specialist"
          typeButton={"button-primary"}
          content="Editar médico"
          borderRadius={"var(--default-radius)"}
        />
        <button className="button-danger">Eliminar médico</button>
      </div>
    </div>
  )
}
