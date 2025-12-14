import { useState } from 'react'
import { UserProfile, LearningPath, LearningPhase } from '../types'
import { Clock, Target, BookOpen, CheckCircle, Circle, ArrowRight } from 'lucide-react'
import SkillGapAnalysis from './SkillGapAnalysis'
import PhaseCard from './PhaseCard'
import ResourceList from './ResourceList'

interface LearningPathViewProps {
  profile: UserProfile | null
  learningPath: LearningPath | null
}

const LearningPathView = ({ profile, learningPath }: LearningPathViewProps) => {
  const [selectedPhase, setSelectedPhase] = useState<LearningPhase | null>(null)

  if (!profile || !learningPath) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No Learning Path Generated
        </h2>
        <p className="text-gray-600">
          Please complete your profile setup to generate a personalized learning path.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Personalized Learning Path
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {learningPath.objective}
        </p>
        
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <span>{learningPath.estimatedDuration} weeks</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary-600" />
            <span>{learningPath.phases.length} phases</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <span>
              {learningPath.phases.reduce((sum, phase) => sum + phase.resources.length, 0)} resources
            </span>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <SkillGapAnalysis skillGaps={learningPath.skillGapAnalysis} />

      {/* Learning Path Overview */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Learning Roadmap</h2>
        
        <div className="space-y-4">
          {learningPath.phases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Connection Line */}
              {index < learningPath.phases.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300"></div>
              )}
              
              <div 
                className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedPhase?.id === phase.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
              >
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phase {index + 1}: {phase.title}
                    </h3>
                    <ArrowRight className={`h-5 w-5 transition-transform ${
                      selectedPhase?.id === phase.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>{phase.estimatedTime} hours</span>
                    <span>•</span>
                    <span>Difficulty: {phase.difficultyLevel}/10</span>
                    <span>•</span>
                    <span>{phase.topics.length} topics</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {phase.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {topic.name}
                        </span>
                      ))}
                      {phase.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{phase.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Details */}
      {selectedPhase && (
        <PhaseCard 
          phase={selectedPhase} 
          onClose={() => setSelectedPhase(null)}
        />
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-left p-4 h-auto">
            <div className="font-medium">Start Learning</div>
            <div className="text-sm opacity-90 mt-1">
              Begin with Phase 1: {learningPath.phases[0]?.title}
            </div>
          </button>
          
          <button className="btn-secondary text-left p-4 h-auto">
            <div className="font-medium">Download PDF</div>
            <div className="text-sm opacity-75 mt-1">
              Get a printable version of your learning path
            </div>
          </button>
          
          <button className="btn-secondary text-left p-4 h-auto">
            <div className="font-medium">Customize Path</div>
            <div className="text-sm opacity-75 mt-1">
              Adjust timeline or modify phases
            </div>
          </button>
        </div>
      </div>

      {/* All Resources */}
      <ResourceList 
        resources={learningPath.phases.flatMap(phase => phase.resources)}
        learningStyle={profile.learningStyle}
      />
    </div>
  )
}

export default LearningPathView