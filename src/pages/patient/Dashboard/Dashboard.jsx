import React from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import Button from '../../../components/Button/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile, faBars } from "@fortawesome/free-solid-svg-icons"
import { getSession } from '../../auth/cognito'

export default function Dashboard(){
  const claims = getSession()?.claims || {};
  const displayName =
    claims.name ||
    [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
    claims.email || 'Usuario';

  return (
    <div className="dashboard-container">
      <h2>¡Te damos la bienvenida, {displayName}!</h2>
      <div className="card-container">
        <div className="left-card-container">
          <div className="border-container">
            <div><h3>Subir archivo de Biometría Hemática</h3></div>
            <div><FontAwesomeIcon icon={faFile} className='dashboard-icon'/></div>
            <div>
              <Button
                as={Link}
                to="/app/upload"
                typeButton={'button-primary'}
                content={'Ir a carga de resultados'}
                borderRadius={"var(--default-radius)"}
              />
            </div>
          </div>
        </div>
        <div className="right-card-container">
          <div><h3>Historial</h3></div>
          <div><FontAwesomeIcon icon={faBars} className='right-dashboard-icon' style={{color: "white"}}/></div>
          <div>
            <Button
              as={Link}
              to="/app/history"
              typeButton={"header-button"}
              content={"Ver historial"}
              width={"7rem"}
              borderRadius={"var(--default-radius)"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
