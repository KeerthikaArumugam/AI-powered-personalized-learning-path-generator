import { useMemo } from 'react'

type Group = {
  id: string
  name: string
  topics: string[]
}

const groups: Group[] = [
  { id: 'g1', name: 'Frontend Fundamentals', topics: ['HTML', 'CSS', 'JS Basics'] },
  { id: 'g2', name: 'React & State', topics: ['React', 'Hooks', 'State Management'] },
  { id: 'g3', name: 'Backend APIs', topics: ['Node', 'Express', 'REST'] },
]

const PeerLearningSuggestions = () => {
  const list = useMemo(() => groups, [])
  const shareLink = `${location.origin}/results`

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Peer Learning Suggestions</h1>
        <p className="text-gray-600 dark:text-gray-300">Anonymous clusters and topics to explore together.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map(g => (
          <div className="card" key={g.id}>
            <div className="text-lg font-semibold">{g.name}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.topics.map(t => (
                <span key={t} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{t}</span>
              ))}
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-600">Suggested discussion topics</div>
              <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1 mt-1">
                <li>Share roadblocks and tips</li>
                <li>Review a mini project</li>
                <li>Exchange resource links</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="text-lg font-semibold mb-2">Share your roadmap</div>
        <div className="flex items-center gap-2">
          <input className="input-field flex-1" readOnly value={shareLink} />
          <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(shareLink)}>Copy Link</button>
        </div>
      </div>
    </div>
  )
}

export default PeerLearningSuggestions

