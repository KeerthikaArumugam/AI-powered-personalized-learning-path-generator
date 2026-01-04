import { useMemo, useState } from 'react'
import { Resource } from '../types'

type AnalyzedTopic = {
  name: string
  score: number
  level: 'Easy' | 'Moderate' | 'Difficult'
  explanation: string
  resources: Resource[]
}

const difficultyColor = (level: AnalyzedTopic['level']) => {
  if (level === 'Easy') return 'bg-green-100 text-green-800 border-green-200'
  if (level === 'Moderate') return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

const barColor = (level: AnalyzedTopic['level']) => {
  if (level === 'Easy') return 'bg-green-500'
  if (level === 'Moderate') return 'bg-yellow-500'
  return 'bg-red-500'
}

const analyzeTopics = (topics: string[]): AnalyzedTopic[] => {
  const hardKeywords = ['recursion', 'async', 'asynchronous', 'closure', 'big-o', 'dynamic programming', 'polymorphism', 'monad', 'threading', 'state management', 'distributed', 'regex', 'pointers']
  const mediumKeywords = ['api', 'hooks', 'routing', 'testing', 'deployment', 'security', 'performance', 'optimization', 'database', 'schema']
  return topics.map((t) => {
    const name = t.trim()
    const lower = name.toLowerCase()
    let score = 2
    hardKeywords.forEach(k => { if (lower.includes(k)) score += 5 })
    mediumKeywords.forEach(k => { if (lower.includes(k)) score += 3 })
    if (name.length > 18) score += 1
    if (/\b(theory|math|abstract)\b/.test(lower)) score += 2
    if (score < 0) score = 0
    if (score > 10) score = 10
    const level: AnalyzedTopic['level'] = score <= 3 ? 'Easy' : score <= 6 ? 'Moderate' : 'Difficult'
    const reasons: string[] = []
    if (hardKeywords.some(k => lower.includes(k))) reasons.push('includes advanced concepts')
    if (/\btheory|abstract\b/.test(lower)) reasons.push('abstract topic')
    if (name.length > 18) reasons.push('long or complex phrase')
    if (reasons.length === 0) reasons.push(level === 'Moderate' ? 'requires practice and consolidation' : 'straightforward fundamentals')
    const explanation = reasons.join(', ')
    const resources: Resource[] = level === 'Difficult' ? [
      { id: `r-${name}-1`, type: 'article', title: `${name} simplified guide`, description: `Beginner-friendly explanation of ${name}`, estimatedTime: 20, difficultyLevel: 2, learningStyles: ['reading', 'mixed'], url: '#' },
      { id: `r-${name}-2`, type: 'video', title: `${name} in 10 minutes`, description: `Short visual overview to build intuition`, estimatedTime: 10, difficultyLevel: 2, learningStyles: ['videos', 'mixed'], url: '#' },
      { id: `r-${name}-3`, type: 'project', title: `Practice ${name}`, description: `Small hands-on exercise to apply basics`, estimatedTime: 30, difficultyLevel: 3, learningStyles: ['hands-on', 'mixed'], url: '#' },
    ] : []
    return { name, score, level, explanation, resources }
  })
}

const ConceptDifficultyAnalyzer = () => {
  const [topics, setTopics] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('concept-difficulty-topics')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed as string[]
      }
    } catch {}
    return []
  })
  const [newTopic, setNewTopic] = useState('')
  const [results, setResults] = useState<AnalyzedTopic[]>(() => {
    try {
      const raw = localStorage.getItem('concept-difficulty-results')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed as AnalyzedTopic[]
      }
    } catch {}
    return []
  })
  const [selected, setSelected] = useState<AnalyzedTopic | null>(null)
  const grouped = useMemo(() => {
    return {
      Easy: results.filter(r => r.level === 'Easy'),
      Moderate: results.filter(r => r.level === 'Moderate'),
      Difficult: results.filter(r => r.level === 'Difficult'),
    }
  }, [results])

  const addTopic = () => {
    const v = newTopic.trim()
    if (!v) return
    if (topics.includes(v)) return
    const next = [...topics, v]
    setTopics(next)
    try {
      localStorage.setItem('concept-difficulty-topics', JSON.stringify(next))
    } catch {}
    setNewTopic('')
  }

  const removeTopic = (t: string) => {
    const next = topics.filter(x => x !== t)
    setTopics(next)
    try {
      localStorage.setItem('concept-difficulty-topics', JSON.stringify(next))
    } catch {}
  }

  const analyze = () => {
    const analyzed = analyzeTopics(topics)
    setResults(analyzed)
    try {
      localStorage.setItem('concept-difficulty-results', JSON.stringify(analyzed))
    } catch {}
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
          🔎 Concept Difficulty Analyzer
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Identify challenging topics and get help</h1>
        <p className="text-gray-600 dark:text-gray-300">Enter recently studied concepts. The analyzer categorizes difficulty and suggests simplified resources.</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Enter Topics</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="e.g., Recursion, Async/Await, State Management..."
            className="input-field flex-1 dark:bg-gray-900 dark:border-gray-700"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
          />
          <button type="button" onClick={addTopic} className="btn-secondary">Add</button>
          <button type="button" onClick={analyze} className="btn-primary">Analyze</button>
        </div>
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {topics.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {t}
                <button type="button" onClick={() => removeTopic(t)} className="hover:text-primary-900">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Easy</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">Low effort</span>
          </div>
          <div className="space-y-3">
            {grouped.Easy.length === 0 && (
              <div className="text-sm text-gray-500">No items</div>
            )}
            {grouped.Easy.map((item) => (
              <div key={item.name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColor(item.level)}`}>{item.level}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${barColor(item.level)} h-2 rounded-full`} style={{ width: `${(item.score / 10) * 100}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Level {item.score}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Moderate</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">Needs practice</span>
          </div>
          <div className="space-y-3">
            {grouped.Moderate.length === 0 && (
              <div className="text-sm text-gray-500">No items</div>
            )}
            {grouped.Moderate.map((item) => (
              <div key={item.name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColor(item.level)}`}>{item.level}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${barColor(item.level)} h-2 rounded-full`} style={{ width: `${(item.score / 10) * 100}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Level {item.score}/10</div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{item.explanation}</div>
                <button className="mt-2 btn-secondary" onClick={() => setSelected(item)}>Improve Understanding</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Difficult</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">High effort</span>
          </div>
          <div className="space-y-3">
            {grouped.Difficult.length === 0 && (
              <div className="text-sm text-gray-500">No items</div>
            )}
            {grouped.Difficult.map((item) => (
              <div key={item.name} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColor(item.level)}`}>{item.level}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${barColor(item.level)} h-2 rounded-full`} style={{ width: `${(item.score / 10) * 100}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Level {item.score}/10</div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{item.explanation}</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    💡 <span>Suggested simplified resources</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {item.resources.map((r) => (
                      <div key={r.id} className="border rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{r.type === 'video' ? '🎥' : r.type === 'article' ? '📖' : r.type === 'project' ? '🛠️' : '📚'}</span>
                            <span className="text-sm font-medium">{r.title}</span>
                          </div>
                          <span className="text-xs text-gray-500">{r.estimatedTime} min • L{r.difficultyLevel}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{r.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-2 btn-primary" onClick={() => setSelected(item)}>Improve Understanding</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Recommended steps for {selected.name}</h3>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="space-y-2">
              <div className="border rounded-lg p-3 text-sm">
                Break the concept into subparts and define each in one sentence.
              </div>
              <div className="border rounded-lg p-3 text-sm">
                Watch a short visual primer to build intuition.
              </div>
              <div className="border rounded-lg p-3 text-sm">
                Do one small practice task and reflect on difficulties.
              </div>
              <div className="border rounded-lg p-3 text-sm">
                Revisit fundamentals that the topic depends on.
              </div>
              <div className="border rounded-lg p-3 text-sm">
                Write a one‑paragraph explanation in your own words.
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              <button className="btn-primary" onClick={() => setSelected(null)}>Start</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">How analysis works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              📊 <span className="font-medium text-sm">Signals</span>
            </div>
            <div className="text-sm text-gray-600">Keyword difficulty, abstractness, and complexity indicators.</div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              📘 <span className="font-medium text-sm">Recommendations</span>
            </div>
            <div className="text-sm text-gray-600">Short primers, concise videos, and practice tasks.</div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              ⏱️ <span className="font-medium text-sm">Progress</span>
            </div>
            <div className="text-sm text-gray-600">Focus efforts on high‑impact topics to improve faster.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConceptDifficultyAnalyzer
