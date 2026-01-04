import { useState } from 'react'
import { Resource, UserProfile } from '../types'

interface ResourceListProps {
  resources: Resource[]
  learningStyle: UserProfile['learningStyle']
}

const ResourceList = ({ resources, learningStyle }: ResourceListProps) => {
  const [filterType, setFilterType] = useState<Resource['type'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<'time' | 'difficulty' | 'relevance'>('relevance')
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('bookmarks')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return '🎥'
      case 'article': return '📖'
      case 'course': return '🎓'
      case 'project': return '🛠️'
      case 'documentation': return '📋'
      default: return '📚'
    }
  }

  const getResourceColor = (type: Resource['type']) => {
    switch (type) {
      case 'video': return 'bg-red-50 text-red-700 border-red-200'
      case 'article': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'course': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'project': return 'bg-green-50 text-green-700 border-green-200'
      case 'documentation': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const isRecommendedForStyle = (resource: Resource) => {
    return resource.learningStyles.includes(learningStyle)
  }

  const filteredResources = resources.filter(resource => 
    filterType === 'all' || resource.type === filterType
  )

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return a.estimatedTime - b.estimatedTime
      case 'difficulty':
        return a.difficultyLevel - b.difficultyLevel
      case 'relevance':
        const aRelevant = isRecommendedForStyle(a) ? 1 : 0
        const bRelevant = isRecommendedForStyle(b) ? 1 : 0
        return bRelevant - aRelevant
      default:
        return 0
    }
  })

  const resourceTypes = Array.from(new Set(resources.map(r => r.type)))
  
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('bookmarks', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">All Learning Resources</h2>
        <div className="flex items-center space-x-4">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">🔍</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as Resource['type'] | 'all')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'time' | 'difficulty' | 'relevance')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="relevance">Relevance</option>
              <option value="time">Duration</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedResources.map((resource) => (
          <div 
            key={resource.id} 
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
              isRecommendedForStyle(resource) ? 'ring-2 ring-primary-200' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getResourceIcon(resource.type)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getResourceColor(resource.type)}`}>
                  {resource.type}
                </span>
              </div>
              
              {isRecommendedForStyle(resource) && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  Recommended
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center space-x-1"><span>⏱️</span><span>{resource.estimatedTime} min</span></div>
              <div className="flex items-center space-x-1"><span>📈</span><span>Level {resource.difficultyLevel}/10</span></div>
            </div>

            {/* Learning Styles */}
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.learningStyles.map((style) => (
                <span
                  key={style}
                  className={`px-2 py-1 rounded text-xs ${
                    style === learningStyle
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {style}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2">
              <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1">
                <span>Start Learning</span>
                <span>🔗</span>
              </button>
              <button
                aria-label="Bookmark"
                onClick={() => toggleBookmark(resource.id)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  bookmarks[resource.id] 
                    ? 'bg-yellow-100 border-yellow-200 text-yellow-800' 
                    : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                {bookmarks[resource.id] ? '★' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedResources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No resources found for the selected filter.
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{resources.length}</div>
            <div className="text-sm text-gray-600">Total Resources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(resources.reduce((sum, r) => sum + r.estimatedTime, 0) / 60)}h
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {resources.filter(r => isRecommendedForStyle(r)).length}
            </div>
            <div className="text-sm text-gray-600">Recommended</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(resources.reduce((sum, r) => sum + r.difficultyLevel, 0) / resources.length)}
            </div>
            <div className="text-sm text-gray-600">Avg Difficulty</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceList
