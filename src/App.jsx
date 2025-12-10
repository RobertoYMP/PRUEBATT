import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/home/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Terms from './pages/auth/Terms/Terms.jsx'
import Privacy from './pages/auth/Privacy/Privacy.jsx'
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
import { NotificationProvider } from "./context/NotificationContext"
//import HistoryReviews from './pages/doctor/HistoryReviews/HistoryReviews.jsx'
import { Popup } from './components/Popup/Popup.jsx'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'

// ⬇️ NUEVO: vista de prediagnóstico para el doctor
import DoctorPrediagResults from './pages/doctor/DoctorPrediagResults/DoctorPrediagResults.jsx'

// ⬇️ Importa initSession para “hidratar” Cognito al arrancar
import { isSessionValid, getRole, signOut, initSession } from './pages/auth/cognito'

// Destino por rol
function targetByRole(role) {
  if (role === 'admin')  return '/admin/users'
  if (role === 'doctor') return '/doctor'
  return '/app'
}

// Espera a que Cognito resuelva sesión/refresh antes de decidir
function useAuthReady() {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => { initSession().finally(() => setReady(true)) }, [])
  return ready
}

// Públicas de auth (permiten ?force=1 para abrir aunque haya sesión)
function PublicAuth({ children }) {
  const ready = useAuthReady()
  if (!ready) return null
  const { search } = useLocation()
  const q = new URLSearchParams(search)
  const force = q.has('force') || q.has('guest')
  if (!force && isSessionValid()) {
    return <Navigate to={targetByRole(getRole())} replace />
  }
  return children
}

// Protegidas + rol
function RoleRoute({ role, children }) {
  const ready = useAuthReady()
  if (!ready) return null
  if (!isSessionValid()) return <Navigate to="/login" replace />
  const r = getRole()
  if (role && r !== role) return <Navigate to={targetByRole(r)} replace />
  return children
}

// /logout
function Logout() {
  React.useEffect(() => { signOut() }, [])
  return <Navigate to="/login" replace />
}

export default function App() {
  const location = useLocation()
  const currentUserId = 123
  const isLegalPage =
    location.pathname === '/terms' ||
    location.pathname === '/privacy'
  const [termsAccepted, setTermsAccepted] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('hematec.termsAccepted') === 'yes'
  })

  React.useEffect(() => {
    if (termsAccepted && typeof window !== 'undefined') {
      window.localStorage.setItem('hematec.termsAccepted', 'yes')
    }
  }, [termsAccepted])

  function handleAcceptTerms() {
    setTermsAccepted(true)
  }

  function handleMainClick() {
    window.dispatchEvent(new Event('hematec:closeHeaderMenus'))
  }
  return (
    <div className="layout">
      <NotificationProvider currentUserId={currentUserId}>
        <Header />
        <main className="container" onClick={handleMainClick}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route path="/terms"    element={<Terms />} />
            <Route path="/privacy"    element={<Privacy />} />

            {/* Auth públicas */}
            <Route path="/login"    element={<PublicAuth><Login /></PublicAuth>} />
            <Route path="/register" element={<PublicAuth><Register /></PublicAuth>} />
            <Route path="/forgot"   element={<PublicAuth><ForgotPassword /></PublicAuth>} />
            <Route path="/reset"    element={<PublicAuth><ResetPassword /></PublicAuth>} />

            {/* logout */}
            <Route path="/logout" element={<Logout />} />

            {/* Paciente */}
            <Route
              path="/app"
              element={<RoleRoute role="patient"><Dashboard /></RoleRoute>}
            />
            <Route
              path="/app/upload"
              element={<RoleRoute role="patient"><Upload /></RoleRoute>}
            />
            <Route
              path="/app/history"
              element={<RoleRoute role="patient"><History /></RoleRoute>}
            />
            <Route
              path="/app/notifications"
              element={<RoleRoute role="patient"><Notifications /></RoleRoute>}
            />
            <Route
              path="/app/specialists"
              element={<RoleRoute role="patient"><Specialists /></RoleRoute>}
            />
            <Route
              path="/app/results"
              element={<RoleRoute role="patient"><PrediagResults /></RoleRoute>}
            />
            <Route
              path="/app/charts"
              element={<RoleRoute role="patient"><PrediagCharts /></RoleRoute>}
            />
            <Route
              path="/app/recommendations"
              element={<RoleRoute role="patient"><Recommendations /></RoleRoute>}
            />
            <Route
              path="/app/manual"
              element={<RoleRoute role="patient"><ManualEntry /></RoleRoute>}
            />

            {/* Doctor */}
            <Route
              path="/doctor"
              element={<RoleRoute role="doctor"><DoctorDashboard /></RoleRoute>}
            />
            <Route
              path="/doctor/edit-recommendations"
              element={<RoleRoute role="doctor"><EditRecommendations /></RoleRoute>}
            />
            {/* NUEVA ruta: ver prediagnóstico específico del doctor */}
            <Route
              path="/doctor/prediag/:key"
              element={<RoleRoute role="doctor"><DoctorPrediagResults /></RoleRoute>}
            />

            {/* Admin */}
            <Route
              path="/admin/users"
              element={<RoleRoute role="admin"><Users /></RoleRoute>}
            />
            <Route
              path="/admin/new-specialist"
              element={<RoleRoute role="admin"><NewSpecialist /></RoleRoute>}
            />
            <Route
              path="/admin/edit-specialist"
              element={<RoleRoute role="admin"><EditSpecialist /></RoleRoute>}
            />
            <Route
              path="/admin/patient-profile"
              element={<RoleRoute role="admin"><PatientProfile /></RoleRoute>}
            />
            <Route
              path="/admin/specialist-profile"
              element={<RoleRoute role="admin"><SpecialistProfile /></RoleRoute>}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="card">
                  <h2>404</h2>
                  <p>Página no encontrada.</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Popup
          isVisible={!termsAccepted && !isLegalPage}
          closable={false}
          onClose={() => {}}
          width="36rem"
          type="info"
          icon={faFileSignature}
          tittle="Términos y Condiciones"
          message="terms_required"
          showButton
          buttonProps={{
            typeButton: 'button-primary',
            onClick: handleAcceptTerms,
            content: 'Acepto los términos y condiciones de uso y el aviso de privacidad'
          }}
          extraButton
          extraButtonProps={{
            typeButton: 'button-secondary',
            borderRadius: '8px',
            onClick: () => { window.location.href = '/terms' },
            content: 'Consultar términos y condiciones de uso'
          }}
        />
      </NotificationProvider>
    </div>
  )
}
