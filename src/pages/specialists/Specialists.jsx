import { useState } from 'react'
import './Specialists.css'
import '../../components/Popup/Popup'
//import { Popup } from '../../components/Popup/Popup'
//import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
//import { Link } from 'react-router-dom';

export default function Specialists(){
  const [showPopup, setShowPopup] = useState(true);

  const items = [
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
    { nombre:'Dr. Juan López', especialidad:'Hematología', tel:'55 9876 5432', email:'juan@example.com' },
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
  ]

  return (
    <>
      {/*
      <Popup
        icon={faTrashCan}
        type={"info"}
        tittle={"Generando tu prediagnóstico"}
        message={"unsaved_patient_changes"}
        showButton={false}
        buttonProps={{
          as: Link,
          to: "/login",
          typeButton: "button-primary",
          content: "Iniciar Sesión",
          borderRadius: "var(--default-radius)"
        }}
        onClose={() => setShowPopup(false)}
        isVisible={showPopup}
        extraButton={false}
        extraButtonProps={{
          as: Link,
          to: "/login",
          typeButton: "button-primary",
          content: "Ingresar otro correo electrónico",
          borderRadius: "var(--default-radius)"
        }}
      />*/}
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
