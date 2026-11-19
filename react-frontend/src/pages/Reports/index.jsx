import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, BarChart2, Map, Users, Download, Eye, SlidersHorizontal, ChevronDown, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Table } from '../../components/ui/Table'
import { Skeleton, SkeletonGroup, ChartSkeleton, TableSkeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { reportService } from '../../services/reports'
import { lookupService } from '../../services/lookups'
import { formatDateTime } from '../../utils/formatters'

const REPORT_TYPES = [
  {
    key: 'permit_compliance',
    label: 'Permit Compliance Summary',
    icon: FileText,
    desc: 'Overview of permit statuses across all public buildings.',
    gradient: 'linear-gradient(135deg, #123B5D 0%, #1976A5 100%)',
    shadow: 'rgba(18,59,93,0.25)',
    accent: '#E6F3FA',
    accentBorder: '#B3D9EF',
  },
  {
    key: 'hazard_exposure',
    label: 'Hazard Exposure Report',
    icon: Map,
    desc: 'Buildings grouped by flood and landslide risk levels.',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
    shadow: 'rgba(234,88,12,0.25)',
    accent: '#FFF7ED',
    accentBorder: '#FED7AA',
  },
  {
    key: 'inventory_summary',
    label: 'Building Inventory Summary',
    icon: BarChart2,
    desc: 'Breakdown of public buildings by type and barangay.',
    gradient: 'linear-gradient(135deg, #2C9C85 0%, #1D8A74 100%)',
    shadow: 'rgba(44,156,133,0.25)',
    accent: '#E8F7F5',
    accentBorder: '#A8E5DC',
  },
  {
    key: 'inspection_findings',
    label: 'Inspection Findings Log',
    icon: Users,
    desc: 'Summary of compliance findings and their resolution status.',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    shadow: 'rgba(124,58,237,0.25)',
    accent: '#F5F3FF',
    accentBorder: '#DDD6FE',
  },
]

const COLORS = ['#2563EB', '#16A34A', '#CA8A04', '#DC2626', '#7C3AED', '#0891B2']

function PreviewModal({ open, onClose, report, loading }) {
  if (!open) return null
  const chartData = report?.chart_data || []
  const tableData = report?.table_data || []
  const tableColumns = Object.keys(tableData[0] || {}).map(k => ({
    key: k,
    label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  }))

  return (
    <Modal open title={report?.title || 'Report Preview'} onClose={onClose} size="xl">
      {loading ? (
        <SkeletonGroup label="Loading preview…" className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <Skeleton className="h-2.5 w-20 mb-4" />
            <ChartSkeleton height={220} />
          </div>
          <div>
            <Skeleton className="h-2.5 w-16 mb-3" />
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <TableSkeleton rows={5} cols={4} />
            </div>
          </div>
        </SkeletonGroup>
      ) : (
        <div className="space-y-6">
          {chartData.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {report?.chart_type === 'pie' ? 'Distribution' : 'Summary'}
              </p>
              <ResponsiveContainer width="100%" height={220}>
                {report?.chart_type === 'pie' ? (
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={40} paddingAngle={2}>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                ) : (
                  <BarChart data={chartData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} />
                    <Bar dataKey="value" fill="#1976A5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
          {tableData.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Records</p>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {tableColumns.map(c => (
                        <th key={c.key} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tableData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        {tableColumns.map(c => (
                          <td key={c.key} className="px-4 py-2.5 text-gray-700">{row[c.key] ?? '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button><Download size={14} /> Download Report</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function ReportsPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({ barangay_id: '', date_from: '', date_to: '' })
  const [preview, setPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)

  const { data: reports, isLoading: reportsLoading } = useQuery({ queryKey: ['reports'], queryFn: reportService.list })
  const { data: lookups } = useQuery({ queryKey: ['lookups'], queryFn: lookupService.all })

  const generateMutation = useMutation({
    mutationFn: ({ report_type }) => reportService.generate({ report_type, ...filters }),
    onSuccess: () => { toast({ message: 'Report generated successfully.' }); queryClient.invalidateQueries({ queryKey: ['reports'] }) },
    onError: () => toast({ message: 'Failed to generate report.', type: 'error' }),
  })

  const handlePreview = async (reportType) => {
    setPreview(null); setPreviewLoading(true)
    try {
      const data = await reportService.preview({ report_type: reportType, ...filters })
      setPreview(data)
    } catch {
      toast({ message: 'Failed to load preview.', type: 'error' })
    } finally {
      setPreviewLoading(false) }
  }

  const handleDownload = async (report) => {
    setDownloadingId(report.report_id)
    try { await reportService.download(report) }
    catch { toast({ message: 'Failed to download report.', type: 'error' }) }
    finally { setDownloadingId(null) }
  }

  const historyColumns = [
    { key: 'report_title', label: 'Report Title', render: r => r.report_title || r.report_type?.replace(/_/g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()) },
    { key: 'generated_by', label: 'Generated By' },
    { key: 'generated_at', label: 'Generated At', render: r => formatDateTime(r.generated_at) },
    {
      key: 'actions', label: '',
      render: r => (
        <button
          type="button"
          disabled={downloadingId === r.report_id}
          onClick={() => handleDownload(r)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <Download size={12} /> {downloadingId === r.report_id ? 'Downloading…' : 'Download'}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#123B5D,#1976A5)' }}>
            <SlidersHorizontal size={14} className="text-blue-200" />
          </div>
          <h2 className="text-sm font-bold text-[#263746]">Report Filters</h2>
          <span className="text-xs text-gray-400 ml-1">— applied to all report types below</span>
        </div>
        <div className="px-5 py-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-36">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Barangay</label>
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 appearance-none bg-white"
                value={filters.barangay_id}
                onChange={e => setFilters(f => ({ ...f, barangay_id: e.target.value }))}
              >
                <option value="">All barangays</option>
                {lookups?.barangays?.map(b => <option key={b.barangay_id} value={b.barangay_id}>{b.barangay_name}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Date From</label>
            <input
              type="date"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              value={filters.date_from}
              onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
            />
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Date To</label>
            <input
              type="date"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              value={filters.date_to}
              onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Report type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORT_TYPES.map(rt => {
          const Icon = rt.icon
          return (
            <div
              key={rt.key}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Top accent strip */}
              <div className="h-1" style={{ background: rt.gradient }} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Gradient icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ background: rt.gradient, boxShadow: `0 6px 16px ${rt.shadow}` }}
                  >
                    <Icon size={22} className="text-white" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#263746] leading-snug">{rt.label}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{rt.desc}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handlePreview(rt.key)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors hover:bg-gray-50"
                    style={{ borderColor: rt.accentBorder, color: '#374151', backgroundColor: rt.accent }}
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <button
                    disabled={generateMutation.isPending}
                    onClick={() => generateMutation.mutate({ report_type: rt.key })}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.97]"
                    style={{ background: rt.gradient, boxShadow: `0 3px 10px ${rt.shadow}` }}
                  >
                    <Download size={13} /> Generate
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
            <Clock size={14} className="text-slate-500" />
          </div>
          <h2 className="text-sm font-bold text-[#263746]">Generated Reports History</h2>
        </div>
        <div className="p-5">
          <Table columns={historyColumns} data={reports || []} loading={reportsLoading} emptyMessage="No reports have been generated yet." />
        </div>
      </div>

      <PreviewModal
        open={!!preview || previewLoading}
        onClose={() => { setPreview(null); setPreviewLoading(false) }}
        report={preview}
        loading={previewLoading && !preview}
      />
    </div>
  )
}
