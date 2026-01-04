import { useState, useEffect } from 'react'
import { UserProfile, LearningPath, ProgressRecord } from '../types'

interface ProgressDashboardProps {
  profile: UserProfile | null
  learningPath: LearningPath | null
}

const ProgressDashboard = ({ profile, learningPath }: ProgressDashboardProps) => {
  const [progress, setProgress] = useState<ProgressRecord | null>(null)
  const [streak, setStreak] = useState(0)
  const [retentionSummary, setRetentionSummary] = useState<{ lastDate: string; lastPct: number } | null>(null)

  useEffect(() => {
    if (learningPath) {
      setProgress({
        userId: 'user-1',
        pathId: learningPath.id,
        currentPhase: 0,
        completedMilestones: [],
        timeSpent: 180, // 3 hours
        lastActivity: new Date()
      })
      try {
        const streakValue = parseInt(localStorage.getItem('daily-streak') || '0', 10)
        if (!isNaN(streakValue)) setStreak(streakValue)
      } catch {}
      try {
        const rawHistory = localStorage.getItem('retention-history')
        if (rawHistory) {
          const parsed: { date: string; pct: number }[] = JSON.parse(rawHistory)
          const last = parsed[parsed.length - 1]
          if (last) setRetentionSummary({ lastDate: last.date, lastPct: last.pct })
        }
      } catch {}
    }
  }, [learningPath])

  if (!profile || !learningPath || !progress) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📈</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No Progress Data
        </h2>
        <p className="text-gray-600">
          Start your learning journey to see progress tracking here.
        </p>
      </div>
    )
  }

  const totalMilestones = learningPath.phases.reduce((sum, phase) => sum + phase.milestones.length, 0)
  const completedMilestones = progress.completedMilestones.length
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const totalEstimatedTime = learningPath.phases.reduce((sum, phase) => sum + phase.estimatedTime, 0) * 60 // Convert to minutes
  const timeProgressPercentage = totalEstimatedTime > 0 ? (progress.timeSpent / totalEstimatedTime) * 100 : 0

  const currentPhase = learningPath.phases[progress.currentPhase]
  const nextPhase = learningPath.phases[progress.currentPhase + 1]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learning Progress Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track your journey through: {learningPath.objective}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-gray-600">Overall Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {completedMilestones}
          </div>
          <div className="text-sm text-gray-600">
            Milestones Completed
          </div>
          <div className="text-xs text-gray-500 mt-1">
            of {totalMilestones} total
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Math.round(progress.timeSpent / 60)}h
          </div>
          <div className="text-sm text-gray-600">Time Invested</div>
          <div className="text-xs text-gray-500 mt-1">
            of {Math.round(totalEstimatedTime / 60)}h estimated
          </div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {progress.currentPhase + 1}
          </div>
          <div className="text-sm text-gray-600">Current Phase</div>
          <div className="text-xs text-gray-500 mt-1">
            of {learningPath.phases.length} phases
          </div>
        </div>
      </div>

      {/* Current Phase Progress */}
      {currentPhase && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Current Phase</h2>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Phase {progress.currentPhase + 1}: {currentPhase.title}
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2"><span>⏱️</span><span className="text-sm">{currentPhase.estimatedTime} hours</span></div>
              <div className="flex items-center space-x-2"><span>🎯</span><span className="text-sm">Difficulty: {currentPhase.difficultyLevel}/10</span></div>
              <div className="flex items-center space-x-2"><span>🏅</span><span className="text-sm">{currentPhase.milestones.length} milestones</span></div>
            </div>

            {/* Phase Milestones */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Milestones</h4>
              {currentPhase.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-3 p-2 rounded">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    milestone.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {milestone.completed && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <span className={`text-sm ${
                    milestone.completed ? 'text-gray-900 line-through' : 'text-gray-700'
                  }`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learning Streak & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Learning Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-medium">
                {progress.lastActivity.toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Daily Time</span>
              <span className="font-medium">
                {Math.round(progress.timeSpent / 7)} minutes
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Learning Streak</span>
              <span className="font-medium text-green-600">
                {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'} 🔥` : 'No active streak'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">
                {Math.round(timeProgressPercentage)}%
              </span>
            </div>
            {retentionSummary && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last retention score</span>
                <span className="font-medium">
                  {retentionSummary.lastPct}% on {retentionSummary.lastDate}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
          {nextPhase ? (
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-gray-900 mb-1">
                  Next: {nextPhase.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {nextPhase.topics.length} topics • {nextPhase.estimatedTime} hours
                </p>
                <div className="flex flex-wrap gap-1">
                  {nextPhase.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic.id}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full btn-secondary text-sm py-2">
                Preview Next Phase
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🏅</div>
              <p className="text-sm text-gray-600">
                You're on the final phase! Keep going!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Phase Progress Timeline */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Learning Path Timeline</h2>
        <div className="space-y-4">
          {learningPath.phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < progress.currentPhase 
                  ? 'bg-green-500 text-white' 
                  : index === progress.currentPhase
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-medium ${
                  index <= progress.currentPhase ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {phase.title}
                </h3>
                <div className="text-sm text-gray-500">
                  {phase.estimatedTime} hours • {phase.topics.length} topics
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {index < progress.currentPhase && '✓ Completed'}
                {index === progress.currentPhase && 'In Progress'}
                {index > progress.currentPhase && 'Upcoming'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-left p-4 h-auto">
            <div className="font-medium">Continue Learning</div>
            <div className="text-sm opacity-90 mt-1">
              Resume {currentPhase?.title}
            </div>
          </button>
          
          <button className="btn-secondary text-left p-4 h-auto">
            <div className="font-medium">Update Progress</div>
            <div className="text-sm opacity-75 mt-1">
              Mark milestones as complete
            </div>
          </button>
          
          <button className="btn-secondary text-left p-4 h-auto">
            <div className="font-medium">Adjust Schedule</div>
            <div className="text-sm opacity-75 mt-1">
              Modify your learning pace
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressDashboard
