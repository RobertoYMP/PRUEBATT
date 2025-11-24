import React from 'react'
import FormField from '../../components/FormField.jsx'

export default function ManualEntry() {
  return (
    <div className="card stack">
      <h2>Ingresar datos manualmente</h2>

      <p>Parámetros principales</p>
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

      <p>Índices eritrocitarios</p>
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

      <p>Plaquetas</p>
      <div className="row">
        <div style={{ flex: 1 }}>
          <FormField label="Plaq" />
        </div>
        <div style={{ flex: 1 }}>
          <FormField label="VPM" />
        </div>
      </div>

      <p>NRBC / IG</p>
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

      <p>Diferencial leucocitaria (%)</p>
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

      <p>Recuento absoluto</p>
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

      <button
        className="button-primary"
        form="uploadForm"
        type="submit"
        style={{ minWidth: '260px' }}
      >
        Realizar prediagnóstico
      </button>
    </div>
  )
}