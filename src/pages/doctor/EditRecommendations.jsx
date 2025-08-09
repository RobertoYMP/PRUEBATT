  import React, { useState } from 'react'
  import { getRecommendations, saveRecommendations } from '../../mock/api.js'
  export default function EditRecommendations(){
    const [text, setText] = useState(getRecommendations() || `Mayor concentración de glóbulos rojos...
Tamaño anormal de los glóbulos rojos...`)
    const [status, setStatus] = useState('')
    async function onSave(){
      setStatus('')
      await saveRecommendations(text)
      setStatus('Cambios guardados y notificación enviada')
    }
    return (
      <div className="card stack">
        <h2>Editar recomendaciones</h2>
        <textarea rows={10} className="field" style={{width:'100%'}} value={text} onChange={e=>setText(e.target.value)} />
        <div className="row">
          <button className="btn" onClick={onSave}>Guardar y notificar al paciente</button>
          <button className="btn secondary" onClick={()=>setStatus('No se realizaron cambios')}>No realizar cambios</button>
        </div>
        {status && <div className="badge estable">{status}</div>}
      </div>
    )
  }
