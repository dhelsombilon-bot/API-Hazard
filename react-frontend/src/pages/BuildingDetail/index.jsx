import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pencil, MapPin, FileText, TriangleAlert, TreePine, Activity, Building2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { StatusBadge, RiskBadge } from '../../components/ui/Badge'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { buildingService } from '../../services/buildings'
import { useAuth } from '../../context/AuthContext'
import BaseMap from '../../components/map/BaseMap'
import BuildingMarker from '../../components/map/BuildingMarker'

const TABS = [
  { key: 'details', label: 'Details', icon: FileText },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'permits', label: 'Permits', icon: FileText },
  { key: 'hazard', label: 'Hazard Exposure', icon: TriangleAlert },
  { key: 'landscape', label: 'Landscape', icon: TreePine },
  { key: 'activity', label: 'Activity', icon: Activity },
]

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</dt>
      <dd className="text-sm text-gray-800">{value || <span className="text-gray-300">—</span>}</dd>
    </div>
  )
}

function TabBar({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 overflow-x-auto">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl font-medium whitespace-nowrap transition-all ${
            active === key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function BuildingDetailPage() {
  const { id } = useParams()
  const { canEdit } = useAuth()
  const [tab, setTab] = useState('details')

  const { data: building, isLoading } = useQuery({
    queryKey: ['building', id],
    queryFn: () => buildingService.get(id),
  })

  if (isLoading) return <DetailSkeleton tabs={6} fields={12} action={canEdit} />
  if (!building) return <div className="text-center py-16 text-gray-400">Building not found.</div>

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building2 size={22} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{building.building_code}</div>
              <h2 className="text-lg font-bold text-[#0F172A]">{building.building_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <StatusBadge status={building.building_status} />
                {building.building_type && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{building.building_type}</span>}
                {building.barangay_name && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} />{building.barangay_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          {canEdit && (
            <Link to={`/buildings/${id}/edit`}>
              <Button variant="secondary" size="sm"><Pencil size={14} /> Edit</Button>
            </Link>
          )}
        </div>
      </Card>

      <TabBar tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'details' && (
        <Card title="Building Information">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Building Code" value={building.building_code} />
            <Field label="Building Name" value={building.building_name} />
            <Field label="Type" value={building.building_type} />
            <Field label="Status" value={<StatusBadge status={building.building_status} />} />
            <Field label="Barangay" value={building.barangay_name} />
            <Field label="Street Address" value={building.street_address} />
            <Field label="Managing Office" value={building.managing_office} />
            <Field label="Year Built" value={building.year_built} />
            <Field label="Risk Level" value={building.risk_level ? <RiskBadge level={building.risk_level} /> : null} />
            <Field label="Description" value={building.description} />
            <Field label="Created At" value={formatDateTime(building.created_at)} />
            <Field label="Last Updated" value={formatDateTime(building.updated_at)} />
          </dl>
        </Card>
      )}

      {tab === 'location' && (
        <Card title="Location & Coordinates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ height: 300, borderRadius: 12, overflow: 'hidden' }}>
              {building.latitude ? (
                <BaseMap center={[building.latitude, building.longitude]} zoom={15}>
                  <BuildingMarker building={building} />
                </BaseMap>
              ) : (
                <div className="h-full bg-gray-50 rounded-xl flex items-center justify-center text-sm text-gray-400">
                  No coordinates recorded
                </div>
              )}
            </div>
            <dl className="space-y-4">
              <Field label="Latitude" value={building.latitude} />
              <Field label="Longitude" value={building.longitude} />
              <Field label="Elevation (m)" value={building.elevation_m} />
              <Field label="Coordinate Source" value={building.coordinate_source} />
              <Field label="Verified At" value={formatDateTime(building.verified_at)} />
            </dl>
          </div>
        </Card>
      )}

      {tab === 'permits' && (
        <Card title="Linked Permits">
          {building.permits?.length ? (
            <div className="space-y-2">
              {building.permits.map(p => (
                <div key={p.permit_id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <Link to={`/permits/${p.permit_id}`} className="text-sm font-semibold text-blue-600 hover:underline">{p.permit_number}</Link>
                    <div className="text-xs text-gray-500 mt-0.5">{p.permit_type} · Issued {formatDate(p.issue_date)}</div>
                  </div>
                  <StatusBadge status={p.permit_status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No permit records linked to this building.</p>
            </div>
          )}
        </Card>
      )}

      {tab === 'hazard' && (
        <Card title="Hazard Exposure Assessment">
          <p className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            Based on available mapped data from PAGASA and MGB. This is not a structural safety assessment.
          </p>
          {building.hazard_assessments?.length ? (
            <div className="space-y-3">
              {building.hazard_assessments.map(h => (
                <div key={h.hazard_assessment_id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{h.hazard_type}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{h.dataset_name}{h.assessment_date ? ` · ${formatDate(h.assessment_date)}` : ''}</div>
                    {h.assessment_notes && <div className="text-xs text-gray-400 mt-0.5 italic">{h.assessment_notes}</div>}
                  </div>
                  <RiskBadge level={h.hazard_level} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TriangleAlert size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No hazard assessment data available for this building.</p>
            </div>
          )}
        </Card>
      )}

      {tab === 'landscape' && (
        <Card title="Landscape Features">
          {building.landscape_features?.length ? (
            <div className="space-y-3">
              {building.landscape_features.map(l => (
                <div key={l.assessment_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{l.feature_name}</div>
                    <div className="text-xs text-gray-500">{l.feature_type}</div>
                    {l.assessment_notes && <div className="text-xs text-gray-400 mt-0.5">{l.assessment_notes}</div>}
                  </div>
                  {l.distance_m != null && (
                    <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">{l.distance_m} m</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TreePine size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No landscape features recorded for this building.</p>
            </div>
          )}
        </Card>
      )}

      {tab === 'activity' && (
        <Card title="Activity Log">
          {building.activity_logs?.length ? (
            <div className="space-y-3">
              {building.activity_logs.map(log => (
                <div key={log.log_id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-800">{log.user_name || 'System'}</span>
                    <span className="text-gray-500"> — {log.action}</span>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(log.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No activity log entries found.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
