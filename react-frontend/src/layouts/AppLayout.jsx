import { Suspense, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/formatters'
import Modal from '../components/ui/Modal'
import NotificationBell from '../components/NotificationBell'
import {
  LayoutDashboard, Building2, FileText, Map, BarChart2, Users,
  ChevronDown, Menu, X, LogOut, User,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/buildings', label: 'Building Inventory', icon: Building2 },
  { to: '/permits', label: 'Permit Monitoring', icon: FileText },
  { to: '/map', label: 'Hazard Risk Map', icon: Map },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
]

function LogoutModal({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title="Confirm Logout" size="sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
          <LogOut size={18} className="text-red-600" />
        </div>
        <p className="text-sm text-gray-600 pt-2">Are you sure you want to log out of GeoPermit?</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
          {loading ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </Modal>
  )
}

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`
      }
      style={({ isActive }) => ({
        paddingLeft: 10,
        paddingRight: 12,
        backgroundColor: isActive ? 'rgba(25,118,165,0.28)' : undefined,
        borderLeft: `3px solid ${isActive ? '#1976A5' : 'transparent'}`,
      })}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

function Sidebar({ onClose, onLogout }) {
  const { user, isAdmin } = useAuth()

  return (
    <aside className="flex flex-col w-56 h-full" style={{ backgroundColor: '#123B5D' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          G
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-bold text-sm leading-tight">GeoPermit</div>
          <div className="text-[10px] uppercase tracking-widest leading-tight text-blue-400">
            Bongabong, Or. Mindoro
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-2 mb-2">
          Main Menu
        </div>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavItem key={to} to={to} label={label} icon={icon} end={to === '/'} onClick={onClose} />
        ))}

        {isAdmin && (
          <>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-2 mb-2 mt-5">
              Administration
            </div>
            <NavItem to="/users" label="User Management" icon={Users} onClick={onClose} />
          </>
        )}
      </nav>

      {/* User area */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-600 px-2 pb-2">
          Municipal Engineering Office
        </div>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials(`${user?.first_name} ${user?.last_name}`)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.first_name} {user?.last_name}</div>
            <div className="text-blue-400 text-[10px] truncate">{user?.role_name}</div>
          </div>
          <button onClick={onLogout} className="text-slate-500 hover:text-white transition-colors flex-shrink-0" title="Log out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function PageHeader({ onLogout }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const pageInfo = () => {
    const map = {
      '/': { title: 'Overview', desc: 'Summary of public buildings, permit records, and hazard exposure across Bongabong.' },
      '/buildings': { title: 'Building Inventory', desc: 'Public buildings owned or managed by the government, grouped by barangay.' },
      '/permits': { title: 'Permit Monitoring', desc: 'Building permit records on file. GeoPermit monitors records only; it does not issue permits.' },
      '/map': { title: 'Hazard Risk Map', desc: 'Geospatial view of public buildings and natural hazard areas in Bongabong.' },
      '/reports': { title: 'Reports', desc: 'Generate and download inventory, compliance, and hazard exposure reports.' },
      '/users': { title: 'User Management', desc: 'Manage system user accounts and roles.' },
      '/profile': { title: 'My Profile', desc: 'Your account details and password.' },
    }
    const exact = map[location.pathname]
    if (exact) return exact
    if (location.pathname.startsWith('/buildings/') && location.pathname.endsWith('/edit')) return { title: 'Edit Building', desc: '' }
    if (location.pathname.startsWith('/buildings/new')) return { title: 'Add Building', desc: '' }
    if (location.pathname.startsWith('/buildings/')) return { title: 'Building Detail', desc: '' }
    if (location.pathname.startsWith('/permits/') && location.pathname.endsWith('/edit')) return { title: 'Edit Permit', desc: '' }
    if (location.pathname.startsWith('/permits/new')) return { title: 'Add Permit', desc: '' }
    if (location.pathname.startsWith('/permits/')) return { title: 'Permit Detail', desc: '' }
    const parts = location.pathname.split('/').filter(Boolean)
    return { title: parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / '), desc: '' }
  }

  const { title, desc } = pageInfo()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex-shrink-0" style={{ background: 'linear-gradient(to right, #ffffff, #F8FAFC)' }}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#263746] leading-tight">{title}</h1>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <NotificationBell />
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials(`${user?.first_name} ${user?.last_name}`)}
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <div className="text-xs font-medium text-gray-800 leading-tight truncate max-w-24">{user?.first_name}</div>
                <div className="text-[10px] text-gray-500 leading-tight">{user?.role_name}</div>
              </div>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-800">{user?.first_name} {user?.last_name}</div>
                  <div className="text-[10px] text-gray-500">{user?.role_name}</div>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setMenuOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} /> My Profile
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { setMenuOpen(false); onLogout() }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const openLogout = () => {
    setSidebarOpen(false)
    setLogoutOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar onLogout={openLogout} />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} onLogout={openLogout} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 lg:hidden" style={{ backgroundColor: '#123B5D' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="ml-2 font-bold text-white text-sm">GeoPermit</span>
        </div>

        <PageHeader onLogout={openLogout} />

        <main className="flex-1 overflow-y-auto p-6 bg-[#F4F7FA] isolate">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  )
}
