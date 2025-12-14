import { UserProfile, ValidationError } from '../types'

export const validateProfile = (profile: UserProfile): ValidationError[] => {
  const errors: ValidationError[] = []

  // Validate skill level
  if (!profile.skillLevel) {
    errors.push({ field: 'skillLevel', message: 'Please select your skill level' })
  }

  // Validate learning goal description
  if (!profile.learningGoal.description.trim()) {
    errors.push({ 
      field: 'learningGoal.description', 
      message: 'Please describe your learning goal' 
    })
  }

  // Validate time constraints
  if (profile.timeConstraints.availableTimePerDay < 15) {
    errors.push({ 
      field: 'timeConstraints', 
      message: 'Please allocate at least 15 minutes per day for learning' 
    })
  }

  if (profile.timeConstraints.availableTimePerWeek < 60) {
    errors.push({ 
      field: 'timeConstraints', 
      message: 'Please allocate at least 1 hour per week for learning' 
    })
  }

  // Validate deadline is in the future
  if (profile.timeConstraints.targetDeadline) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (profile.timeConstraints.targetDeadline <= today) {
      errors.push({ 
        field: 'timeConstraints', 
        message: 'Target deadline must be in the future' 
      })
    }
  }

  // Check for time constraint conflicts
  const dailyToWeekly = profile.timeConstraints.availableTimePerDay * 7
  if (dailyToWeekly > profile.timeConstraints.availableTimePerWeek * 1.5) {
    errors.push({ 
      field: 'timeConstraints', 
      message: 'Daily time commitment seems inconsistent with weekly availability' 
    })
  }

  return errors
}

export const validateTimeConstraints = (
  availableTimePerDay: number,
  availableTimePerWeek: number,
  targetDeadline?: Date
): ValidationError[] => {
  const errors: ValidationError[] = []

  if (availableTimePerDay < 15) {
    errors.push({ 
      field: 'availableTimePerDay', 
      message: 'Minimum 15 minutes per day required' 
    })
  }

  if (availableTimePerWeek < 60) {
    errors.push({ 
      field: 'availableTimePerWeek', 
      message: 'Minimum 1 hour per week required' 
    })
  }

  if (targetDeadline && targetDeadline <= new Date()) {
    errors.push({ 
      field: 'targetDeadline', 
      message: 'Deadline must be in the future' 
    })
  }

  return errors
}