import React from 'react'
import FormField from '../../components/FormField.jsx'
export default function NewSpecialist(){
  return (
    <div className="card stack">
      <h2>Registrar nuevo médico especialista</h2>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Nombre" /></div>
        <div style={{flex:1}}><FormField label="Apellido" /></div>
      </div>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Cédula Profesional" /></div>
        <div style={{flex:1}}><FormField label="Teléfono de contacto profesional" /></div>
      </div>
      <FormField label="Especialidad" />
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Correo electrónico" /></div>
        <div style={{flex:1}}><FormField label="Fecha de nacimiento" /></div>
      </div>
      <div className="stack-2">
        <div style={{flex:1}}><FormField label="Contraseña" type="password" /></div>
        <div style={{flex:1}}><FormField label="Confirmar contraseña" type="password" /></div>
      </div>
      <div className="stack-2">
        <button className="btn">Guardar médico</button>
        <button className="btn secondary">Regresar</button>
      </div>
    </div>
  )
}
