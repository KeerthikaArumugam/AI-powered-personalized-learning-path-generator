import { useMemo, useState } from 'react'

type TopicItem = {
  id: string
  name: string
  difficulty: number
}

const sampleTopics: TopicItem[] = [
  { id: 't1', name: 'HTML Basics', difficulty: 2 },
  { id: 't2', name: 'CSS Flexbox', difficulty: 4 },
  { id: 't3', name: 'JavaScript ES6', difficulty: 6 },
  { id: 't4', name: 'React Components', difficulty: 7 },
  { id: 't5', name: 'Async Data', difficulty: 8 },
  { id: 't6', name: 'Accessibility', difficulty: 3 },
  { id: 't7', name: 'Testing Basics', difficulty: 5 },
]

const analyzeSequence = (items: TopicItem[]) => {
  let consecutiveHard = 0
  let overload = false
  for (const t of items) {
    if (t.difficulty >= 7) consecutiveHard++
    else consecutiveHard = 0
    if (consecutiveHard >= 3) {
      overload = true
      break
    }
  }
  const easy = items.filter(t => t.difficulty <= 3).length
  const moderate = items.filter(t => t.difficulty > 3 && t.difficulty <= 6).length
  const hard = items.filter(t => t.difficulty >= 7).length
  return { overload, easy, moderate, hard }
}

const suggestReorder = (items: TopicItem[]) => {
  const easy = items.filter(t => t.difficulty <= 3)
  const moderate = items.filter(t => t.difficulty > 3 && t.difficulty <= 6)
  const hard = items.filter(t => t.difficulty >= 7)
  const result: TopicItem[] = []
  const pools = [hard, moderate, easy]
  let i = 0
  while (result.length < items.length) {
    const pool = pools[i % pools.length]
    const item = pool.shift()
    if (item) result.push(item)
    i++
  }
  return result
}

const CognitiveLoadBalancer = () => {
  const [topics, setTopics] = useState<TopicItem[]>(sampleTopics)
  const [reordered, setReordered] = useState<TopicItem[] | null>(null)
  const stats = useMemo(() => analyzeSequence(topics), [topics])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            ⚖️ Balanced Learning
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cognitive Load Balancer</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Avoid long streaks of hard topics with distribution and reorder suggestions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-lg font-semibold mb-2">Topic difficulty distribution</div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Easy</span>
                <span>{stats.easy}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.easy / topics.length) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">Moderate</span>
                <span>{stats.moderate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.moderate / topics.length) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700">Difficult</span>
                <span>{stats.hard}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.hard / topics.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {stats.overload ? (
              <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm">Overload risk detected: too many hard topics in a row</div>
            ) : (
              <div className="px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">Sequence looks balanced</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-2">Current sequence</div>
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="flex items-center justify-between border rounded-lg p-2">
                <div className="text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-gray-600">Difficulty: {t.difficulty}/10</div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className={`${t.difficulty >= 7 ? 'bg-red-500' : t.difficulty >= 4 ? 'bg-yellow-500' : 'bg-green-500'} h-2 rounded-full`} style={{ width: `${(t.difficulty / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-2">Suggested re-ordering</div>
          <div className="space-y-2">
            {(reordered || []).map((t) => (
              <div key={t.id} className="flex items-center justify-between border rounded-lg p-2">
                <div className="text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-gray-600">Difficulty: {t.difficulty}/10</div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className={`${t.difficulty >= 7 ? 'bg-red-500' : t.difficulty >= 4 ? 'bg-yellow-500' : 'bg-green-500'} h-2 rounded-full`} style={{ width: `${(t.difficulty / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {!reordered && (
              <div className="text-sm text-gray-600">Generate a balanced reorder suggestion.</div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="btn-primary" onClick={() => setReordered(suggestReorder(topics))}>Suggest Reorder</button>
            {reordered && (
              <button className="btn-secondary" onClick={() => setTopics(reordered)}>Apply Suggested Order</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CognitiveLoadBalancer
