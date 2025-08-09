import React from 'react'
export default function FormField({label, type='text', ...props}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} {...props} />
    </div>
  )
}
