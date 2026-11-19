import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Eye, EyeOff, X, CheckCircle2, UserPlus, KeyRound,
  Mail, Lock, AlertCircle, ArrowRight,
} from 'lucide-react'
import loginBg from '../../assets/login-bg.jpg'
import { authService } from '../../services/auth'

/* ------------------------------------------------------------------ */
/* Shared modal overlay                                                  */
/* ------------------------------------------------------------------ */
function ModalOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Forgot Password modal                                                 */
/* ------------------------------------------------------------------ */
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      await authService.forgotPassword(email)
      setDone(true)
    } catch (ex) {
      setErr(ex?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <KeyRound size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Forgot Password?</h3>
            <p className="text-xs text-gray-500">We'll notify your administrator.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>

      {done ? (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} className="text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Request Sent</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Your administrator has been notified. Please contact your office directly to follow up on the password reset.
          </p>
          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Enter your registered email address. If the account exists, your system administrator will be notified to reset your password.
          </p>
          {err && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
              <AlertCircle size={13} className="flex-shrink-0" />{err}
            </div>
          )}
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              autoFocus
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending…' : 'Send Reset Request'}
          </button>
        </form>
      )}
    </ModalOverlay>
  )
}

/* ------------------------------------------------------------------ */
/* Create Account modal                                                  */
/* ------------------------------------------------------------------ */
function CreateAccountModal({ onClose }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    password: '', password_confirmation: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    try {
      await authService.register(form)
      setDone(true)
    } catch (ex) {
      const data = ex?.response?.data
      if (data?.errors) {
        setErrors(data.errors)
      } else {
        setErrors({ _global: data?.message || 'Could not create account. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <UserPlus size={18} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Create Account</h3>
            <p className="text-xs text-gray-500">Requires administrator approval.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>

      {done ? (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} className="text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Account Request Submitted</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Your account has been created but is <strong>pending activation</strong>. The system administrator will activate it before you can sign in.
          </p>
          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errors._global && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
              <AlertCircle size={13} className="flex-shrink-0" />{errors._global}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => set('first_name', e.target.value)}
                required
                placeholder="Juan"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.first_name ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.first_name && <p className="text-[10px] text-red-500 mt-0.5">{Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={e => set('last_name', e.target.value)}
                required
                placeholder="Dela Cruz"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.last_name ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.last_name && <p className="text-[10px] text-red-500 mt-0.5">{Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className={`w-full px-3 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password_confirmation}
              onChange={e => set('password_confirmation', e.target.value)}
              required
              placeholder="Re-enter password"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password_confirmation ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.password_confirmation && <p className="text-[10px] text-red-500 mt-0.5">{errors.password_confirmation}</p>}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <AlertCircle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">New accounts are assigned the <strong>MEO Personnel</strong> role and require activation by a System Administrator before you can sign in.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account…' : (<><UserPlus size={15} /> Create Account</>)}
          </button>
        </form>
      )}
    </ModalOverlay>
  )
}

/* ------------------------------------------------------------------ */
/* Login page                                                            */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [modal, setModal] = useState(null) // 'forgot' | 'register' | null
  const passwordRef = useRef(null)

  function triggerShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid username or password.'
      setError(msg)
      setPassword('')
      triggerShake()
      setTimeout(() => passwordRef.current?.focus(), 50)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-start justify-center px-4 pb-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})`, paddingTop: 'max(24px, calc(50vh - 260px))' }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,20,40,0.78), rgba(10,20,40,0.55), rgba(10,20,40,0.88))' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-xl" style={{ background: 'linear-gradient(135deg,#123B5D,#1976A5)' }}>
            G
          </div>
          <h1 className="text-2xl font-bold text-white">GeoPermit</h1>
          <p className="text-xs text-white/75 mt-1 uppercase tracking-widest">Building & Permit Monitoring</p>
          <p className="text-xs text-white/55 mt-0.5">Municipal Engineering Office — Bongabong, Oriental Mindoro</p>
        </div>

        {/* Login card — shake class added on error */}
        <div className={`bg-white rounded-2xl shadow-2xl p-6 ${shaking ? 'shake' : ''}`}>
          <h2 className="text-base font-bold text-[#263746] mb-5">Sign in to your account</h2>

          {/* Error — CSS grid rows trick: collapses to true zero height, no layout shift */}
          <div style={{ display: 'grid', gridTemplateRows: error ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ paddingBottom: '16px' }}>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (error) setError('') }}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50/40' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <button
                  type="button"
                  onClick={() => setModal('forgot')}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={passwordRef}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (error) setError('') }}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-300 bg-red-50/40' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#123B5D,#1976A5)', boxShadow: '0 4px 14px rgba(18,59,93,0.45)' }}
            >
              {loading ? 'Signing in…' : (<>Sign In <ArrowRight size={15} /></>)}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-white">Don't have an account?</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModal('register')}
            className="w-full py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        <p className="text-center mt-5 text-xs text-white/45">
          Demo: admin@geopermit.test · personnel@geopermit.test — password: <strong className="text-white/60">password</strong>
        </p>
      </div>

      {modal === 'forgot' && <ForgotPasswordModal onClose={() => setModal(null)} />}
      {modal === 'register' && <CreateAccountModal onClose={() => setModal(null)} />}
    </div>
  )
}
