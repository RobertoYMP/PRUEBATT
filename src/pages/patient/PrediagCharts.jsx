import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
const data = [
  { name: 'Ene', Hb: 16.1 }, { name: 'Feb', Hb: 16.9 }, { name: 'Mar', Hb: 17.6 },
  { name: 'Abr', Hb: 18.5 }
]
export default function PrediagCharts(){
  return (
    <div className="card">
      <h2>Resultados en formato gráfico</h2>
      <p>Visualización simple para seguimiento de Hemoglobina</p>
      <div style={{width:'100%', height:300}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Hb" stroke="currentColor" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
