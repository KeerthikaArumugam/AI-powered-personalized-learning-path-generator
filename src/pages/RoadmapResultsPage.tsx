import { useMemo, useState } from 'react'
import LearningPathView from '../components/LearningPathView'
import RoadmapStyleView from '../components/RoadmapStyleView'
import { UserProfile, LearningPath } from '../types'

const RoadmapResultsPage = ({ profile, learningPath }: { profile: UserProfile | null, learningPath: LearningPath | null }) => {
  const [mode, setMode] = useState<'roadmap' | 'list'>('roadmap')

  const ready = useMemo(() => !!profile && !!learningPath, [profile, learningPath])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          View mode
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            type="button"
            className={`px-3 py-2 text-sm ${mode === 'roadmap' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('roadmap')}
          >
            Roadmap
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm ${mode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {ready && profile && learningPath ? (
        mode === 'roadmap' ? (
          <RoadmapStyleView learningPath={learningPath} />
        ) : (
          <LearningPathView profile={profile} learningPath={learningPath} />
        )
      ) : (
        <LearningPathView profile={profile} learningPath={learningPath} />
      )}
    </div>
  )
}

export default RoadmapResultsPage
