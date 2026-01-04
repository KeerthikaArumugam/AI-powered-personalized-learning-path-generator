import { useEffect, useMemo, useState } from 'react'
import { UserProfile, LearningPath } from '../types'

type Challenge = {
  title: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  time: number
}

interface DailyLearningChallengeProps {
  profile?: UserProfile | null
  learningPath?: LearningPath | null
}

const DailyLearningChallenge = ({ profile, learningPath }: DailyLearningChallengeProps) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [streak, setStreak] = useState(0)
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const dailyTargetMinutes = useMemo(() => {
    if (!profile) return null
    const perWeek = profile.timeConstraints.availableTimePerWeek
    if (!perWeek || perWeek <= 0) return null
    return Math.round(perWeek / 7)
  }, [profile])

  const todaySuggestions = useMemo(() => {
    if (!learningPath) return []
    const firstPhase = learningPath.phases[0]
    if (!firstPhase) return []
    return firstPhase.topics.slice(0, 3).map(t => t.name)
  }, [learningPath])

  useEffect(() => {
    const c: Challenge = { title: 'Build a responsive card', difficulty: 'Moderate', time: 30 }
    setChallenge(c)
    const s = parseInt(localStorage.getItem('daily-streak') || '0', 10)
    const storedDate = localStorage.getItem('daily-streak-date')
    setLastCompletedDate(storedDate)
    if (storedDate === today) {
      setStreak(s)
    } else if (storedDate) {
      const previous = new Date(storedDate)
      const diff = (new Date(today).getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) {
        setStreak(s)
      } else {
        setStreak(0)
      }
    } else {
      setStreak(0)
    }
  }, [])

  const complete = () => {
    let nextStreak = streak
    if (lastCompletedDate === today) {
      nextStreak = streak
    } else if (lastCompletedDate) {
      const previous = new Date(lastCompletedDate)
      const diff = (new Date(today).getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) {
        nextStreak = streak + 1
      } else {
        nextStreak = 1
      }
    } else {
      nextStreak = 1
    }
    setStreak(nextStreak)
    setLastCompletedDate(today)
    localStorage.setItem('daily-streak', String(nextStreak))
    localStorage.setItem('daily-streak-date', today)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today&apos;s Learning Focus</h1>
        <p className="text-gray-600 dark:text-gray-300">See a quick challenge, streak, and suggested topics for today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Daily Learning Challenge</div>
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
              Streak: {streak} {streak === 1 ? 'day' : 'days'} 🔥
            </span>
          </div>
        {!challenge ? (
          <div className="text-gray-500">Loading challenge...</div>
        ) : (
          <div className="space-y-2">
            <div className="text-lg font-semibold">{challenge.title}</div>
            <div className="text-sm text-gray-600">Difficulty: {challenge.difficulty}</div>
            <div className="text-sm text-gray-600">Estimated time: {challenge.time} min</div>
            <div className="mt-3 flex items-center gap-2">
              <button className="btn-primary" onClick={complete}>Mark Today&apos;s Challenge Done</button>
            </div>
          </div>
        )}
      </div>
        <div className="card">
          <div className="text-lg font-semibold mb-2">Today at a glance</div>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <div className="font-medium">Time goal</div>
              <div>
                {dailyTargetMinutes ? `${dailyTargetMinutes} min (based on your weekly availability)` : 'Set your profile to see a daily time target.'}
              </div>
            </div>
            <div>
              <div className="font-medium">Suggested topics</div>
              {todaySuggestions.length === 0 ? (
                <div className="text-gray-500">Generate a learning path to see concrete suggestions.</div>
              ) : (
                <div className="mt-1 flex flex-wrap gap-2">
                  {todaySuggestions.map(t => (
                    <span key={t} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyLearningChallenge
