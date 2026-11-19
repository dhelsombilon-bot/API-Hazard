import { RISK_COLORS } from '../../utils/riskColors'

const LEVELS = ['High', 'Moderate-to-High', 'Moderate', 'Low']

export default function RiskLegend({ title = 'Risk Classification' }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="px-3 py-2" style={{ background: 'linear-gradient(135deg,#123B5D,#1976A5)' }}>
        <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{title}</div>
      </div>
      <div className="bg-white px-3 py-2.5 space-y-1.5">
        {LEVELS.map(level => {
          const c = RISK_COLORS[level]
          return (
            <div key={level} className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: c?.hex }} />
              <span className="text-xs font-medium text-gray-700">{level}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
