import React from 'react'
import FormField from '../../components/FormField.jsx'
export default function ManualEntry(){
  return (
    <div className="card stack">
      <h2>Ingresar datos manualmente</h2>
      <p>Serie Roja (Eritrocítica)</p>
      <div className="row">
        <div style={{flex:1}}><FormField label="Eritrocitos / Hematíes" /></div>
        <div style={{flex:1}}><FormField label="Hemoglobina (Hb)" /></div>
      </div>
      <div className="row">
        <div style={{flex:1}}><FormField label="Hematocrito (Hto)" /></div>
        <div style={{flex:1}}><FormField label="VCM" /></div>
      </div>
      <div className="row">
        <div style={{flex:1}}><FormField label="HCM" /></div>
        <div style={{flex:1}}><FormField label="ADE / RDW" /></div>
      </div>
      <button className="btn">Realizar prediagnóstico</button>
    </div>
  )
}
