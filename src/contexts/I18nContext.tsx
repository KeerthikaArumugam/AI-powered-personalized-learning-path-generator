import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Lang = 'en' | 'es'

type Dict = Record<string, string>

const dictionaries: Record<Lang, Dict> = {
  en: {
    app_title: 'Learning Path Generator',
    nav_home: 'Home',
    nav_dashboard: 'Dashboard',
    nav_roadmaps: 'Roadmaps',
    nav_generator: 'Learning Path',
    nav_library: 'Skill Library',
    nav_results: 'Roadmap Results',
    nav_progress: 'Progress',
    nav_retention: 'Retention Checker',
    nav_reflection: 'Reflection Feedback',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_analyzer: 'Difficulty Analyzer',
    nav_labs: 'Labs',
    dark: 'Dark',
    light: 'Light',
  },
  es: {
    app_title: 'Generador de Ruta de Aprendizaje',
    nav_home: 'Inicio',
    nav_dashboard: 'Panel',
    nav_roadmaps: 'Rutas',
    nav_generator: 'Ruta de Aprendizaje',
    nav_library: 'Biblioteca de Habilidades',
    nav_results: 'Resultados',
    nav_progress: 'Progreso',
    nav_retention: 'Verificador de Retención',
    nav_reflection: 'Retroalimentación de Reflexión',
    nav_about: 'Acerca de',
    nav_contact: 'Contacto',
    nav_analyzer: 'Analizador de Dificultad',
    nav_labs: 'Laboratorio',
    dark: 'Oscuro',
    light: 'Claro',
  },
}

interface I18nContextValue {
  lang: Lang
  t: (key: string) => string
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = useMemo(() => {
    const dict = dictionaries[lang]
    return (key: string) => dict[key] || key
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
