import { 
  UserProfile, 
  LearningPath, 
  LearningPhase, 
  SkillGap, 
  Topic, 
  Milestone, 
  Resource, 
  Assessment 
} from '../types'

// Mock knowledge base for demonstration
const knowledgeBase = {
  'web-development': {
    prerequisites: [],
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    estimatedHours: 120
  },
  'data-science': {
    prerequisites: [],
    topics: ['Python', 'Statistics', 'Pandas', 'Machine Learning', 'Data Visualization'],
    estimatedHours: 150
  },
  'mobile-development': {
    prerequisites: ['programming-basics'],
    topics: ['React Native', 'Flutter', 'iOS Development', 'Android Development'],
    estimatedHours: 100
  }
}

export const generateLearningPath = async (profile: UserProfile): Promise<LearningPath> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Analyze skill gaps
  const skillGaps = analyzeSkillGaps(profile)
  
  // Generate learning phases
  const phases = generatePhases(profile, skillGaps)
  
  // Calculate estimated duration
  const totalHours = phases.reduce((sum, phase) => sum + phase.estimatedTime, 0)
  const weeksNeeded = Math.ceil(totalHours / (profile.timeConstraints.availableTimePerWeek / 60))

  const learningPath: LearningPath = {
    id: `path-${Date.now()}`,
    userId: 'user-1',
    objective: profile.learningGoal.description,
    skillGapAnalysis: skillGaps,
    phases,
    estimatedDuration: weeksNeeded,
    createdAt: new Date(),
    lastModified: new Date()
  }

  return learningPath
}

const analyzeSkillGaps = (profile: UserProfile): SkillGap[] => {
  const gaps: SkillGap[] = []
  
  // Extract skills from goal description (simplified)
  const goalKeywords = profile.learningGoal.description.toLowerCase()
  
  if (goalKeywords.includes('web') || goalKeywords.includes('frontend') || goalKeywords.includes('react')) {
    gaps.push({
      id: 'gap-1',
      skill: 'Frontend Development',
      currentLevel: profile.skillLevel === 'beginner' ? 1 : profile.skillLevel === 'intermediate' ? 3 : 5,
      targetLevel: 7,
      priority: 'high'
    })
  }
  
  if (goalKeywords.includes('backend') || goalKeywords.includes('api') || goalKeywords.includes('server')) {
    gaps.push({
      id: 'gap-2',
      skill: 'Backend Development',
      currentLevel: profile.skillLevel === 'beginner' ? 1 : profile.skillLevel === 'intermediate' ? 2 : 4,
      targetLevel: 6,
      priority: 'high'
    })
  }
  
  if (goalKeywords.includes('data') || goalKeywords.includes('analytics') || goalKeywords.includes('ml')) {
    gaps.push({
      id: 'gap-3',
      skill: 'Data Analysis',
      currentLevel: profile.skillLevel === 'beginner' ? 0 : profile.skillLevel === 'intermediate' ? 2 : 4,
      targetLevel: 6,
      priority: 'medium'
    })
  }

  return gaps
}

const generatePhases = (profile: UserProfile, skillGaps: SkillGap[]): LearningPhase[] => {
  const phases: LearningPhase[] = []
  
  // Phase 1: Foundations
  phases.push({
    id: 'phase-1',
    title: 'Foundation & Setup',
    topics: generateTopics(['Development Environment', 'Basic Concepts', 'Tools Setup']),
    estimatedTime: 20,
    difficultyLevel: 2,
    prerequisites: [],
    milestones: generateMilestones(['Environment Setup Complete', 'Basic Concepts Understood']),
    resources: generateResources(profile.learningStyle, 'foundation'),
    assessments: generateAssessments('foundation')
  })

  // Phase 2: Core Skills
  if (skillGaps.some(gap => gap.skill.includes('Frontend'))) {
    phases.push({
      id: 'phase-2',
      title: 'Frontend Development Fundamentals',
      topics: generateTopics(['HTML & CSS', 'JavaScript Basics', 'DOM Manipulation', 'Responsive Design']),
      estimatedTime: 40,
      difficultyLevel: 4,
      prerequisites: ['phase-1'],
      milestones: generateMilestones(['First Web Page Created', 'Interactive Features Added']),
      resources: generateResources(profile.learningStyle, 'frontend'),
      assessments: generateAssessments('frontend')
    })
  }

  // Phase 3: Advanced Topics
  phases.push({
    id: 'phase-3',
    title: 'Advanced Implementation',
    topics: generateTopics(['Framework Integration', 'Best Practices', 'Project Development']),
    estimatedTime: 60,
    difficultyLevel: 6,
    prerequisites: phases.length > 1 ? ['phase-2'] : ['phase-1'],
    milestones: generateMilestones(['Framework Mastery', 'Complete Project Built']),
    resources: generateResources(profile.learningStyle, 'advanced'),
    assessments: generateAssessments('advanced')
  })

  return phases
}

const generateTopics = (topicNames: string[]): Topic[] => {
  return topicNames.map((name, index) => ({
    id: `topic-${index + 1}`,
    name,
    description: `Learn about ${name.toLowerCase()} and its practical applications`,
    subtopics: [`${name} Basics`, `${name} Best Practices`, `${name} Advanced Concepts`]
  }))
}

const generateMilestones = (milestoneNames: string[]): Milestone[] => {
  return milestoneNames.map((name, index) => ({
    id: `milestone-${index + 1}`,
    title: name,
    description: `Complete ${name.toLowerCase()} successfully`,
    criteria: [
      'Demonstrate understanding through practical exercise',
      'Complete all related assessments',
      'Apply knowledge in a real scenario'
    ],
    completed: false
  }))
}

const generateResources = (learningStyle: UserProfile['learningStyle'], category: string): Resource[] => {
  const baseResources: Resource[] = []
  
  if (learningStyle === 'videos' || learningStyle === 'mixed') {
    baseResources.push({
      id: `video-${category}`,
      type: 'video',
      title: `${category} Video Course`,
      description: `Comprehensive video tutorial covering ${category} concepts`,
      estimatedTime: 180,
      difficultyLevel: 3,
      learningStyles: ['videos', 'mixed']
    })
  }
  
  if (learningStyle === 'reading' || learningStyle === 'mixed') {
    baseResources.push({
      id: `article-${category}`,
      type: 'article',
      title: `${category} Documentation`,
      description: `In-depth written guide for ${category}`,
      estimatedTime: 120,
      difficultyLevel: 4,
      learningStyles: ['reading', 'mixed']
    })
  }
  
  if (learningStyle === 'hands-on' || learningStyle === 'mixed') {
    baseResources.push({
      id: `project-${category}`,
      type: 'project',
      title: `${category} Hands-on Project`,
      description: `Practical project to apply ${category} skills`,
      estimatedTime: 240,
      difficultyLevel: 5,
      learningStyles: ['hands-on', 'mixed']
    })
  }

  return baseResources
}

const generateAssessments = (category: string): Assessment[] => {
  return [
    {
      id: `quiz-${category}`,
      type: 'quiz',
      title: `${category} Knowledge Check`,
      description: `Test your understanding of ${category} concepts`,
      estimatedTime: 30,
      passingCriteria: '80% correct answers'
    },
    {
      id: `exercise-${category}`,
      type: 'exercise',
      title: `${category} Practical Exercise`,
      description: `Apply ${category} skills in a practical scenario`,
      estimatedTime: 60,
      passingCriteria: 'Complete all required tasks successfully'
    }
  ]
}