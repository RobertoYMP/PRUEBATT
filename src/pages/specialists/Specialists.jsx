import { useState } from 'react'
import './Specialists.css'
import '../../components/Popup/Popup'
import { Popup } from '../../components/Popup/Popup'

export default function Specialists(){
  const [error, setError] = useState(true)

  const items = [
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
    { nombre:'Dr. Juan López', especialidad:'Hematología', tel:'55 9876 5432', email:'juan@example.com' },
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
    { nombre:'Dr. Juan López', especialidad:'Hematología', tel:'55 9876 5432', email:'juan@example.com' },
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
    { nombre:'Dr. Juan López', especialidad:'Hematología', tel:'55 9876 5432', email:'juan@example.com' },
  ]

  return (
    <>
      {error && (
        <Popup
          width={"30rem"}
        />
      )}
      <div className='specialists-container'>
      <h2>Nuestros especialistas</h2>
      <div className='specialists-cards-container'>
        {items.map((x,i)=> (
          <div key={i} className="specialist-card">
            <img src='./Logo/blueLogo.png'></img>
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
