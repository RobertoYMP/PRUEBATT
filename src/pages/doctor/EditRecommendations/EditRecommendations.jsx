import React, { useState } from 'react'
import { getRecommendations, saveRecommendations } from '../../../mock/api.js'
import './EditRecommendations.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export default function EditRecommendations() {
  const [text, setText] = useState(getRecommendations() || `Mayor concentración de glóbulos rojos...
  Tamaño anormal de los glóbulos rojos...`)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('')
  async function onSave(){
    setStatus('')
    await saveRecommendations(text)
    setStatus('Cambios guardados y notificación enviada')
  }

  return (
    <div className="editrecommendations-container">
      <h2>Recomendaciones</h2>
      <div className='warning-container'>
        <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "var(--color-secundary)", paddingRight: "0.5rem"}}/>
        Aviso: Recomendaciones informativas, no diagnósticas
      </div>
      <div className='warning-text'>
        Nuestra prioridad es realizar un <strong>prediagnóstico</strong> que permita concientizar a la sociedad sobre la importancia de realizarse exámenes médicos de manera periódica. <br /><br />
        En este apartado se muestran las <strong>recomendaciones generadas a partir de los resultados obtenidos por el paciente</strong>.
        En caso de que dichos resultados sean modificados o actualizados, el paciente será notificado de manera inmediata para garantizar información oportuna y confiable.
      </div>
      <div className='blue-line'></div>
      <div className='card-recommendations'>
        <div className='title-card-recommendations'>
          <h3>Recomendaciones principales</h3>
          {isEditing ? (
            <div className='button-container-edit active-edit'>
              <button className="button-primary" onClick={onSave}>
                Guardar cambios
              </button>
              <button
                className="button-danger"
                onClick={() => {
                  setIsEditing(false);
                  setStatus("No se realizaron cambios");
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <div className='button-container-edit'>
                <button className="button-primary middle-with" onClick={() => setIsEditing(true)}>Editar recomendaciones</button>
              </div>
            </>
          )}
        </div>
        <div className='recommendation-content'>
          <hr/>
          {isEditing ? (
            <textarea
              rows={6}
              className="field textarea-recommendation-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <div className="field textarea-recommendation-content" style={{ whiteSpace: "pre-line" }}>
              {text}
            </div>
          )}
        </div>
      </div>
      <hr className='buttons-separation'/>
      <div className="button-recommendations-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <button className="button-primary" style={{width: "auto"}} onClick={onSave}>Guardar y notificar al paciente</button>
        <button className="button-danger" onClick={()=>setStatus('No se realizaron cambios')}>No realizar cambios</button>
      </div>
      {status && <div className="badge estable">{status}</div>}
    </div>
  )
}
