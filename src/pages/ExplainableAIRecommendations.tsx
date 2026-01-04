import { useEffect, useMemo, useState } from 'react'
import { LearningPath } from '../types'
import { generateRecommendations } from '../services/pathGenerator'
import { getRankedVideos } from '../services/videoRecommendations'

type Recommendation = {
  id: string
  topic: string
  why: string[]
  dependencies: string[]
  outcome: string
  confidence: number
}

type DifficultySignal = 'Easy' | 'Moderate' | 'Difficult'

const buildRecommendations = (learningPath?: LearningPath | null): Recommendation[] => {
  return generateRecommendations(learningPath)
}

const ExplainableAIRecommendations = ({ learningPath }: { learningPath?: LearningPath | null }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [weakSnapshot, setWeakSnapshot] = useState<{ date: string; topics: string[] } | null>(null)
  const data = useMemo(() => buildRecommendations(learningPath), [learningPath])
  const pathTopics = useMemo(() => {
    if (!learningPath) return []
    return learningPath.phases.flatMap(p => p.topics.map(t => t.name))
  }, [learningPath])

  const difficultyMap = useMemo(() => {
    try {
      const raw = localStorage.getItem('concept-difficulty-results')
      if (!raw) return new Map<string, DifficultySignal>()
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return new Map<string, DifficultySignal>()
      const map = new Map<string, DifficultySignal>()
      parsed.forEach((x: any) => {
        const name = String(x.name || '').toLowerCase()
        if (!name) return
        const level: DifficultySignal =
          x.level === 'Difficult' ? 'Difficult' :
          x.level === 'Moderate' ? 'Moderate' :
          'Easy'
        map.set(name, level)
      })
      return map
    } catch {
      return new Map<string, DifficultySignal>()
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('retention-weak-topics')
      if (raw) setWeakSnapshot(JSON.parse(raw))
    } catch {}
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            🔎 Transparent AI
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explainable AI Recommendations</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">See why topics are recommended, their dependencies, and expected outcomes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <div className="font-semibold mb-2">How these suggestions were derived</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Matches between your current learning path topics and common skill gaps.</li>
              <li>Emphasis on areas that benefit from stronger fundamentals and structure.</li>
              {weakSnapshot && (
                <li>
                  Signals from recent retention checks on {weakSnapshot.date} highlight topics that need reinforcement.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="text-sm space-y-2">
            <div className="font-semibold">Context summary</div>
            <div>Recommendations: {data.length}</div>
            <div>Path topics considered: {pathTopics.length}</div>
            {weakSnapshot ? (
              <div>
                <div>Recent weak topics: {weakSnapshot.topics.length}</div>
                {weakSnapshot.topics.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {weakSnapshot.topics.slice(0, 4).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs">
                        {t}
                      </span>
                    ))}
                    {weakSnapshot.topics.length > 4 && (
                      <span className="text-xs text-gray-500">+{weakSnapshot.topics.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Take a retention check to see how quiz results influence recommendations.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((rec) => {
          const isOpen = expandedId === rec.id
          const topicKey = rec.topic.toLowerCase().split(' ')[0]
          const inPath = pathTopics.some(t => t.toLowerCase().includes(topicKey))
          const relatedWeak = !!weakSnapshot && weakSnapshot.topics.some(t => {
            const name = t.toLowerCase()
            if (name.includes(topicKey)) return true
            return rec.dependencies.some(dep => name.includes(dep.toLowerCase().split(' ')[0]))
          })
          const lowerName = rec.topic.toLowerCase()
          let difficulty: DifficultySignal = 'Easy'
          const direct = difficultyMap.get(lowerName)
          if (direct) {
            difficulty = direct
          } else {
            for (const [name, level] of difficultyMap.entries()) {
              if (lowerName.includes(name)) {
                difficulty = level
                break
              }
            }
          }
          if (relatedWeak) difficulty = 'Difficult'
          const videoResult = getRankedVideos({
            topic: rec.topic,
            learningPath,
            difficultySignal: difficulty,
          })
          const topVideos = videoResult.items.slice(0, 2)
          return (
            <div key={rec.id} className={`card border-2 ${isOpen ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{rec.topic}</div>
                  <div className="text-sm text-gray-600">Confidence: {(rec.confidence * 100).toFixed(0)}%</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        inPath
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {inPath ? 'In current path' : 'Not yet in path'}
                    </span>
                    {relatedWeak && weakSnapshot && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                        Linked to weak area ({weakSnapshot.date})
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                  onClick={() => setExpandedId(isOpen ? null : rec.id)}
                >
                  {isOpen ? 'Hide' : 'Explain'}
                </button>
              </div>

              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${rec.confidence * 100}%` }}
                ></div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-sm">
                  <div className="font-medium mb-1">Why this was recommended</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {rec.why.map((w, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300">{w}</li>
                    ))}
                  </ul>
                  {relatedWeak && weakSnapshot && (
                    <div className="mt-2 text-xs text-red-600">
                      Recent retention checks showed weaker performance around this topic or its prerequisites on {weakSnapshot.date}.
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <div className="font-medium mb-1">Skill dependencies</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.dependencies.map((d) => (
                      <span key={d} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{d}</span>
                    ))}
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium mb-1">Expected learning outcome</div>
                  <div className="text-gray-700 dark:text-gray-300">{rec.outcome}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">Suggested videos for this topic</div>
                  {topVideos.length === 0 ? (
                    <div className="text-xs text-gray-500">
                      No videos found for this topic yet. Try adding a preferred video in the Video Learning Hub.
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {topVideos.map(v => (
                        <li key={v.id} className="flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {v.label === 'Beginner Friendly' && '🎯 '}
                              {v.label === 'Concept Understanding' && '📘 '}
                              {v.label === 'Advanced Explanation' && '🔬 '}
                              {v.title}
                            </span>
                            <span className="text-gray-500">
                              {v.difficulty} {v.durationMinutes > 0 ? `• ${v.durationMinutes} min` : ''}
                            </span>
                          </div>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-primary-700 hover:underline"
                          >
                            Open
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">AI rationale surfaced for clarity and trust</div>
                <button className="btn-primary">Add to Learning Path</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExplainableAIRecommendations
