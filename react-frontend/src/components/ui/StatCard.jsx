import { StatCardSkeleton } from './Skeleton'

const GRADIENTS = {
  blue:    'linear-gradient(135deg, #123B5D 0%, #1976A5 100%)',
  emerald: 'linear-gradient(135deg, #2C9C85 0%, #1D8A74 100%)',
  amber:   'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
  red:     'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
}

const SHADOWS = {
  blue:    '0 8px 24px rgba(18,59,93,0.35)',
  emerald: '0 8px 24px rgba(44,156,133,0.35)',
  amber:   '0 8px 24px rgba(217,119,6,0.35)',
  red:     '0 8px 24px rgba(220,38,38,0.35)',
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', loading = false }) {
  if (loading) return <StatCardSkeleton />
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{ background: GRADIENTS[color] || GRADIENTS.blue, boxShadow: SHADOWS[color] || SHADOWS.blue }}
    >
      {/* large ghost icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.12] pointer-events-none">
        <Icon size={96} strokeWidth={1.5} />
      </div>
      <div className="relative">
        <div className="text-[2.5rem] font-extrabold leading-none tracking-tight">{value}</div>
        <div className="text-sm font-semibold mt-2 leading-snug">{title}</div>
        {subtitle && <div className="text-xs mt-0.5 opacity-70 leading-tight">{subtitle}</div>}
      </div>
    </div>
  )
}
