import React from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import Button from '../../../components/Button/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile, faBars } from "@fortawesome/free-solid-svg-icons"
import { getSession } from '../../auth/cognito'

export default function Dashboard(){
  const claims = getSession()?.claims || {}
  const displayName =
    claims.name ||
    [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
    claims.email || 'Usuario'

  return (
    <div>
      <div className="dashboard-container">
        <h2>¡Te damos la bienvenida, {displayName}!</h2>
      </div>
      <div className="dashboard-grid">
        <article className="upload-card" aria-label="Subir archivo de Biometría Hemática">
          <div className="icon-badge">
            <FontAwesomeIcon icon={faFile} />
          </div>
          <h3>Subir Biometría Hemática</h3>
          <p className="muted">PDF o imagen • Procesamiento automático</p>

          <Button
            as={Link}
            to="/app/upload"
            typeButton="button-primary"
            content="Ir a carga de resultados"
            borderRadius="var(--default-radius)"
          />
        </article>
        <article className="history-card" aria-label="Historial de resultados">
          <div className="icon-badge soft">
            <FontAwesomeIcon icon={faBars} />
          </div>
          <h3>Historial</h3>
          <p className="muted">Consulta resultados anteriores y prediagnósticos</p>

          <Button
            as={Link}
            to="/app/history"
            typeButton="header-button"
            content="Ver historial"
            width="10.5rem"
            borderRadius="var(--default-radius)"
          />
        </article>
    </div>
  </div>
  )
}
