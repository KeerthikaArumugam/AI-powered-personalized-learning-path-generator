import { LearningPhase } from '../types'
import { X, Clock, Target, BookOpen, CheckSquare } from 'lucide-react'

interface PhaseCardProps {
  phase: LearningPhase
  onClose: () => void
}

const PhaseCard = ({ phase, onClose }: PhaseCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{phase.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase Overview */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{phase.estimatedTime} hours</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              <span>Difficulty: {phase.difficultyLevel}/10</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>{phase.resources.length} resources</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckSquare className="h-4 w-4" />
              <span>{phase.assessments.length} assessments</span>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Topics Covered</h3>
          <div className="space-y-3">
            {phase.topics.map((topic) => (
              <div key={topic.id} className="border rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">{topic.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.subtopics.map((subtopic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {subtopic}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    defaultValue={localStorage.getItem(`topic-notes-${topic.id}`) || ''}
                    onBlur={(e) => localStorage.setItem(`topic-notes-${topic.id}`, e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Write your notes or key takeaways..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phase.milestones.map((milestone) => (
            <div key={milestone.id} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
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
                <h4 className="font-medium">{milestone.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              <div className="space-y-1">
                {milestone.criteria.map((criterion, index) => (
                  <div key={index} className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>•</span>
                    <span>{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Learning Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phase.resources.map((resource) => (
            <div key={resource.id} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  resource.type === 'video' ? 'bg-red-500' :
                  resource.type === 'article' ? 'bg-blue-500' :
                  resource.type === 'project' ? 'bg-green-500' :
                  resource.type === 'course' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-xs font-medium text-gray-600 uppercase">
                  {resource.type}
                </span>
              </div>
              <h4 className="font-medium text-sm mb-1">{resource.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
              <div className="text-xs text-gray-500">
                {resource.estimatedTime} minutes • Level {resource.difficultyLevel}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessments */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Assessments</h3>
        <div className="space-y-3">
          {phase.assessments.map((assessment) => (
            <div key={assessment.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{assessment.title}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {assessment.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{assessment.estimatedTime} minutes</span>
                <span>Pass: {assessment.passingCriteria}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhaseCard
