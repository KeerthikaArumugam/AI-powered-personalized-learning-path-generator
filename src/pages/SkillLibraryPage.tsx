import { useMemo } from 'react'
import ResourceList from '../components/ResourceList'
import { Resource } from '../types'

interface SkillLibraryPageProps {
  resources?: Resource[]
  learningStyle?: 'videos' | 'reading' | 'hands-on' | 'mixed'
}

const SkillLibraryPage = ({ resources, learningStyle = 'mixed' }: SkillLibraryPageProps) => {
  const placeholderResources: Resource[] = useMemo(() => ([
    { id: 'r1', type: 'video', title: 'Intro to Web Dev', description: 'Start with HTML, CSS, and modern JS', estimatedTime: 90, difficultyLevel: 2, learningStyles: ['videos', 'mixed'], url: '#' },
    { id: 'r2', type: 'article', title: 'Responsive Design Basics', description: 'Learn mobile-first patterns and accessibility', estimatedTime: 45, difficultyLevel: 3, learningStyles: ['reading', 'mixed'], url: '#' },
    { id: 'r3', type: 'course', title: 'React Fundamentals', description: 'Component-driven development with React', estimatedTime: 240, difficultyLevel: 4, learningStyles: ['videos', 'reading', 'mixed'], url: '#' },
    { id: 'r4', type: 'project', title: 'Build a Portfolio Site', description: 'Hands-on project with deployment', estimatedTime: 180, difficultyLevel: 5, learningStyles: ['hands-on', 'mixed'], url: '#' },
    { id: 'r5', type: 'documentation', title: 'MDN Web Docs', description: 'Canonical reference for web APIs', estimatedTime: 60, difficultyLevel: 3, learningStyles: ['reading', 'mixed'], url: '#' },
  ]), [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Library</h1>
        <p className="text-gray-600 dark:text-gray-300">Curated resources by type and difficulty.</p>
      </div>
      <ResourceList 
        resources={(resources && resources.length > 0) ? resources : placeholderResources} 
        learningStyle={learningStyle} 
      />
    </div>
  )
}

export default SkillLibraryPage

