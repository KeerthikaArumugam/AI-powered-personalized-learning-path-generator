import { useMemo, useState } from 'react'
import { UserProfile } from '../types'

type AltPath = {
  id: string
  title: string
  style: 'Theory' | 'Hands‑On' | 'Fast‑Track'
  durationWeeks: number
  difficulty: number
  highlights: string[]
}

const buildPaths = (profile?: UserProfile | null): AltPath[] => {
  const base = profile?.learningStyle || 'mixed'
  const seed: AltPath[] = [
    { id: 'p1', title: 'Theory‑Focused Path', style: 'Theory', durationWeeks: 8, difficulty: 4, highlights: ['Concept definitions', 'Readings', 'Structured quizzes'] },
    { id: 'p2', title: 'Hands‑On / Project‑Based Path', style: 'Hands‑On', durationWeeks: 6, difficulty: 6, highlights: ['Mini projects', 'Practice tasks', 'Portfolio'] },
    { id: 'p3', title: 'Fast‑Track Path', style: 'Fast‑Track', durationWeeks: 4, difficulty: 7, highlights: ['Focused essentials', 'Time‑boxed sprints', 'Assessments'] },
  ]
  return seed.map(p => ({ ...p, highlights: [...p.highlights, `Style: ${base}`] }))
}

const AlternateLearningPaths = ({ profile }: { profile?: UserProfile | null }) => {
  const [selected, setSelected] = useState<string | null>(null)
  const paths = useMemo(() => buildPaths(profile), [profile])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alternate Learning Path Generator</h1>
        <p className="text-gray-600 dark:text-gray-300">Select a role or domain, then choose an alternate roadmap.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map(p => (
          <div key={p.id} className={`card border-2 ${selected === p.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
            <div className="text-lg font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">Duration: {p.durationWeeks} weeks</div>
            <div className="text-sm text-gray-600">Difficulty: {p.difficulty}/10</div>
            <div className="text-sm text-gray-600 mb-2">Learning style: {p.style}</div>
            <div className="space-y-1">
              {p.highlights.map((h, i) => (
                <div key={i} className="text-xs text-gray-700 dark:text-gray-300">• {h}</div>
              ))}
            </div>
            <div className="mt-3">
              <button className="btn-primary" onClick={() => setSelected(p.id)}>Select This Path</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlternateLearningPaths
