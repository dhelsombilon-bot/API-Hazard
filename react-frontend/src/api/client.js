import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/api$/, '/api/v1') || 'http://127.0.0.1:8000/api/v1'

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('geopermit_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => {
    // Unwrap ApiResponse envelope { success, data, message } so res.data is always the payload
    if (res.data && typeof res.data === 'object' && 'success' in res.data) {
      res.data = res.data.data
    }
    return res
  },
  (err) => {
    // Only force-redirect to login for expired sessions, not for a failed login attempt itself
    if (err.response?.status === 401 && !err.config?.url?.includes('auth/login')) {
      localStorage.removeItem('geopermit_token')
      localStorage.removeItem('geopermit_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default client
