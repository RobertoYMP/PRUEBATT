import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/home/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Dashboard from './pages/patient/Dashboard.jsx'
import Upload from './pages/patient/Upload.jsx'
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
import RequireRole from './components/RequireRole.jsx'
import { NotificationProvider } from "./context/NotificationContext"
import HistoryReviews from './pages/doctor/HistoryReviews/HistoryReviews.jsx'

export default function App() {
  const currentUserId = 123; //Simular que el usuario logueado tiene ID = 123
  return (
    <div className="layout">
      <NotificationProvider currentUserId={currentUserId}>
        <Header />
        <main className="container">
          <Routes>
            {/* Auth */}
            <Route path="/" element={<Home />} />
            <Route path='/specialists' element={<Specialists />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />

            {/* Paciente (solo rol patient) */}
            <Route path="/app" element={<RequireRole role="patient"><Dashboard /></RequireRole>} />
            <Route path="/app/upload" element={<RequireRole role="patient"><Upload /></RequireRole>} />
            <Route path="/app/history" element={<RequireRole role="patient"><History /></RequireRole>} />
            <Route path="/app/notifications" element={<RequireRole role="patient"><Notifications /></RequireRole>} />
            <Route path="/app/specialists" element={<RequireRole role="patient"><Specialists /></RequireRole>} />
            <Route path="/app/results" element={<RequireRole role="patient"><PrediagResults /></RequireRole>} />
            <Route path="/app/charts" element={<RequireRole role="patient"><PrediagCharts /></RequireRole>} />
            <Route path="/app/recommendations" element={<RequireRole role="patient"><Recommendations /></RequireRole>} />
            <Route path="/app/manual" element={<RequireRole role="patient"><ManualEntry /></RequireRole>} />

            {/* Médico (solo rol doctor) */}
            <Route path="/doctor" element={<RequireRole role="doctor"><DoctorDashboard /></RequireRole>} />
            <Route path="/doctor/history-reviews" element={<RequireRole role="doctor"><HistoryReviews /></RequireRole>} />
            <Route path="/doctor/edit-recommendations" element={<RequireRole role="doctor"><EditRecommendations /></RequireRole>} />

            {/* Admin (solo rol admin) */}
            <Route path="/admin/users" element={<RequireRole role="admin"><Users /></RequireRole>} />
            <Route path="/admin/new-specialist" element={<RequireRole role="admin"><NewSpecialist /></RequireRole>} />
            <Route path="/admin/edit-specialist" element={<RequireRole role="admin"><EditSpecialist /></RequireRole>} />
            <Route path="/admin/patient-profile" element={<RequireRole role="admin"><PatientProfile /></RequireRole>} />
            <Route path="/admin/specialist-profile" element={<RequireRole role="admin"><SpecialistProfile /></RequireRole>} />

            <Route path="*" element={<div className="card"><h2>404</h2><p>Página no encontrada.</p></div>} />
          </Routes>
        </main>
        <Footer />
      </NotificationProvider>
    </div>
  )
}
