import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import './Users.css'
import { getSession } from '../../auth/cognito'

export default function Users(){
  const claims = getSession()?.claims || {}
  const displayName = claims.name || [claims.given_name, claims.family_name].filter(Boolean).join(' ') || claims.email || 'Admin'

  return (
    <div className='users-container'>
      <h2>Gestión de roles y permisos</h2>
      <div className='informative'>
        Asigna, edita o revoca permisos para los usuarios del sistema. Bienvenido, {displayName}.
      </div>

      <div className='filter-button'>
        <div className='filter-container'>
          Tipo de usuario:
          <select className="select-filtro">
            <option value="todos">Todos</option>
            <option value="opcion1">Paciente</option>
            <option value="opcion2">Médico especialista</option>
          </select>
        </div>
        <div className='button-container'>
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
      </div>

      <div className="card-users">
        <hr />
        <div className='card-header'>
          <div className='circle-icon'><FontAwesomeIcon icon={faAddressCard} /></div>
          <h3 style={{marginBottom: 0}}>Listado de usuarios</h3>
        </div>
        <hr />
        <div className="table-wrap">
          <table className="users-table">
            <thead><tr><th>Nombre</th><th>Tipo</th><th>Fecha de registro</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              <tr>
                <td>Nombre completo</td>
                <td><FontAwesomeIcon icon={faUser} style={{color: "var(--light-blue)", paddingRight: "0.5rem"}}/>Paciente</td>
                <td>04/05/2025</td>
                <td><div className="badge estable">Activo</div></td>
                <td>
                  <Button as={Link} to="/admin/patient-profile" typeButton={"button-secondary"} content={"Gestionar"} width={"7rem"} borderRadius={"var(--default-radius)"} />
                </td>
              </tr>
              <tr>
                <td>Nombre completo</td>
                <td><FontAwesomeIcon icon={faAddressCard} style={{color: "var(--light-blue)", paddingRight: "0.5rem"}}/>Médico especialista</td>
                <td>04/05/2025</td>
                <td><div className='badge critico'>Inactivo</div></td>
                <td>
                  <Button as={Link} to="/admin/specialist-profile" typeButton={"button-secondary"} content={"Gestionar"} width={"7rem"} borderRadius={"var(--default-radius)"} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
