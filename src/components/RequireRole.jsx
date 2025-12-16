import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../mock/api.js'

export default function RequireRole({ role, children }) {
  const loc = useLocation()
  const session = getSession()
  if (!session) {
    return <Navigate to="/login" state={{ from: loc }} replace />
  }

  if (role && session.role !== role) {
    const home = { admin: '/admin/users', doctor: '/doctor', patient: '/app' }
    return <Navigate to={home[session.role] || '/login'} replace />
  }

  return children
}
