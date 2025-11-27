// src/pages/patient/ManualEntry.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons"
import { postManualPrediction } from '../../api/historyClient'

export default function ManualEntry() {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    sexo: 'Mujer',
    leu: '', eri: '', hb: '', hto: '',
    vcm: '', hcm: '', chcm: '', adeDE: '', adeCV: '',
    plaq: '', vpm: '',
    nrbcc: '', nrbccPct: '', ig: '', igPct: '',
    linfPct: '', monoPct: '', eosPct: '', basoPct: '', neutPct: '',
    linf: '', mono: '', eos: '', baso: '', neut: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  function handleChange(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1) Validar que TODOS los campos numéricos estén llenos y sean números
      const requiredFields = [
        'leu', 'eri', 'hb', 'hto',
        'vcm', 'hcm', 'chcm', 'adeDE', 'adeCV',
        'plaq', 'vpm',
        'nrbcc', 'nrbccPct', 'ig', 'igPct',
        'linfPct', 'monoPct', 'eosPct', 'basoPct', 'neutPct',
        'linf', 'mono', 'eos', 'baso', 'neut'
      ]

      const vacios = requiredFields.filter(f => form[f] === '' || form[f] === null || form[f] === undefined)
      if (vacios.length > 0) {
        throw new Error('Por favor llena todos los campos antes de realizar el prediagnóstico.')
      }

      const invalidos = requiredFields.filter(f => Number.isNaN(Number(form[f])))
      if (invalidos.length > 0) {
        throw new Error('Todos los campos deben contener valores numéricos válidos.')
      }

      // 2) Construir el JSON EXACTO que espera SageMaker
      const metrics = {
        "Leucocitos": Number(form.leu),
        "Eritrocitos": Number(form.eri),
        "Hemoglobina": Number(form.hb),
        "Hematocrito": Number(form.hto),
        "Volumen Corpuscular Medio": Number(form.vcm),
        "Hemoglobina Corpuscular Media": Number(form.hcm),
        "Conc. Media de HB Corpuscular": Number(form.chcm),
        "Ancho de Distribución Eritrocitaria (D.E.)": Number(form.adeDE),
        "Ancho de Distribución Eritrocitaria (C.V.)": Number(form.adeCV),
        "Plaquetas": Number(form.plaq),
        "Volumen Plaquetario Medio": Number(form.vpm),
        "NRBC": Number(form.nrbcc),
        "NRBC (%)": Number(form.nrbccPct),
        "IG": Number(form.ig),
        "IG (%)": Number(form.igPct),
        "Linfocitos (%)": Number(form.linfPct),
        "Monocitos (%)": Number(form.monoPct),
        "Eosinofilos (%)": Number(form.eosPct),
        "Basofilos (%)": Number(form.basoPct),
        "Neutrofilos (%)": Number(form.neutPct),
        "Linfocitos": Number(form.linf),
        "Monocitos": Number(form.mono),
        "Eosinofilos": Number(form.eos),
        "Basofilos": Number(form.baso),
        "Neutrofilos": Number(form.neut),
      }

      const payload = { sexo: form.sexo, metrics }

      const result = await postManualPrediction(payload)

      try {
        localStorage.setItem('lastPrediction', JSON.stringify(result))
      } catch {}

      nav('/app/results', { state: { result } })
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className="information-container"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faCircleInfo} />
      </div>

      {open && <div className="glossary-overlay" onClick={() => setOpen(false)} />}

      <div className={`glossary-panel ${open ? "open" : ""}`}>
        <div className="glossary-header">
          <h2>Glosario</h2>
          <button className="close-btn" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="glossary-content">
          <h4>Leucocitos (Leu)</h4>
          <p>Células de defensa del cuerpo…</p>

          <h4>Eritrocitos (Eri)</h4>
          <p>Glóbulos rojos…</p>

          <h4>Hemoglobina (Hb)</h4>
          <p>Proteína que transporta oxígeno…</p>

          <h4>Hematocrito (Hto)</h4>
          <p>Porcentaje del volumen de sangre compuesto…</p>

          <h4>VCM, HCM, CHCM, Plaquetas, etc.</h4>
          <p>…</p>
        </div>
      </div>

      <div className='manual-container'>
        <h2>Ingresar datos manualmente</h2>
        <div className="card-manual">
          <form id="manualForm" onSubmit={handleSubmit}>
            {/* TODO: el resto de tu formulario tal cual lo tenías */}
            {/* ... */}

            {error && (
              <p className="manual-error">
                {error}
              </p>
            )}

            <div className="manual-actions">
              <button
                className="button-primary"
                type="submit"
                form="manualForm"
                style={{ minWidth: '260px' }}
                disabled={loading}
              >
                {loading ? 'Procesando…' : 'Realizar prediagnóstico'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
