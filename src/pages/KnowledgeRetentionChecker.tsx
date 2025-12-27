import { useEffect, useMemo, useState } from 'react'
import { LearningPath } from '../types'

type QuizItem = {
  id: string
  topic: string
  question: string
  options: string[]
  answer: string
}

type ResultItem = {
  topic: string
  correct: boolean
}

const makeQuiz = (learningPath?: LearningPath | null): QuizItem[] => {
  const baseTopics =
    learningPath?.phases.flatMap(p => p.topics.map(t => t.name)).slice(0, 5) ||
    ['Variables', 'Functions', 'Async/Await', 'State Management', 'CSS Flexbox']
  return baseTopics.map((name, i) => {
    const options = ['Concept', 'Technique', 'Pattern', 'API']
    const answer = options[i % options.length]
    return {
      id: `q-${i}`,
      topic: name,
      question: `Identify ${name} classification`,
      options,
      answer,
    }
  })
}

const retentionMaterials = (topic: string) => [
  { type: 'article', title: `${topic} recap`, time: 10 },
  { type: 'video', title: `${topic} quick primer`, time: 8 },
  { type: 'practice', title: `Apply ${topic}`, time: 15 },
]

const KnowledgeRetentionChecker = ({ learningPath }: { learningPath?: LearningPath | null }) => {
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [percentage, setPercentage] = useState<number | null>(null)
  const [history, setHistory] = useState<{ date: string; pct: number }[]>([])

  useEffect(() => {
    setQuiz(makeQuiz(learningPath))
  }, [learningPath])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('retention-history')
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  const weakConcepts = useMemo(() => {
    if (!results) return []
    return results.filter(r => !r.correct).map(r => r.topic)
  }, [results])

  const submit = () => {
    const r: ResultItem[] = quiz.map(q => ({
      topic: q.topic,
      correct: (answers[q.id] || '') === q.answer,
    }))
    setResults(r)
    const correct = r.filter(x => x.correct).length
    const pct = Math.round((correct / quiz.length) * 100)
    setPercentage(pct)
    const entry = { date: new Date().toISOString().slice(0, 10), pct }
    const next = [...history, entry].slice(-12)
    setHistory(next)
    localStorage.setItem('retention-history', JSON.stringify(next))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            📚 Knowledge Retention Checker
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check what stuck from recent learning</h1>
          <p className="text-gray-600 dark:text-gray-300">Answer quick micro‑quizzes. See retention percent and revision suggestions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Micro‑Quizzes</h2>
          <div className="space-y-4">
            {quiz.map(q => (
              <div key={q.id} className="border rounded-lg p-3">
                <div className="font-medium">{q.topic}</div>
                <div className="text-sm text-gray-600">{q.question}</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) =>
                          setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="btn-primary" onClick={submit}>Check Retention</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {percentage === null ? (
            <div className="text-gray-500">Answer quizzes to view your retention.</div>
          ) : (
            <div className="space-y-4">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div>
                <div className="font-medium mb-2">Weak concepts to revise</div>
                {weakConcepts.length === 0 ? (
                  <div className="text-sm text-gray-500">Great job! No weak concepts detected.</div>
                ) : (
                  <div className="space-y-2">
                    {weakConcepts.map(topic => (
                      <div key={topic} className="border rounded-lg p-3">
                        <div className="font-medium">{topic}</div>
                        <div className="text-sm text-gray-600 mt-1">Suggested revision materials</div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {retentionMaterials(topic).map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{m.type === 'video' ? '🎥' : m.type === 'article' ? '📖' : '🛠️'}</span>
                                <span>{m.title}</span>
                              </div>
                              <span className="text-gray-500">{m.time} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Retention Trend</h2>
        {history.length === 0 ? (
          <div className="text-gray-500">No past checks yet.</div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {history.map((h, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-6 rounded-t ${h.pct >= 70 ? 'bg-green-500' : h.pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ height: `${Math.max(h.pct, 5)}%` }}
                />
                <div className="text-xs text-gray-500 mt-1">{h.date.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowledgeRetentionChecker

