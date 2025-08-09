import React from 'react'
export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = key.includes('crític') ? 'critico' : 'estable'
  return <span className={`badge ${cls}`}>{status}</span>
}
