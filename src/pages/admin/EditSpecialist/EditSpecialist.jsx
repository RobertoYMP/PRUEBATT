import React from 'react'
import FormField from '../../../components/FormField'
import './EditSpecialist.css'

export default function EditSpecialist(){
  return (
    <div className='editspecialist-container'>
      <h2>Editar médico</h2>
      <div className="card-editspecialist">
        <div className="stack-2">
          <div style={{flex:1}}><FormField label="Nombre:" defaultValue="Alejando"/></div>
          <div style={{flex:1}}><FormField label="Apellido:" defaultValue="Reyes"/></div>
        </div>
        <div className="stack-2 field-padding-top">
          <div style={{flex:1}}><FormField label="Fecha de nacimiento:" defaultValue="2025-09-21" type='date'/></div>
          <div style={{flex:1}} className="field">
            <label>Sexo:</label>
            <select>
              <option>Mujer</option>
              <option>Hombre</option>
            </select>
          </div>
        </div>
        <div className="stack-2 field-padding-top">
          <div style={{flex:1}}><FormField label="Cédula Profesional:" defaultValue="125660" inputMode="numeric" pattern="[0-9]*"/></div>
          <div style={{flex:1}}><FormField label="Teléfono de contacto profesional:" defaultValue="55963072" inputMode="numeric" pattern="[0-9]*"/></div>
        </div>
        <div className="stack-2 field-padding-top">
          <FormField label="Especialidad:" tyle={{flex:1}} defaultValue="Médico General"/>
          <div style={{flex:1}}><FormField label="Correo electrónico:" defaultValue="correo@gmail.com"/></div>
        </div>
        <div className="stack-2 field-padding-top">
          <div style={{flex:1}}><FormField label="Contraseña:" type="password" defaultValue="52522208"/></div>
          <div style={{flex:1}}><FormField label="Confirmar contraseña:" type="password" defaultValue="52522208"/></div>
        </div>
        <div className="stack-2 field-padding-top">
          <FormField className='photo-input' label="Foto de perfil (seleccionar archivo jpg o png):" style={{flex:1, backgroundColor:'var(--color-secundary)', color:'#fff', padding:'5px'}} type='file' accept="image/png, image/jpeg"/>
        </div>
      </div>
      <hr/>
      <div className="button-newspecialist-container add-margin-top">
        <button className="button-secondary">Regresar</button>
        <button className="button-primary">Guardar cambios</button>
      </div>
    </div>    
  )
}
