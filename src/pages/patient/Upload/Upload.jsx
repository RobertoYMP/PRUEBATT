import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadPdf } from '../../../mock/api.js'
import './Upload.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation, faHandPointRight, faExclamation, faFilePdf } from "@fortawesome/free-solid-svg-icons"

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
    <div className='upload-container'>
      <h2>Subir archivo de Biometría Hemática</h2>
      <div className="upload-content">
        <div className='instructions-content'>
          <div className='instructions-title'>
            <h3><FontAwesomeIcon icon={faTriangleExclamation} className='upload-icon'/></h3>
            <h3>Instrucciones</h3>
          </div>
          <div className='text-content'>
            Por favor, elige o arrastra aquí el archivo PDF que contiene los resultados de tu biometría hemática.
            <br/><br/>
            <FontAwesomeIcon icon={faHandPointRight} /> El archivo debe tener el formato oficial de la clínica Salud Digna para poder ser analizado correctamente.
            <br/><br/>
            <FontAwesomeIcon icon={faExclamation} /> <strong>Importante: </strong>
            Los resultados mostrados a continuación serán un prediagnóstico automatizado.
            Este análisis no sustituye la valoración médica profesional.
            Siempre es recomendable acudir con un médico para una interpretación completa y un seguimiento adecuado.
          </div>
          <div className='upload-line'></div>
        </div>
        <div className='upload-file'>
          <div className='blue-content'>
            <div className='dashed-container'>
              <form onSubmit={onSubmit} className="stack">
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={(e)=>setFile(e.target.files?.[0])}
                  className="file-input-hidden"
                />
                <label htmlFor="pdfInput" className="file-cta" aria-label="Selecciona un archivo PDF">
                  <span className="file-cta__icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </span>
                  <span className="file-cta__text">Selecciona archivo PDF</span>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <div className="button-upload-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <button className="button-primary" disabled={loading}>{loading ? 'Generando prediagnóstico...' : 'Realizar prediagnóstico'}</button>
      </div>
    </div>
  )
}
