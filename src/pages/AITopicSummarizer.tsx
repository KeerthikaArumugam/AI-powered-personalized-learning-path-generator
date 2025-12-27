import { useState } from 'react'

const AITopicSummarizer = () => {
  const [topic, setTopic] = useState('')
  const [summary, setSummary] = useState<string | null>(null)
  const [points, setPoints] = useState<string[]>([])
  const [follow, setFollow] = useState<string[]>([])

  const summarize = () => {
    const t = topic.trim() || 'Closures'
    setSummary(`${t} is explained simply. It helps you manage data and behavior together.`)
    setPoints(['What it is', 'Why it matters', 'How to apply', 'Common pitfalls'])
    setFollow(['Related patterns', 'Advanced use‑cases', 'Practice exercises'])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Topic Summarizer</h1>
        <p className="text-gray-600 dark:text-gray-300">Get a concise explanation, bullet points, and follow‑up concepts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">Enter or select a topic</div>
          <input className="input-field" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Closures, Flexbox, REST APIs" />
          <div className="mt-3">
            <button className="btn-primary" onClick={summarize}>Summarize</button>
          </div>
        </div>
        <div className="card">
          {!summary ? (
            <div className="text-gray-500">Summary will appear here.</div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded bg-primary-50 text-primary-800">{summary}</div>
              <div>
                <div className="font-medium mb-2">Key points</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {points.map((p, i) => (<li key={i}>{p}</li>))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">Suggested follow‑ups</div>
                <div className="flex flex-wrap gap-2">
                  {follow.map((f, i) => (<span key={i} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{f}</span>))}
                </div>
              </div>
              <button className="btn-secondary">Add to Learning Path</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AITopicSummarizer

