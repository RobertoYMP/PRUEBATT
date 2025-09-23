import React from 'react'
import FormField from '../../../components/FormField.jsx'
import './NewSpecialist.css'

export default function NewSpecialist(){
  return (
    <div className='newspecialist-container'>
      <h2>Registrar nuevo médico especialista</h2>
      <div className="card-newspecialist">
        <div className="stack-2">
          <div style={{flex:1}}><FormField label="Nombre:" /></div>
          <div style={{flex:1}}><FormField label="Apellido:" /></div>
        </div>
        <div className="stack-2 field-padding-top">
          <div style={{flex:1}}><FormField label="Fecha de nacimiento:" type='date'/></div>
          <div style={{flex:1}} className="field">
            <label>Sexo:</label>
            <select>
              <option>Mujer</option>
              <option>Hombre</option>
            </select>
          </div>
        </div>
        <div className='stack-2 field-padding-top'>
          <div style={{flex:1}}><FormField label="Cédula Profesional:" inputMode="numeric" pattern="[0-9]*"/></div>
          <div style={{flex:1}}><FormField label="Teléfono de contacto profesional:" inputMode="numeric" pattern="[0-9]*"/></div>          
        </div>
        <div className="stack-2 field-padding-top">
          <FormField label="Especialidad:" tyle={{flex:1}}/>
          <div style={{flex:1}}><FormField label="Correo electrónico:" type='email'/></div>
        </div>
        <div className="stack-2 field-padding-top">
          <div style={{flex:1}}><FormField label="Contraseña:" type="password" /></div>
          <div style={{flex:1}}><FormField label="Confirmar contraseña:" type="password" /></div>
        </div>
        <div className="stack-2 field-padding-top">
          <FormField className='photo-input' label="Foto de perfil (seleccionar archivo jpg o png):" style={{flex:1, backgroundColor:'var(--color-secundary)', color:'#fff', padding:'5px'}} type='file' accept="image/png, image/jpeg"/>
        </div>
      </div>
      <hr/>
      <div className="button-newspecialist-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <button className="button-primary">Guardar médico</button>
      </div>
    </div>
  )
}
