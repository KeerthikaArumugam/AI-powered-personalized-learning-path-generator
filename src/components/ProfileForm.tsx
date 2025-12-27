import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserProfile, LearningGoal, TimeConstraints, ValidationError, LearningPath } from '../types'
import { validateProfile } from '../services/validation'
import { generateLearningPath } from '../services/pathGenerator'

interface ProfileFormProps {
  onProfileComplete: (profile: UserProfile) => void
  onPathGenerated: (path: LearningPath) => void
}

const ProfileForm = ({ onProfileComplete, onPathGenerated }: ProfileFormProps) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  
  // Form state
  const [skillLevel, setSkillLevel] = useState<UserProfile['skillLevel']>('beginner')
  const [backgroundKnowledge, setBackgroundKnowledge] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [learningGoal, setLearningGoal] = useState<LearningGoal>({
    type: 'specific-skill',
    description: '',
    targetCompetencies: []
  })
  const [learningStyle, setLearningStyle] = useState<UserProfile['learningStyle']>('mixed')
  const [difficultyPace, setDifficultyPace] = useState<UserProfile['difficultyPace']>('moderate')
  const [timeConstraints, setTimeConstraints] = useState<TimeConstraints>({
    availableTimePerDay: 60,
    availableTimePerWeek: 420,
    targetDeadline: undefined
  })

  const addSkill = () => {
    if (newSkill.trim() && !backgroundKnowledge.includes(newSkill.trim())) {
      setBackgroundKnowledge([...backgroundKnowledge, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setBackgroundKnowledge(backgroundKnowledge.filter(s => s !== skill))
  }

  const addCompetency = () => {
    const competency = (document.getElementById('new-competency') as HTMLInputElement)?.value
    if (competency?.trim() && !learningGoal.targetCompetencies.includes(competency.trim())) {
      setLearningGoal({
        ...learningGoal,
        targetCompetencies: [...learningGoal.targetCompetencies, competency.trim()]
      })
      ;(document.getElementById('new-competency') as HTMLInputElement).value = ''
    }
  }

  const removeCompetency = (competency: string) => {
    setLearningGoal({
      ...learningGoal,
      targetCompetencies: learningGoal.targetCompetencies.filter(c => c !== competency)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])

    const profile: UserProfile = {
      skillLevel,
      backgroundKnowledge,
      learningGoal,
      learningStyle,
      timeConstraints,
      difficultyPace
    }

    // Validate profile
    const validationErrors = validateProfile(profile)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Generate learning path
      const path = await generateLearningPath(profile)
      
      onProfileComplete(profile)
      onPathGenerated(path)
      navigate('/results')
    } catch (error) {
      setErrors([{ field: 'general', message: 'Failed to generate learning path. Please try again.' }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (field: string) => {
    return errors.find(error => error.field === field)?.message
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your Personalized Learning Path
        </h1>
        <p className="text-lg text-gray-600">
          Tell us about your goals and preferences to generate a customized learning roadmap
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Skill Level */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Current Skill Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <label key={level} className="cursor-pointer">
                <input
                  type="radio"
                  name="skillLevel"
                  value={level}
                  checked={skillLevel === level}
                  onChange={(e) => setSkillLevel(e.target.value as UserProfile['skillLevel'])}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  skillLevel === level
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="font-medium capitalize">{level}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {level === 'beginner' && 'Just starting out'}
                    {level === 'intermediate' && 'Some experience'}
                    {level === 'advanced' && 'Experienced learner'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {getErrorMessage('skillLevel') && (
            <p className="text-red-600 text-sm mt-2">{getErrorMessage('skillLevel')}</p>
          )}
        </div>

        {/* Background Knowledge */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Background Knowledge & Experience</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill or area of knowledge..."
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary flex items-center gap-2"
              >
                ＋ Add
              </button>
              <button
                type="button"
                aria-label="Voice input"
                onClick={() => {
                  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                  if (!SR) return
                  const recognition = new SR()
                  recognition.lang = 'en-US'
                  recognition.onresult = (event: any) => {
                    const text = event.results[0][0].transcript
                    setNewSkill(text)
                  }
                  recognition.start()
                }}
                className="btn-secondary"
              >
                🎤
              </button>
            </div>
            
            {backgroundKnowledge.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {backgroundKnowledge.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-primary-900"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Learning Goal */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Learning Goal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Type
              </label>
              <select
                value={learningGoal.type}
                onChange={(e) => setLearningGoal({
                  ...learningGoal,
                  type: e.target.value as LearningGoal['type']
                })}
                className="input-field"
              >
                <option value="specific-skill">Learn a Specific Skill</option>
                <option value="job-role">Prepare for Job Role</option>
                <option value="exam">Prepare for Exam/Certification</option>
                <option value="project">Complete a Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Description
              </label>
              <textarea
                value={learningGoal.description}
                onChange={(e) => setLearningGoal({
                  ...learningGoal,
                  description: e.target.value
                })}
                placeholder="Describe what you want to achieve..."
                rows={3}
                className="input-field"
              />
              {getErrorMessage('learningGoal.description') && (
                <p className="text-red-600 text-sm mt-1">{getErrorMessage('learningGoal.description')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Competencies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="new-competency"
                  type="text"
                  placeholder="Add a target competency..."
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetency())}
                />
                <button
                  type="button"
                  onClick={addCompetency}
                  className="btn-secondary flex items-center gap-2"
                >
                  ＋ Add
                </button>
              </div>
              
              {learningGoal.targetCompetencies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {learningGoal.targetCompetencies.map((competency) => (
                    <span
                      key={competency}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {competency}
                      <button
                        type="button"
                        onClick={() => removeCompetency(competency)}
                        className="hover:text-green-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Learning Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Learning Style
              </label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value as UserProfile['learningStyle'])}
                className="input-field"
              >
                <option value="videos">Videos</option>
                <option value="reading">Reading</option>
                <option value="hands-on">Hands-on Practice</option>
                <option value="mixed">Mixed Approach</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Pace
              </label>
              <select
                value={difficultyPace}
                onChange={(e) => setDifficultyPace(e.target.value as UserProfile['difficultyPace'])}
                className="input-field"
              >
                <option value="slow">Slow & Steady</option>
                <option value="moderate">Moderate</option>
                <option value="fast">Fast Track</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Mode
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Beginner', 'Intermediate', 'Fast-Track', 'Career Switch'].map((mode) => (
                  <div key={mode} className="p-3 border rounded-lg text-center">
                    <span className="text-sm text-gray-700">{mode}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Mode influences recommendations and pacing.
              </p>
            </div>
          </div>
        </div>

        {/* Time Constraints */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Time Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes per Day
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={timeConstraints.availableTimePerDay}
                onChange={(e) => setTimeConstraints({
                  ...timeConstraints,
                  availableTimePerDay: parseInt(e.target.value) || 0
                })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes per Week
              </label>
              <input
                type="number"
                min="60"
                max="3360"
                value={timeConstraints.availableTimePerWeek}
                onChange={(e) => setTimeConstraints({
                  ...timeConstraints,
                  availableTimePerWeek: parseInt(e.target.value) || 0
                })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Deadline (Optional)
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={timeConstraints.targetDeadline?.toISOString().split('T')[0] || ''}
                onChange={(e) => setTimeConstraints({
                  ...timeConstraints,
                  targetDeadline: e.target.value ? new Date(e.target.value) : undefined
                })}
                className="input-field"
              />
            </div>
          </div>
          {getErrorMessage('timeConstraints') && (
            <p className="text-red-600 text-sm mt-2">{getErrorMessage('timeConstraints')}</p>
          )}
        </div>

        {/* General Errors */}
        {getErrorMessage('general') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{getErrorMessage('general')}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Path...
              </>
            ) : (
              <>
                Generate Learning Path
                →
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
