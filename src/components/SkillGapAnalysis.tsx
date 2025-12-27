import { SkillGap } from '../types'

interface SkillGapAnalysisProps {
  skillGaps: SkillGap[]
}

const SkillGapAnalysis = ({ skillGaps }: SkillGapAnalysisProps) => {
  const getPriorityColor = (priority: SkillGap['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getPriorityIcon = (priority: SkillGap['priority']) => {
    switch (priority) {
      case 'high': return '⚠️'
      case 'medium': return '📈'
      case 'low': return '✅'
    }
  }

  if (skillGaps.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Skill Gap Analysis</h2>
        <div className="text-center py-8">
          <div className="text-4xl text-green-500 mx-auto mb-4">✅</div>
          <p className="text-gray-600">
            Great! No significant skill gaps identified. Consider exploring advanced topics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Skill Gap Analysis</h2>
      <p className="text-gray-600 mb-6">
        Based on your profile and goals, here are the key areas to focus on:
      </p>
      
      <div className="space-y-4">
        {skillGaps.map((gap) => (
          <div key={gap.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{gap.skill}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(gap.priority)}`}>
                {getPriorityIcon(gap.priority)}
                {gap.priority} priority
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Current Level</span>
                <span>Target Level</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${(gap.currentLevel / 10) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 bg-primary-600 h-2 rounded-full"
                    style={{ 
                      width: `${(gap.targetLevel / 10) * 100}%`,
                      opacity: 0.3
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{gap.currentLevel}/10</span>
                  <span>{gap.targetLevel}/10</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Gap: {gap.targetLevel - gap.currentLevel} levels to improve
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillGapAnalysis
