import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Dashboard from './pages/patient/Dashboard.jsx'
import Upload from './pages/patient/Upload.jsx'
import History from './pages/patient/History.jsx'
import Notifications from './pages/patient/Notifications.jsx'
import Specialists from './pages/patient/Specialists.jsx'
import PrediagResults from './pages/patient/PrediagResults.jsx'
import PrediagCharts from './pages/patient/PrediagCharts.jsx'
import Recommendations from './pages/patient/Recommendations.jsx'
import ManualEntry from './pages/patient/ManualEntry.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import ReviewHistory from './pages/doctor/ReviewHistory.jsx'
import EditRecommendations from './pages/doctor/EditRecommendations.jsx'
import Users from './pages/admin/Users.jsx'
import NewSpecialist from './pages/admin/NewSpecialist.jsx'
import EditSpecialist from './pages/admin/EditSpecialist.jsx'
import PatientProfile from './pages/admin/PatientProfile.jsx'
import SpecialistProfile from './pages/admin/SpecialistProfile.jsx'

export default function App() {
  return (
    <div className="layout">
      <Header />
      <main className="container">
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Paciente */}
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/upload" element={<Upload />} />
          <Route path="/app/history" element={<History />} />
          <Route path="/app/notifications" element={<Notifications />} />
          <Route path="/app/specialists" element={<Specialists />} />
          <Route path="/app/results" element={<PrediagResults />} />
          <Route path="/app/charts" element={<PrediagCharts />} />
          <Route path="/app/recommendations" element={<Recommendations />} />
          <Route path="/app/manual" element={<ManualEntry />} />

          {/* Médico */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/reviews" element={<ReviewHistory />} />
          <Route path="/doctor/edit-recommendations" element={<EditRecommendations />} />

          {/* Admin */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/new-specialist" element={<NewSpecialist />} />
          <Route path="/admin/edit-specialist" element={<EditSpecialist />} />
          <Route path="/admin/patient-profile" element={<PatientProfile />} />
          <Route path="/admin/specialist-profile" element={<SpecialistProfile />} />

          <Route path="*" element={<div className="card"><h2>404</h2><p>Página no encontrada.</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
