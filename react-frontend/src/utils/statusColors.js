const STATUS_STYLES = {
  // Permit statuses
  Compliant:           { bg: '#DCFCE7', text: '#166534' },
  Incomplete:          { bg: '#FEE2E2', text: '#991B1B' },
  Expired:             { bg: '#FEE2E2', text: '#991B1B' },
  Revoked:             { bg: '#FEE2E2', text: '#991B1B' },
  Pending:             { bg: '#FEF9C3', text: '#854D0E' },
  'For Review':        { bg: '#FEF9C3', text: '#854D0E' },
  'For review':        { bg: '#FEF9C3', text: '#854D0E' },
  'Needs Review':      { bg: '#FEF9C3', text: '#854D0E' },
  'Needs review':      { bg: '#FEF9C3', text: '#854D0E' },
  'No permit record':  { bg: '#F1F5F9', text: '#475569' },
  'No Permit Record':  { bg: '#F1F5F9', text: '#475569' },
  // Building statuses
  Verified:            { bg: '#DCFCE7', text: '#166534' },
  Active:              { bg: '#DCFCE7', text: '#166534' },
  'Under Construction':{ bg: '#DBEAFE', text: '#1E40AF' },
  'Under Renovation':  { bg: '#DBEAFE', text: '#1E40AF' },
  Condemned:           { bg: '#FEE2E2', text: '#991B1B' },
  Demolished:          { bg: '#F1F5F9', text: '#475569' },
  'Temporarily Closed':{ bg: '#FEF9C3', text: '#854D0E' },
  // Findings / compliance / general
  Open:     { bg: '#FEE2E2', text: '#991B1B' },
  Resolved: { bg: '#DCFCE7', text: '#166534' },
  Missing:  { bg: '#FEE2E2', text: '#991B1B' },
  Inactive: { bg: '#F1F5F9', text: '#475569' },
  Pass:     { bg: '#DCFCE7', text: '#166534' },
  Fail:     { bg: '#FEE2E2', text: '#991B1B' },
  Verified_doc: { bg: '#DCFCE7', text: '#166534' },
}

export function statusStyle(status) {
  return STATUS_STYLES[status] || { bg: '#F1F5F9', text: '#475569' }
}
