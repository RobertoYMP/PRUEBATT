import React from 'react'
export default function Specialists(){
  const items = [
    { nombre:'Dra. Ana Pérez', especialidad:'Hematología', tel:'55 1234 5678', email:'ana@example.com' },
    { nombre:'Dr. Juan López', especialidad:'Hematología', tel:'55 9876 5432', email:'juan@example.com' },
  ]
  return (
    <div className="card stack">
      <h2>Nuestros especialistas</h2>
      {items.map((x,i)=> (
        <div key={i} className="card" style={{background:'var(--color-surface-2)'}}>
          <strong>{x.nombre}</strong>
          <p>{x.especialidad} · {x.tel} · {x.email}</p>
        </div>
      ))}
    </div>
  )
}
