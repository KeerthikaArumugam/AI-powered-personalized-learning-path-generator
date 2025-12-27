import LearningPathView from '../components/LearningPathView'
import { UserProfile, LearningPath } from '../types'

const RoadmapResultsPage = ({ profile, learningPath }: { profile: UserProfile | null, learningPath: LearningPath | null }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <LearningPathView profile={profile} learningPath={learningPath} />
    </div>
  )
}

export default RoadmapResultsPage

