import { useMemo, useState } from 'react'
import { LearningPath } from '../types'
import { generateRecommendations } from '../services/pathGenerator'

type Recommendation = {
  id: string
  topic: string
  why: string[]
  dependencies: string[]
  outcome: string
  confidence: number
}

const buildRecommendations = (learningPath?: LearningPath | null): Recommendation[] => {
  return generateRecommendations(learningPath)
}

const ExplainableAIRecommendations = ({ learningPath }: { learningPath?: LearningPath | null }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const data = useMemo(() => buildRecommendations(learningPath), [learningPath])

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
        {data.map((rec) => {
          const isOpen = expandedId === rec.id
          return (
            <div key={rec.id} className={`card border-2 ${isOpen ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{rec.topic}</div>
                  <div className="text-sm text-gray-600">Confidence: {(rec.confidence * 100).toFixed(0)}%</div>
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
