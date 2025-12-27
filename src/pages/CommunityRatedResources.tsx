import { useMemo, useState } from 'react'

type Item = {
  id: string
  topic: string
  type: 'video' | 'article' | 'tool'
  score: number
  desc: string
}

const data: Item[] = [
  { id: 'c1', topic: 'React Basics', type: 'video', score: 92, desc: 'Beginner‑friendly series explaining components and hooks.' },
  { id: 'c2', topic: 'CSS Flexbox', type: 'article', score: 88, desc: 'Visual guide to layout patterns.' },
  { id: 'c3', topic: 'DevTools', type: 'tool', score: 80, desc: 'Inspect and debug web apps quickly.' },
  { id: 'c4', topic: 'Async/Await', type: 'video', score: 75, desc: 'Modern async patterns explained.' },
]

const CommunityRatedResources = () => {
  const [filter, setFilter] = useState<'all' | 'most' | 'beginner'>('all')
  const list = useMemo(() => {
    let x = data
    if (filter === 'most') x = [...x].sort((a, b) => b.score - a.score)
    if (filter === 'beginner') x = x.filter(i => i.score >= 80)
    return x
  }, [filter])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community‑Rated Resources</h1>
        <p className="text-gray-600 dark:text-gray-300">Categorized cards with simple helpfulness ratings.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Filter:</span>
        <select className="input-field w-auto" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="most">Most Helpful</option>
          <option value="beginner">Beginner Friendly</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(item => (
          <div key={item.id} className="card">
            <div className="text-lg font-semibold">{item.topic}</div>
            <div className="text-xs text-gray-600">Type: {item.type}</div>
            <div className="mt-2 text-sm text-gray-700">{item.desc}</div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-primary-600" style={{ width: `${item.score}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">Helpfulness {item.score}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunityRatedResources

