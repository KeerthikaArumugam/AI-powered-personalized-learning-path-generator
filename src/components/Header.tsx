import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Home, Library, GitBranch as RouteIcon, BarChart3, Info, Mail, Moon, Sun, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '../contexts/I18nContext'

const Header = () => {
  const location = useLocation()
  const { t, lang, setLang } = useI18n()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    const isDark = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    setDark(isDark)
  }, [])
  
  const toggleTheme = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  const navItems = [
    { path: '/', label: t('nav_home'), icon: Home },
    { path: '/generator', label: t('nav_generator'), icon: BookOpen },
    { path: '/library', label: t('nav_library'), icon: Library },
    { path: '/results', label: t('nav_results'), icon: RouteIcon },
    { path: '/progress', label: t('nav_progress'), icon: BarChart3 },
    { path: '/about', label: t('nav_about'), icon: Info },
    { path: '/contact', label: t('nav_contact'), icon: Mail },
  ]

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('app_title')}
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-200" />
            </button>
          </div>
        </div>
        
        {isMobileOpen && (
          <nav className="md:hidden py-2 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
