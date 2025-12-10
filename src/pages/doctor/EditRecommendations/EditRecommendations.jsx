// EditRecommendations.jsx
import React, { useEffect, useState } from 'react'
import './EditRecommendations.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { saveDoctorRecommendations } from '../../../api/history'


export default function EditRecommendations({ pk, sk, initialText, onBack }) {
  const [text, setText] = useState(initialText || "")
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialText) setText(initialText)
  }, [initialText])

  async function onSave() {
    setStatus("")
    setLoading(true)
    try {
      await saveDoctorRecommendations(pk, sk, text.trim())
      setStatus("Cambios guardados y notificación enviada al paciente")
      setIsEditing(false)
    } catch (err) {
      setStatus("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="editrecommendations-container">
      <h2>Recomendaciones</h2>

      <div className='warning-container'>
        <FontAwesomeIcon icon={faTriangleExclamation}
          style={{color: "var(--color-secundary)", paddingRight: "0.5rem"}}/>
        Aviso: Recomendaciones informativas, no diagnósticas
      </div>

      <div className='warning-text'>
        La información mostrada es orientativa y puede ser ajustada por un médico.
      </div>

      <div className='blue-line'></div>

      <div className='card-recommendations'>
        <div className='title-card-recommendations'>
          <h3>Recomendaciones principales</h3>
          {isEditing ? (
            <div className='button-container-edit active-edit'>
              <button className="button-primary" onClick={onSave} disabled={loading}>
                {loading ? "Guardando…" : "Guardar cambios"}
              </button>
              <button className="button-danger" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <div className='button-container-edit'>
              <button className="button-primary middle-with" onClick={() => setIsEditing(true)}>
                Editar recomendaciones
              </button>
            </div>
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
            <div className="field textarea-recommendation-content"
                 style={{ whiteSpace: "pre-line" }}>
              {text}
            </div>
          )}
        </div>
      </div>

      <hr className='buttons-separation'/>

      <div className="button-recommendations-container add-margin-top">
        <button className="button-secondary" onClick={onBack}>
          Regresar
        </button>
        <button className="button-primary" style={{width: "auto"}} onClick={onSave}>
          Guardar y notificar al paciente
        </button>
        <button className="button-danger" onClick={() => setStatus("No se realizaron cambios")}>
          No realizar cambios
        </button>
      </div>

      {status && <div className="badge estable">{status}</div>}
    </div>
  )
}
