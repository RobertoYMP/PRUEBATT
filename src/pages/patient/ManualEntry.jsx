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
      const requiredFields = [
        'leu', 'eri', 'hb', 'hto',
        'vcm', 'hcm', 'chcm', 'adeDE', 'adeCV',
        'plaq', 'vpm',
        'nrbcc', 'nrbccPct', 'ig', 'igPct',
        'linfPct', 'monoPct', 'eosPct', 'basoPct', 'neutPct',
        'linf', 'mono', 'eos', 'baso', 'neut'
      ]

      const vacios = requiredFields.filter(
        f => form[f] === '' || form[f] === null || form[f] === undefined
      )
      if (vacios.length > 0) {
        throw new Error('Por favor llena todos los campos antes de realizar el prediagnóstico.')
      }

      const invalidos = requiredFields.filter(f => Number.isNaN(Number(form[f])))
      if (invalidos.length > 0) {
        throw new Error('Todos los campos deben contener valores numéricos válidos.')
      }

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

      // 👉 Guardamos resultado manual para que Results, Charts y Recomendations lo usen
      try {
        sessionStorage.setItem('manualPrediction', JSON.stringify(result))
        localStorage.setItem('lastPrediction', JSON.stringify(result))
      } catch {}

      // 👉 Indicamos que venimos del flujo manual
      nav('/app/results?src=manual', { state: { result } })
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
          <h2 className='glossary-title'>Glosario de biometría hemática</h2>
          <button className="close-btn" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="glossary-content">
          <h3 className="glossary-section-title">Parámetros principales</h3>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Leucocitos</span>
              <span className="glossary-term-abbr">Leu</span>
            </h4>
            <p className="glossary-term-desc">
              Células de defensa del cuerpo. Ayudan a combatir infecciones,
              virus, bacterias y otras amenazas.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Eritrocitos</span>
              <span className="glossary-term-abbr">Eri</span>
            </h4>
            <p className="glossary-term-desc">
              Glóbulos rojos. Transportan oxígeno desde los pulmones hacia el
              resto del cuerpo.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Hemoglobina</span>
              <span className="glossary-term-abbr">Hb</span>
            </h4>
            <p className="glossary-term-desc">
              Proteína dentro de los glóbulos rojos que se encarga de transportar
              el oxígeno. Es el principal indicador de anemia.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Hematocrito</span>
              <span className="glossary-term-abbr">Hto</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje del volumen de sangre que está formado por glóbulos
              rojos. Indica si la sangre es "diluida" o "concentrada".
            </p>
          </div>

          <h3 className="glossary-section-title">Índices eritrocitarios</h3>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Volumen Corpuscular Medio</span>
              <span className="glossary-term-abbr">VCM</span>
            </h4>
            <p className="glossary-term-desc">
              Tamaño promedio de los glóbulos rojos. Valores bajos se asocian a
              células pequeñas (microcitosis) y valores altos a células grandes
              (macrocitosis).
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Hemoglobina Corpuscular Media</span>
              <span className="glossary-term-abbr">HCM</span>
            </h4>
            <p className="glossary-term-desc">
              Cantidad promedio de hemoglobina dentro de cada glóbulo rojo.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                Concentración Media de Hb Corpuscular
              </span>
              <span className="glossary-term-abbr">CHCM</span>
            </h4>
            <p className="glossary-term-desc">
              Concentración de hemoglobina dentro de los glóbulos rojos. Ayuda a
              identificar células "pálidas" (hipocrómicas).
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                Ancho de Distribución Eritrocitaria D.E.
              </span>
              <span className="glossary-term-abbr">D.E.</span>
            </h4>
            <p className="glossary-term-desc">
              Medida de la variación en el tamaño real de los glóbulos rojos.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                Ancho de Distribución Eritrocitaria C.V.
              </span>
              <span className="glossary-term-abbr">C.V.</span>
            </h4>
            <p className="glossary-term-desc">
              Variación porcentual del tamaño de los glóbulos rojos. Valores
              altos indican mucha diferencia entre células (anisocitosis).
            </p>
          </div>

          <h3 className="glossary-section-title">Plaquetas</h3>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Plaquetas</span>
              <span className="glossary-term-abbr">Plaq</span>
            </h4>
            <p className="glossary-term-desc">
              Células encargadas de la coagulación. Previenen hemorragias y
              ayudan a cerrar heridas.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                Volumen Plaquetario Medio
              </span>
              <span className="glossary-term-abbr">VPM</span>
            </h4>
            <p className="glossary-term-desc">
              Tamaño promedio de las plaquetas. Las plaquetas grandes suelen ser
              más jóvenes y las pequeñas más viejas o de menor producción.
            </p>
          </div>

          <h3 className="glossary-section-title">NRBC / IG</h3>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                NRBC (glóbulos rojos nucleados)
              </span>
              <span className="glossary-term-abbr">NRBC</span>
            </h4>
            <p className="glossary-term-desc">
              Glóbulos rojos inmaduros. Normalmente no deben circular en sangre.
              Pueden aparecer en situaciones graves o en estados de estrés del
              organismo.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">NRBC%</span>
              <span className="glossary-term-abbr">NRBC%</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de glóbulos rojos inmaduros en sangre respecto al total
              de células blancas.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">
                IG (granulocitos inmaduros)
              </span>
              <span className="glossary-term-abbr">IG</span>
            </h4>
            <p className="glossary-term-desc">
              Granulocitos inmaduros, es decir, glóbulos blancos jóvenes que aún
              no completan su desarrollo. Su presencia suele indicar infección
              fuerte o inflamación.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">IG%</span>
              <span className="glossary-term-abbr">IG%</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de granulocitos inmaduros respecto al total de
              leucocitos.
            </p>
          </div>

          <h3 className="glossary-section-title">Diferencial leucocitaria (%)</h3>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Linfocitos</span>
              <span className="glossary-term-abbr">Linf %</span>
            </h4>
            <p className="glossary-term-desc">
              Proporción de linfocitos dentro del total de leucocitos. Se
              relaciona con infecciones virales y con la defensa inmunológica.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Monocitos</span>
              <span className="glossary-term-abbr">Mono %</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de monocitos. Células que ayudan a eliminar desechos,
              bacterias y células dañadas.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Eosinófilos</span>
              <span className="glossary-term-abbr">Eos %</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de células que participan en alergias y en la defensa
              contra parásitos.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Basófilos</span>
              <span className="glossary-term-abbr">Baso %</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de basófilos, células relacionadas con reacciones
              alérgicas y con la liberación de histamina.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Neutrófilos</span>
              <span className="glossary-term-abbr">Neut %</span>
            </h4>
            <p className="glossary-term-desc">
              Porcentaje de neutrófilos, las células que combaten principalmente
              infecciones bacterianas.
            </p>
          </div>

          <h3 className="glossary-section-title">Recuento absoluto</h3>

          <p className="glossary-term-desc" style={{ marginBottom: '.6rem' }}>
            Estos valores indican cuántas células hay por microlitro de sangre,
            no un porcentaje.
          </p>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Linfocitos</span>
              <span className="glossary-term-abbr">Linf</span>
            </h4>
            <p className="glossary-term-desc">
              Cantidad total de linfocitos. Es útil para valorar el estado general
              del sistema inmunológico.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Monocitos</span>
              <span className="glossary-term-abbr">Mono</span>
            </h4>
            <p className="glossary-term-desc">
              Cantidad real de monocitos. Puede aumentar en infecciones
              persistentes o inflamación crónica.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Eosinófilos</span>
              <span className="glossary-term-abbr">Eos</span>
            </h4>
            <p className="glossary-term-desc">
              Número total de eosinófilos. Suele elevarse en alergias, asma o
              infecciones por parásitos.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Basófilos</span>
              <span className="glossary-term-abbr">Baso</span>
            </h4>
            <p className="glossary-term-desc">
              Recuento total de basófilos. Normalmente es muy bajo; puede
              aumentar en alergias intensas o en ciertos trastornos
              hematológicos.
            </p>
          </div>

          <div className="glossary-item">
            <h4 className="glossary-term-title">
              <span className="glossary-term-name">Neutrófilos</span>
              <span className="glossary-term-abbr">Neut</span>
            </h4>
            <p className="glossary-term-desc">
              Cantidad real de neutrófilos. Es uno de los valores más importantes
              para evaluar infecciones bacterianas.
            </p>
          </div>
        </div>
      </div>

      <div className='manual-container'>
        <h2>Ingresar datos manualmente</h2>
        <div className="card-manual">
          <form id="manualForm" onSubmit={handleSubmit}>
            <p className="manual-section-title">Datos generales</p>
            <div className="row row-compact" style={{ marginBottom: '1rem' }}>
              <div className="field-block">
                <label>Sexo</label>
                <div className="field-select-wrapper">
                  <select
                    className="field-select"
                    value={form.sexo}
                    onChange={handleChange('sexo')}
                  >
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="manual-section-title">Parámetros principales</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Leu"
                  value={form.leu}
                  onChange={handleChange('leu')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Eri"
                  value={form.eri}
                  onChange={handleChange('eri')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Hb"
                  value={form.hb}
                  onChange={handleChange('hb')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Hto"
                  value={form.hto}
                  onChange={handleChange('hto')}
                  type="number"
                />
              </div>
            </div>

            <p className="manual-section-title">Índices eritrocitarios</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="VCM"
                  value={form.vcm}
                  onChange={handleChange('vcm')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="HCM"
                  value={form.hcm}
                  onChange={handleChange('hcm')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="CHCM"
                  value={form.chcm}
                  onChange={handleChange('chcm')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="ADE (D.E.)"
                  value={form.adeDE}
                  onChange={handleChange('adeDE')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="ADE (C.V.)"
                  value={form.adeCV}
                  onChange={handleChange('adeCV')}
                  type="number"
                />
              </div>
            </div>

            <p className="manual-section-title">Plaquetas</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Plaq"
                  value={form.plaq}
                  onChange={handleChange('plaq')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="VPM"
                  value={form.vpm}
                  onChange={handleChange('vpm')}
                  type="number"
                />
              </div>
            </div>

            <p className="manual-section-title">NRBC / IG</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="NRBC"
                  value={form.nrbcc}
                  onChange={handleChange('nrbcc')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="NRBC %"
                  value={form.nrbccPct}
                  onChange={handleChange('nrbccPct')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="IG"
                  value={form.ig}
                  onChange={handleChange('ig')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="IG %"
                  value={form.igPct}
                  onChange={handleChange('igPct')}
                  type="number"
                />
              </div>
            </div>

            <p className="manual-section-title">Diferencial leucocitaria (%)</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Linf %"
                  value={form.linfPct}
                  onChange={handleChange('linfPct')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Mono %"
                  value={form.monoPct}
                  onChange={handleChange('monoPct')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Eos %"
                  value={form.eosPct}
                  onChange={handleChange('eosPct')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Baso %"
                  value={form.basoPct}
                  onChange={handleChange('basoPct')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Neut %"
                  value={form.neutPct}
                  onChange={handleChange('neutPct')}
                  type="number"
                />
              </div>
            </div>

            <p className="manual-section-title">Recuento absoluto</p>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Linf"
                  value={form.linf}
                  onChange={handleChange('linf')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Mono"
                  value={form.mono}
                  onChange={handleChange('mono')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Eos"
                  value={form.eos}
                  onChange={handleChange('eos')}
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormField
                  label="Baso"
                  value={form.baso}
                  onChange={handleChange('baso')}
                  type="number"
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <FormField
                  label="Neut"
                  value={form.neut}
                  onChange={handleChange('neut')}
                  type="number"
                />
              </div>
            </div>

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
