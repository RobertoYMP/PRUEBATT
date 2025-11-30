import { useState } from 'react'
import './Specialists.css'
import '../../components/Popup/Popup'

export default function Specialists(){
  const [showPopup, setShowPopup] = useState(true);

  const items = [
    { nombre:'Dra. Salma Cruz', especialidad:'Internista', tel:'55 6966 8934', email:'samcruz@hotmail.com' },
    { nombre:'Dra. Karla Medina', especialidad:'Medica Cirujana', tel:'55 9876 5432', email:'karlamc@gmail.com' },
  ]

  return (
    <>
      <div className='specialists-container'>
        <h2>Nuestros especialistas</h2>
        <div className='specialists-cards-container'>
          {items.map((x,i)=> (
            <div key={i} className="specialist-card">
              <strong>{x.nombre}</strong>
              <div>{x.especialidad}</div>
              <div>{x.tel}</div>
              <div>{x.email}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
