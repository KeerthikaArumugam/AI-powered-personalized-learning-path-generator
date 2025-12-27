import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, Layers, BarChart3 } from 'lucide-react'

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" /> AI-Powered Personalization
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Build your personalized learning path
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Adaptive roadmaps, skill gap analysis, weekly study plans, and progress insights — designed for modern learners.
            </p>
            <div className="flex gap-3">
              <Link to="/generator" className="btn-primary px-6 py-3 text-lg">Get Started</Link>
              <Link to="/library" className="btn-secondary px-6 py-3 text-lg">Explore Skills</Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Adaptive Path</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Updates based on progress and feedback.</p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Modes</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Beginner, Intermediate, Fast-Track, Career Switch.</p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Analytics</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Milestones, proficiency meters, insights.</p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Support</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Notes, bookmarks, reminders, and quizzes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

