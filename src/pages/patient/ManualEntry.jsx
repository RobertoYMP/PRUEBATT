import React from 'react'
import FormField from '../../components/FormField.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";


export default function ManualEntry() {
  const [open, setOpen] = useState(false);

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
          <p className="manual-section-title">Parámetros principales</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Leu" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Eri" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Hb" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Hto" />
            </div>
          </div>

          <p className="manual-section-title">Índices eritrocitarios</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="VCM" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="HCM" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="CHCM" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="ADE (D.E.)" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="ADE (C.V.)" />
            </div>
          </div>

          <p className="manual-section-title">Plaquetas</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Plaq" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="VPM" />
            </div>
          </div>

          <p className="manual-section-title">NRBC / IG</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="NRBC" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="NRBC %" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="IG" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="IG %" />
            </div>
          </div>

          <p className="manual-section-title">Diferencial leucocitaria (%)</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Linf %" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Mono %" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Eos %" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Baso %" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Neut %" />
            </div>
          </div>

          <p className="manual-section-title">Recuento absoluto</p>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Linf" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Mono" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Eos" />
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Baso" />
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <FormField label="Neut" />
            </div>
          </div>

          <div className="manual-actions">
            <button
              className="button-primary"
              form="uploadForm"
              type="submit"
              style={{ minWidth: '260px' }}
            >
              Realizar prediagnóstico
            </button>
          </div>
        </div>
      </div>
    </>
  )
}