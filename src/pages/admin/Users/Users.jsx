import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import './Users.css'

export default function Users(){
  return (
    <div className="stack">
      <h2>Gestión de roles y permisos</h2>
      <div className='informative'>
        Asigna, edita o revoca permisos para los usuarios del sistema.
      </div>
      <div className='right-button'>
        <Button
          as={Link}
          to="/admin/new-specialist"
          typeButton={"button-primary"}
          content={
            <>
              <FontAwesomeIcon icon={faUserPlus} style={{marginRight: "1rem"}} />
              Agregar médico especialista
            </>
          }
          width={"20rem"}
          borderRadius={"var(--default-radius)"}
        />
      </div>
      <div className="card-users">
        <hr></hr>
        <div className='card-header'>
          <div className='circle-icon'>
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
          <h3 style={{marginBottom: "0"}}>Listado de usuarios</h3>
        </div>
        <hr></hr>
        <div className="table-wrap"><table className="users-table">
          <thead><tr><th>Nombre</th><th>Tipo</th><th>Fecha de registro</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>
            <tr><td>Nombre completo</td>
              <td>
                <FontAwesomeIcon icon={faUser} style={{color: "var(--light-blue)", paddingRight: "0.5rem"}}/>
                Paciente
              </td>
              <td>04/05/2025</td>
              <td>
                <div className="badge estable">Activo</div>
              </td>
              <td>
                <Button
                  as={Link}
                  to="/admin/patient-profile"
                  typeButton={"button-secondary"}
                  content={"Gestionar"}
                  width={"7rem"}
                  borderRadius={"var(--default-radius)"}
                />
              </td>
            </tr>
            <tr><td>Nombre completo</td>
              <td>
                <FontAwesomeIcon icon={faAddressCard} style={{color: "var(--light-blue)", paddingRight: "0.5rem"}}/>
                Médico especialista
              </td>
              <td>04/05/2025</td>
              <td>
                <div className='badge critico'>Inactivo</div>
              </td>
              <td>
                <Button
                  as={Link}
                  to="/admin/specialist-profile"
                  typeButton={"button-secondary"}
                  content={"Gestionar"}
                  width={"7rem"}
                  borderRadius={"var(--default-radius)"}
                />
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
