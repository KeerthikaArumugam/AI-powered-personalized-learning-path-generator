import { useEffect, useState } from 'react'

type Challenge = {
  title: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  time: number
}

const DailyLearningChallenge = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const c: Challenge = { title: 'Build a responsive card', difficulty: 'Moderate', time: 30 }
    setChallenge(c)
    const s = parseInt(localStorage.getItem('daily-streak') || '0', 10)
    setStreak(s)
  }, [])

  const complete = () => {
    const s = streak + 1
    setStreak(s)
    localStorage.setItem('daily-streak', String(s))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Learning Challenge</h1>
        <p className="text-gray-600 dark:text-gray-300">Fun, minimal gamified elements with streaks.</p>
      </div>
      <div className="card">
        {!challenge ? (
          <div className="text-gray-500">Loading challenge...</div>
        ) : (
          <div className="space-y-2">
            <div className="text-lg font-semibold">{challenge.title}</div>
            <div className="text-sm text-gray-600">Difficulty: {challenge.difficulty}</div>
            <div className="text-sm text-gray-600">Estimated time: {challenge.time} min</div>
            <div className="mt-3 flex items-center gap-2">
              <button className="btn-primary" onClick={complete}>Complete</button>
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                Streak: {streak} 🔥
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyLearningChallenge
