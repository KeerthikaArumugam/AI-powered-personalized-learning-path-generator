import { useMemo, useState } from 'react'

type VersionInfo = {
  id: string
  title: string
  updated: string
  changes: string[]
}

const makeVersions = (): VersionInfo[] => {
  return [
    { id: 'v-current', title: 'Current Version', updated: new Date().toISOString().slice(0, 10), changes: ['Adjusted timeline', 'Added resources', 'Updated assessments'] },
    { id: 'v-1', title: 'Previous Version', updated: '2025-10-12', changes: ['Initial phases', 'Base resources'] },
    { id: 'v-2', title: 'Alternate Update', updated: '2025-11-20', changes: ['Reordered phases', 'Focus on hands‑on'] },
  ]
}

const VersionSwitcher = () => {
  const versions = useMemo(() => makeVersions(), [])
  const [selected, setSelected] = useState<string>('v-current')

  const current = versions.find(v => v.id === 'v-current')
  const other = versions.find(v => v.id === selected)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Path Version Switcher</h1>
        <p className="text-gray-600 dark:text-gray-300">View versions and compare differences.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {versions.map(v => (
          <div key={v.id} className={`card border-2 ${selected === v.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
            <div className="text-lg font-semibold">{v.title}</div>
            <div className="text-sm text-gray-600">Updated: {v.updated}</div>
            <div className="mt-2 space-y-1">
              {v.changes.map((c, i) => (<div key={i} className="text-xs text-gray-700">• {c}</div>))}
            </div>
            <div className="mt-3">
              <button className="btn-secondary" onClick={() => setSelected(v.id)}>Compare</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="text-lg font-semibold mb-2">Comparison</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <div className="font-medium">Current</div>
            <div className="text-sm text-gray-600">{current?.updated}</div>
            <ul className="list-disc pl-5 text-xs text-gray-700 mt-1">
              {current?.changes.map((c, i) => (<li key={i}>{c}</li>))}
            </ul>
          </div>
          <div className="border rounded-lg p-3">
            <div className="font-medium">Selected</div>
            <div className="text-sm text-gray-600">{other?.updated}</div>
            <ul className="list-disc pl-5 text-xs text-gray-700 mt-1">
              {other?.changes.map((c, i) => (<li key={i}>{c}</li>))}
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <button className="btn-primary">Switch to This Version</button>
        </div>
      </div>
    </div>
  )
}

export default VersionSwitcher
