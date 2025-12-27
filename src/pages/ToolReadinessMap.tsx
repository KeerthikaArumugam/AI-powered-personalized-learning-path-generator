import { useMemo, useState } from 'react'

type ToolItem = {
  skill: string
  tool: string
  status: 'Learning' | 'Basic' | 'Proficient'
}

const ToolReadinessMap = () => {
  const base: ToolItem[] = [
    { skill: 'Frontend', tool: 'React', status: 'Basic' },
    { skill: 'Styles', tool: 'Tailwind', status: 'Learning' },
    { skill: 'Build', tool: 'Vite', status: 'Basic' },
    { skill: 'Data', tool: 'Firebase', status: 'Learning' },
  ]
  const [items, setItems] = useState(base)
  const statuses: ToolItem['status'][] = ['Learning', 'Basic', 'Proficient']
  const color = (s: ToolItem['status']) => s === 'Proficient' ? 'bg-green-100 text-green-800 border-green-200' : s === 'Basic' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'
  const grid = useMemo(() => items, [items])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tool Readiness Map</h1>
        <p className="text-gray-600 dark:text-gray-300">Map skills to tools with readiness status.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grid.map((it, i) => (
          <div key={`${it.tool}-${i}`} className="card">
            <div className="text-lg font-semibold">{it.tool}</div>
            <div className="text-sm text-gray-600">Skill: {it.skill}</div>
            <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color(it.status)}`}>{it.status}</div>
            <div className="mt-3">
              <select
                className="input-field w-auto"
                value={it.status}
                onChange={(e) => setItems(prev => prev.map((p, idx) => idx === i ? { ...p, status: e.target.value as ToolItem['status'] } : p))}
              >
                {statuses.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToolReadinessMap
