import { useMemo, useState } from 'react'

type Trend = 'Emerging' | 'Stable' | 'Declining'

const JobRoleTrendIndicator = () => {
  const roles = ['Frontend Developer', 'Data Analyst', 'DevOps Engineer', 'Mobile Developer']
  const [role, setRole] = useState(roles[0])
  const trend: Trend = useMemo(() => {
    if (role.includes('Data')) return 'Stable'
    if (role.includes('DevOps')) return 'Emerging'
    return 'Stable'
  }, [role])
  const tools = useMemo(() => {
    if (role.includes('Frontend')) return ['React', 'Vite', 'Tailwind']
    if (role.includes('Data')) return ['Python', 'Pandas', 'SQL']
    if (role.includes('DevOps')) return ['Docker', 'Kubernetes', 'CI/CD']
    return ['React Native', 'Expo', 'Firebase']
  }, [role])
  const bars = trend === 'Emerging' ? 80 : trend === 'Stable' ? 60 : 40

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job‑Role Trend Indicator</h1>
        <p className="text-gray-600 dark:text-gray-300">View trend label, simple graph, and tools.</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Select role:</span>
          <select className="input-field w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">{trend}</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${bars}%` }} />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-medium mb-2">Relevant tools</div>
          <div className="flex flex-wrap gap-2">
            {tools.map(t => (<span key={t} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{t}</span>))}
          </div>
          <div className="text-sm text-gray-600 mt-2">Short insight: Focus on core skills and practical projects.</div>
        </div>
      </div>
    </div>
  )
}

export default JobRoleTrendIndicator

