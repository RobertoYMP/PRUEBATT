import React from 'react'
export default function Recommendations(){
  return (
    <div className="card stack">
      <h2>Recomendaciones</h2>
      <div className="card" style={{background:'var(--color-surface-2)'}}>
        <p><strong>Aviso:</strong> Recomendaciones informativas, no diagnósticas.</p>
        <ul>
          <li>Acude con un médico especialista en hematología lo antes posible.</li>
          <li>Evita esfuerzos físicos intensos hasta tener una evaluación médica.</li>
          <li>Mantente bien hidratado y lleva un registro de tus síntomas diarios.</li>
        </ul>
      </div>
    </div>
  )
}
