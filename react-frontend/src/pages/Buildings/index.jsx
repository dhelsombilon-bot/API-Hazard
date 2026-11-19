import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Eye, Pencil, Building2, ChevronDown, MapPin } from 'lucide-react'
import { Table, Skeleton } from '../../components/ui/Table'
import { StatusBadge } from '../../components/ui/Badge'
import Pagination from '../../components/ui/Pagination'
import { buildingService } from '../../services/buildings'
import { lookupService } from '../../services/lookups'
import { useAuth } from '../../context/AuthContext'

export default function BuildingsPage() {
  const { canEdit } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const barangayId = searchParams.get('barangay_id') || ''
  const typeId     = searchParams.get('building_type_id') || ''
  const page       = Number(searchParams.get('page') || 1)

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
    queryKey: ['buildings', { search, barangayId, typeId, page }],
    placeholderData: keepPreviousData,
    queryFn: () => buildingService.list({ search, barangay_id: barangayId, building_type_id: typeId, page }),
  })
  const { data: lookups } = useQuery({ queryKey: ['lookups'], queryFn: lookupService.all })

  const total = data?.meta?.total ?? null

  const columns = [
    {
      key: 'building_code',
      label: 'Building',
      render: r => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-blue-600" />
          </div>
          <div>
            <Link to={`/buildings/${r.building_id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              {r.building_name}
            </Link>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{r.building_code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'barangay_name',
      label: 'Barangay',
      render: r => (
        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
          <MapPin size={11} className="text-gray-400" /> {r.barangay_name}
        </span>
      ),
    },
    { key: 'building_type', label: 'Type', render: r => <span className="text-sm text-gray-600">{r.building_type || '—'}</span> },
    {
      key: 'coords',
      label: 'Coordinates',
      render: r => r.latitude
        ? <span className="text-xs text-gray-500 font-mono">{Number(r.latitude).toFixed(4)}, {Number(r.longitude).toFixed(4)}</span>
        : <span className="text-gray-300">—</span>,
    },
    { key: 'building_status', label: 'Status', render: r => <StatusBadge status={r.building_status} /> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex items-center gap-1">
          <Link to={`/buildings/${r.building_id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
            <Eye size={14} />
          </Link>
          {canEdit && (
            <Link to={`/buildings/${r.building_id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
              <Pencil size={14} />
            </Link>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Hero stat banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg,#123B5D 0%,#1976A5 100%)' }}>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1976A5,#145C82)', boxShadow: '0 8px 20px rgba(25,118,165,0.4)' }}>
              <Building2 size={26} className="text-white" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white leading-none">
                {total !== null ? total : '—'}
              </div>
              <div className="text-sm font-semibold text-blue-200 mt-1">Total Public Buildings</div>
              <div className="text-xs text-blue-300/70 mt-0.5">Municipality-wide · Records grouped by barangay</div>
            </div>
          </div>
          {canEdit && (
            <Link
              to="/buildings/new"
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97] flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1976A5,#145C82)', boxShadow: '0 4px 14px rgba(25,118,165,0.45)' }}
            >
              <Plus size={16} /> Add Building
            </Link>
          )}
        </div>
      </div>

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100" style={{ background: 'linear-gradient(to right,#F8FAFC,#ffffff)' }}>
          <Building2 size={15} className="text-blue-600" />
          <h2 className="text-sm font-bold text-[#263746]">Building Records</h2>
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
              placeholder="Search building name or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setParam('search', search)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
          </div>
          <div className="relative">
            <select
              value={barangayId}
              onChange={e => setParam('barangay_id', e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white appearance-none"
            >
              <option value="">All barangays</option>
              {lookups?.barangays?.map(b => <option key={b.barangay_id} value={b.barangay_id}>{b.barangay_name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={typeId}
              onChange={e => setParam('building_type_id', e.target.value)}
              className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white appearance-none"
            >
              <option value="">All types</option>
              {lookups?.building_types?.map(t => <option key={t.building_type_id} value={t.building_type_id}>{t.type_name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="p-5">
          {isLoading ? <Skeleton rows={8} cols={6} /> : (
            <div className={`transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={isPlaceholderData}>
              <Table columns={columns} data={data?.data} emptyMessage="No buildings found matching your filters." />
            </div>
          )}
          <Pagination meta={data?.meta} onPage={setPage} />
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            Only public buildings owned or managed by the government are included.
          </p>
        </div>
      </div>
    </div>
  )
}
