import { Link, useLocation } from 'react-router-dom'
import { BookOpen, User, BarChart3 } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Profile Setup', icon: User },
    { path: '/learning-path', label: 'Learning Path', icon: BookOpen },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Learning Path Generator
            </h1>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header