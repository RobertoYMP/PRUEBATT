import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadPdf } from '../../mock/api.js'

export default function Upload(){
  const nav = useNavigate()
  const [file,setFile] = useState(null)
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if(!file){ setError('Selecciona un archivo PDF'); return }
    setLoading(true)
    await uploadPdf(file.name)
    setLoading(false)
    nav('/app/results')
  }

  return (
    <div className="card stack">
      <h2>Subir archivo de Biometría Hemática</h2>
      <p>Instrucciones: selecciona un archivo PDF para realizar el prediagnóstico.</p>
      {error && <div className="badge critico">{error}</div>}
      <form onSubmit={onSubmit} className="stack">
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0])} />
        <button className="btn" disabled={loading}>{loading ? 'Generando prediagnóstico...' : 'Realizar prediagnóstico'}</button>
      </form>
    </div>
  )
}
