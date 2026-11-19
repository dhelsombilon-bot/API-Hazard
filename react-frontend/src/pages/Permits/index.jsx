import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Eye, ClipboardCheck, AlertCircle, FileX, FileCheck, ChevronDown, FileText } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import { Table, Skeleton } from '../../components/ui/Table'
import { StatusBadge } from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import { permitService } from '../../services/permits'
import { lookupService } from '../../services/lookups'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'

export default function PermitsPage() {
  const { canEdit } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch]   = useState(searchParams.get('search') || '')
  const status      = searchParams.get('permit_status') || ''
  const buildingId  = searchParams.get('building_id')   || ''
  const page        = Number(searchParams.get('page')   || 1)

  const setParam = (key, val) => setSearchParams(prev => {
    const p = new URLSearchParams(prev)
    if (val) p.set(key, val); else p.delete(key)
    p.set('page', '1')
    return p
  })
  const setPage = (p) => setSearchParams(prev => {
    const q = new URLSearchParams(prev); q.set('page', String(p)); return q
  })

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['permits', { search, status, buildingId, page }],
    placeholderData: keepPreviousData,
    queryFn: () => permitService.list({ search, permit_status: status, building_id: buildingId, page }),
  })
  const { data: lookups }    = useQuery({ queryKey: ['lookups'], queryFn: lookupService.all })
  const { data: allPermits, isLoading: statsLoading } = useQuery({
    queryKey: ['permits', { page: 1 }],
    queryFn: () => permitService.list({ page: 1 }),
  })

  const all       = allPermits?.data || []
  const compliant = all.filter(p => p.permit_status === 'Compliant').length
  const forReview = all.filter(p => ['For review','For Review','Needs review','Needs Review'].includes(p.permit_status)).length
  const incomplete= all.filter(p => p.permit_status === 'Incomplete').length
  const noRecord  = all.filter(p => ['No permit record','No Permit Record'].includes(p.permit_status)).length
  const total     = data?.meta?.total ?? null

  const columns = [
    {
      key: 'permit_number',
      label: 'Permit No. / Building',
      render: r => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-indigo-600" />
          </div>
          <div>
            <Link to={`/permits/${r.permit_id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              {r.permit_number}
            </Link>
            <div className="text-xs text-gray-500 mt-0.5">{r.building_name}</div>
          </div>
        </div>
      ),
    },
    { key: 'permit_type',   label: 'Type',       render: r => <span className="text-sm text-gray-600">{r.permit_type || '—'}</span> },
    { key: 'permit_status', label: 'Status',      render: r => <StatusBadge status={r.permit_status} /> },
    { key: 'issue_date',    label: 'Issue Date',  render: r => <span className="text-sm text-gray-600">{formatDate(r.issue_date)}</span> },
    { key: 'expiry_date',   label: 'Expiry Date', render: r => <span className="text-sm text-gray-600">{formatDate(r.expiry_date)}</span> },
    {
      key: 'actions', label: '',
      render: r => (
        <Link to={`/permits/${r.permit_id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
          <Eye size={14} />
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Gradient stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard loading={statsLoading} title="Compliant"        value={compliant}  subtitle="Up to date"        icon={FileCheck}      color="emerald" />
        <StatCard loading={statsLoading} title="For Review"       value={forReview}  subtitle="Needs attention"   icon={ClipboardCheck} color="amber"   />
        <StatCard loading={statsLoading} title="Incomplete"       value={incomplete} subtitle="Missing documents" icon={FileX}          color="red"     />
        <StatCard loading={statsLoading} title="No Permit Record" value={noRecord}   subtitle="Not on file"       icon={AlertCircle}    color="blue"    />
      </div>

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100" style={{ background: 'linear-gradient(to right,#F8FAFC,#ffffff)' }}>
          <FileText size={15} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-[#263746]">Permit Records</h2>
          {total !== null && (
            <span className="ml-auto text-xs font-semibold text-gray-400">{total} record{total !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Filters */}
        <div className="px-5 py-3.5 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search permit number or building…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setParam('search', search)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={e => setParam('permit_status', e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white appearance-none"
            >
              <option value="">All statuses</option>
              {lookups?.permit_statuses?.map(s => (
                <option key={s.permit_status_id} value={s.status_name}>{s.status_name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {canEdit && (
            <Link
              to="/permits/new"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg,#123B5D,#1976A5)', boxShadow: '0 3px 10px rgba(18,59,93,0.4)' }}
            >
              <Plus size={15} /> Add Permit
            </Link>
          )}
        </div>

        <div className="p-5">
          {isLoading ? <Skeleton rows={8} cols={6} /> : (
            <div className={`transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={isPlaceholderData}>
              <Table columns={columns} data={data?.data} emptyMessage="No permit records found." />
            </div>
          )}
          <Pagination meta={data?.meta} onPage={setPage} />
        </div>
      </div>
    </div>
  )
}
