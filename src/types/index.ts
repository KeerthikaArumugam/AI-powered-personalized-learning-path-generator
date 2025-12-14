// Core interfaces from design document

export interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  backgroundKnowledge: string[];
  learningGoal: LearningGoal;
  learningStyle: 'videos' | 'reading' | 'hands-on' | 'mixed';
  timeConstraints: TimeConstraints;
  difficultyPace: 'slow' | 'moderate' | 'fast';
}

export interface LearningGoal {
  type: 'job-role' | 'exam' | 'project' | 'specific-skill';
  description: string;
  targetCompetencies: string[];
}

export interface TimeConstraints {
  availableTimePerDay: number; // minutes
  availableTimePerWeek: number; // minutes
  targetDeadline?: Date;
}

export interface LearningPath {
  id: string;
  userId: string;
  objective: string;
  skillGapAnalysis: SkillGap[];
  phases: LearningPhase[];
  estimatedDuration: number; // weeks
  createdAt: Date;
  lastModified: Date;
}

export interface LearningPhase {
  id: string;
  title: string;
  topics: Topic[];
  estimatedTime: number; // hours
  difficultyLevel: number; // 1-10
  prerequisites: string[];
  milestones: Milestone[];
  resources: Resource[];
  assessments: Assessment[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  criteria: string[];
  completed: boolean;
}

export interface Resource {
  id: string;
  type: 'video' | 'article' | 'course' | 'documentation' | 'project';
  title: string;
  description: string;
  estimatedTime: number; // minutes
  difficultyLevel: number;
  learningStyles: string[];
  url?: string;
}

export interface Assessment {
  id: string;
  type: 'quiz' | 'project' | 'exercise' | 'self-check';
  title: string;
  description: string;
  estimatedTime: number;
  passingCriteria: string;
}

export interface SkillGap {
  id: string;
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ProgressRecord {
  userId: string;
  pathId: string;
  currentPhase: number;
  completedMilestones: string[];
  timeSpent: number; // minutes
  lastActivity: Date;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
}