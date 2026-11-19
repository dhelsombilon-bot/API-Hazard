import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Building2, FileText, AlertCircle, TriangleAlert, ArrowRight, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { Table, Skeleton as TableSkeleton } from '../../components/ui/Table'
import { Skeleton, SkeletonGroup, BarsSkeleton } from '../../components/ui/Skeleton'
import { StatusBadge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'
import { buildingService } from '../../services/buildings'
import { permitService } from '../../services/permits'
import BaseMap from '../../components/map/BaseMap'
import BuildingMarker from '../../components/map/BuildingMarker'

const COMPLIANCE_ITEMS = [
  { key: 'compliant',  label: 'Compliant',  color: '#2C9C85', bg: '#D0F5EF' },
  { key: 'forReview',  label: 'For Review',  color: '#D97706', bg: '#FEF9C3' },
  { key: 'incomplete', label: 'Incomplete',  color: '#DC2626', bg: '#FEE2E2' },
  { key: 'noRecord',   label: 'No Record',   color: '#94A3B8', bg: '#F1F5F9' },
]

function ComplianceBar({ label, count, total, color, bg }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className="text-xs font-bold text-gray-700">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { data: buildings, isLoading: buildingsLoading } = useQuery({
    queryKey: ['buildings', { page: 1 }],
    queryFn: () => buildingService.list({ page: 1 }),
  })

  const { data: permits, isLoading: permitsLoading } = useQuery({
    queryKey: ['permits', { page: 1 }],
    queryFn: () => permitService.list({ page: 1 }),
  })

  const { data: geojson, isLoading: geojsonLoading } = useQuery({
    queryKey: ['buildings-geojson'],
    queryFn: () => buildingService.geojson(),
  })

  const totalBuildings = buildings?.meta?.total || 0
  const totalPermits   = permits?.meta?.total   || 0
  const allPermits     = permits?.data           || []

  const compliant  = allPermits.filter(p => p.permit_status === 'Compliant').length
  const forReview  = allPermits.filter(p => ['For review','For Review','Needs review','Needs Review'].includes(p.permit_status)).length
  const incomplete = allPermits.filter(p => p.permit_status === 'Incomplete').length
  const noRecord   = allPermits.filter(p => ['No permit record','No Permit Record'].includes(p.permit_status)).length
  const highHazard = (buildings?.data || []).filter(b => b.risk_level === 'High').length

  const counts = { compliant, forReview, incomplete, noRecord }
  const recentBuildings = (buildings?.data || []).slice(0, 5)

  const tableColumns = [
    {
      key: 'building_name',
      label: 'Building',
      render: r => (
        <Link to={`/buildings/${r.building_id}`} className="text-blue-600 hover:underline font-medium">
          {r.building_name}
        </Link>
      ),
    },
    { key: 'barangay_name', label: 'Barangay' },
    { key: 'building_status', label: 'Status', render: r => <StatusBadge status={r.building_status} /> },
    { key: 'updated_at', label: 'Last Updated', render: r => formatDate(r.updated_at) },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard loading={buildingsLoading} title="Public Buildings"       value={totalBuildings} subtitle="Recorded across barangays"  icon={Building2}    color="blue"    />
        <StatCard loading={permitsLoading}   title="Permit Records"         value={totalPermits}   subtitle="Existing records on file"   icon={FileText}     color="emerald" />
        <StatCard loading={permitsLoading}   title="For Compliance Review"  value={forReview}      subtitle="Needs staff attention"      icon={AlertCircle}  color="amber"   />
        <StatCard loading={buildingsLoading} title="High Hazard Exposure"   value={highHazard}     subtitle="Based on available data"    icon={TriangleAlert} color="red"    />
      </div>

      {/* Map + compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card
          title="Public Building Locations"
          className="lg:col-span-2"
          actions={
            <Link to="/map" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View full map <ArrowRight size={12} />
            </Link>
          }
        >
          <div style={{ height: 300, borderRadius: 12, overflow: 'hidden' }}>
            {geojsonLoading ? (
              <SkeletonGroup label="Loading map…" className="h-full">
                <Skeleton className="h-full w-full rounded-xl" />
              </SkeletonGroup>
            ) : (
              <BaseMap zoom={11}>
                {geojson?.features?.map((f, i) => (
                  <BuildingMarker key={i} building={f} />
                ))}
              </BaseMap>
            )}
          </div>
        </Card>

        <Card
          title="Permit Compliance"
          actions={
            <span className="text-xs font-semibold text-gray-400">{totalPermits} total</span>
          }
        >
          {permitsLoading ? <BarsSkeleton rows={4} /> : (
            <div className="space-y-5">
              {COMPLIANCE_ITEMS.map(item => (
                <ComplianceBar
                  key={item.key}
                  label={item.label}
                  count={counts[item.key]}
                  total={totalPermits}
                  color={item.color}
                  bg={item.bg}
                />
              ))}
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link to="/permits" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              <TrendingUp size={12} /> View all permits <ArrowRight size={12} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Recently updated */}
      <Card
        title="Recently Updated Buildings"
        actions={
          <Link to="/buildings" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
            View all <ArrowRight size={12} />
          </Link>
        }
      >
        {buildingsLoading ? <TableSkeleton rows={5} cols={4} /> : (
          <Table columns={tableColumns} data={recentBuildings} emptyMessage="No buildings found." />
        )}
      </Card>
    </div>
  )
}
