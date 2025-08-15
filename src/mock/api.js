// Mock de "servicios" sin backend: usa localStorage con roles
const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// Cuentas demo (solo front, SIN backend):
// - Admin  → usuario: admin   · contraseña: admin12
// - Doctor → usuario: doctor  · contraseña: doctor12
const HARD_USERS = [
  { email: 'admin',  password: 'admin12',  role: 'admin',  nombre: 'Administrador' },
  { email: 'doctor', password: 'doctor12', role: 'doctor', nombre: 'Médico Especialista' },
]

export async function login({ email, password }) {
  await wait()
  const users = JSON.parse(localStorage.getItem('users') || '[]') // registrados (pacientes)
  const all = [...HARD_USERS, ...users]
  const user = all.find((u) => u.email === email)
  if (!user) throw new Error('Usuario no registrado')
  if (user.password !== password) throw new Error('Contraseña incorrecta')

  const session = {
    email: user.email,
    role: user.role || 'patient',
    nombre: user.nombre || 'Usuario',
  }
  localStorage.setItem('session', JSON.stringify(session))
  return { ok: true, session }
}

export async function register(payload) {
  await wait()
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.some((u) => u.email === payload.email)) throw new Error('Usuario ya registrado')
  users.push({ ...payload, role: 'patient' })
  localStorage.setItem('users', JSON.stringify(users))
  return { ok: true }
}

export async function logout() {
  localStorage.removeItem('session')
}

export function getSession() {
  return JSON.parse(localStorage.getItem('session') || 'null')
}

export async function uploadPdf(name = 'Nombre_archivo.pdf') {
  await wait(1000)
  const history = JSON.parse(localStorage.getItem('history') || '[]')
  history.unshift({
    fecha: '04/05/2025',
    estado: 'ESTADO CRÍTICO',
    examen: 'Biometría Hemática',
    archivo: name,
  })
  localStorage.setItem('history', JSON.stringify(history))
  return { ok: true }
}

export function getHistory() {
  return JSON.parse(localStorage.getItem('history') || '[]')
}

export async function saveRecommendations(text) {
  await wait()
  localStorage.setItem('recs', text)
  return { ok: true }
}
export function getRecommendations() {
  return localStorage.getItem('recs') || ''
}
