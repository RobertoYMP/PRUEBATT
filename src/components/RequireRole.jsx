import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../mock/api.js'

/**
 * Protege rutas por rol.
 * Uso:
 * <Route path="/admin/users" element={<RequireRole role="admin"><Users /></RequireRole>} />
 */
export default function RequireRole({ role, children }) {
  const loc = useLocation()
  const session = getSession()

  // No hay sesión → enviar a login
  if (!session) {
    return <Navigate to="/login" state={{ from: loc }} replace />
  }

  // Hay sesión pero el rol no coincide → enviarlo a su home
  if (role && session.role !== role) {
    const home = { admin: '/admin/users', doctor: '/doctor', patient: '/app' }
    return <Navigate to={home[session.role] || '/login'} replace />
  }

  return children
}
