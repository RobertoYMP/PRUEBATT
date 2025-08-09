import React from 'react'
import FormField from '../../components/FormField.jsx'
export default function EditSpecialist(){
  return (
    <div className="card stack">
      <h2>Editar médico</h2>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Nombre" /></div>
        <div style={{flex:1}}><FormField label="Apellido" /></div>
      </div>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Cédula Profesional" /></div>
        <div style={{flex:1}}><FormField label="Teléfono de contacto profesional" /></div>
      </div>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Correo electrónico" /></div>
        <div style={{flex:1}}><FormField label="Fecha de nacimiento" /></div>
      </div>
      <div className="stack-2">
        <button className="btn">Guardar cambios</button>
        <button className="btn secondary">Regresar</button>
      </div>
    </div>
  )
}
