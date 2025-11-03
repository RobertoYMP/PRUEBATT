import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/home/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Dashboard from './pages/patient/Dashboard/Dashboard.jsx'
import Upload from './pages/patient/Upload/Upload.jsx'
import History from './pages/patient/History.jsx'
import Notifications from './pages/patient/Notifications.jsx'
import Specialists from './pages/specialists/Specialists.jsx'
import PrediagResults from './pages/patient/PrediagResults.jsx'
import PrediagCharts from './pages/patient/PrediagCharts.jsx'
import Recommendations from './pages/patient/Recommendations.jsx'
import ManualEntry from './pages/patient/ManualEntry.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard/DoctorDashboard.jsx'
import EditRecommendations from './pages/doctor/EditRecommendations/EditRecommendations.jsx'
import Users from './pages/admin/Users/Users.jsx'
import NewSpecialist from './pages/admin/NewEspecialist/NewSpecialist.jsx'
import EditSpecialist from './pages/admin/EditSpecialist/EditSpecialist.jsx'
import PatientProfile from './pages/admin/PatientProfile/PatientProfile.jsx'
import SpecialistProfile from './pages/admin/SpecialistProfile/SpecialistProfile.jsx'
// import RequireRole from './components/RequireRole.jsx'  // <-- ya no se usa
import { NotificationProvider } from "./context/NotificationContext"
import HistoryReviews from './pages/doctor/HistoryReviews/HistoryReviews.jsx'

// Helpers de sesión desde Cognito (mismo archivo que ya tienes)
import { isSessionValid, getRole } from './pages/auth/cognito'

// Destino por rol
function targetByRole(role) {
  if (role === 'admin')  return '/admin/users'
  if (role === 'doctor') return '/doctor'
  return '/app'
}

// Wrapper para rutas públicas de auth: si ya hay sesión, manda al dashboard
function PublicAuth({ children }) {
  if (isSessionValid()) {
    return <Navigate to={targetByRole(getRole())} replace />
  }
  return children
}

// Wrapper de protección y chequeo de rol
function RoleRoute({ role, children }) {
  if (!isSessionValid()) {
    return <Navigate to="/login" replace />
  }
  const r = getRole()
  if (role && r !== role) {
    // si no coincide el rol, redirige a su dashboard real
    return <Navigate to={targetByRole(r)} replace />
  }
  return children
}

export default function App() {
  const currentUserId = 123; // Simular que el usuario logueado tiene ID = 123
  return (
    <div className="layout">
      <NotificationProvider currentUserId={currentUserId}>
        <Header />
        <main className="container">
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/specialists" element={<Specialists />} />

            {/* Auth públicas, pero si ya hay sesión, redirigen al dashboard */}
            <Route path="/login"   element={<PublicAuth><Login /></PublicAuth>} />
            <Route path="/register" element={<PublicAuth><Register /></PublicAuth>} />
            <Route path="/forgot"  element={<PublicAuth><ForgotPassword /></PublicAuth>} />
            <Route path="/reset"   element={<PublicAuth><ResetPassword /></PublicAuth>} />

            {/* Paciente (solo role=patient) */}
            <Route path="/app"                element={<RoleRoute role="patient"><Dashboard /></RoleRoute>} />
            <Route path="/app/upload"         element={<RoleRoute role="patient"><Upload /></RoleRoute>} />
            <Route path="/app/history"        element={<RoleRoute role="patient"><History /></RoleRoute>} />
            <Route path="/app/notifications"  element={<RoleRoute role="patient"><Notifications /></RoleRoute>} />
            <Route path="/app/specialists"    element={<RoleRoute role="patient"><Specialists /></RoleRoute>} />
            <Route path="/app/results"        element={<RoleRoute role="patient"><PrediagResults /></RoleRoute>} />
            <Route path="/app/charts"         element={<RoleRoute role="patient"><PrediagCharts /></RoleRoute>} />
            <Route path="/app/recommendations"element={<RoleRoute role="patient"><Recommendations /></RoleRoute>} />
            <Route path="/app/manual"         element={<RoleRoute role="patient"><ManualEntry /></RoleRoute>} />

            {/* Médico (solo role=doctor) */}
            <Route path="/doctor"                     element={<RoleRoute role="doctor"><DoctorDashboard /></RoleRoute>} />
            <Route path="/doctor/history-reviews"     element={<RoleRoute role="doctor"><HistoryReviews /></RoleRoute>} />
            <Route path="/doctor/edit-recommendations"element={<RoleRoute role="doctor"><EditRecommendations /></RoleRoute>} />

            {/* Admin (solo role=admin) */}
            <Route path="/admin/users"              element={<RoleRoute role="admin"><Users /></RoleRoute>} />
            <Route path="/admin/new-specialist"     element={<RoleRoute role="admin"><NewSpecialist /></RoleRoute>} />
            <Route path="/admin/edit-specialist"    element={<RoleRoute role="admin"><EditSpecialist /></RoleRoute>} />
            <Route path="/admin/patient-profile"    element={<RoleRoute role="admin"><PatientProfile /></RoleRoute>} />
            <Route path="/admin/specialist-profile" element={<RoleRoute role="admin"><SpecialistProfile /></RoleRoute>} />

            {/* 404 */}
            <Route path="*" element={<div className="card"><h2>404</h2><p>Página no encontrada.</p></div>} />
          </Routes>
        </main>
        <Footer />
      </NotificationProvider>
    </div>
  )
}
