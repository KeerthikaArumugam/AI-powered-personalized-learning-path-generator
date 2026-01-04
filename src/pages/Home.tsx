import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { roadmapsCatalog } from '../services/roadmapsCatalog'

const getSpeechRecognition = () => {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

const cleanupSearchText = (value: string) => {
  return value
    .replace(/[^\p{L}\p{N}\s+.#-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const normalizeSearchText = (value: string) => cleanupSearchText(value).toLowerCase()

const Home = () => {
  const [query, setQuery] = useState('')
  const [voiceSupported] = useState(() => !!getSpeechRecognition())
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'error'>('idle')
  const recognitionRef = useRef<any>(null)

  const filtered = useMemo(() => {
    const q = normalizeSearchText(query)
    if (!q) return roadmapsCatalog
    const tokens = q.split(' ').filter(Boolean)
    return roadmapsCatalog.filter(r => {
      const hay = normalizeSearchText(`${r.title} ${r.description} ${r.tags.join(' ')}`)
      return tokens.every(t => hay.includes(t))
    })
  }, [query])

  const startListening = () => {
    const SR = getSpeechRecognition()
    if (!SR) return
    if (voiceState === 'listening') return
    try {
      recognitionRef.current?.stop?.()
    } catch {}

    const rec = new SR()
    recognitionRef.current = rec
    setVoiceState('listening')

    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event: any) => {
      const results = Array.from(event.results || [])
      const transcript = results.map((r: any) => String(r[0]?.transcript || '')).join(' ').trim()
      if (transcript) setQuery(cleanupSearchText(transcript))
      const last = event.results?.[event.results.length - 1]
      if (last?.isFinal) {
        try {
          rec.stop()
        } catch {}
      }
    }

    rec.onerror = () => setVoiceState('error')
    rec.onend = () => setVoiceState((s) => (s === 'error' ? 'error' : 'idle'))

    try {
      rec.start()
    } catch {
      setVoiceState('error')
    }
  }

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.()
      } catch {}
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium mb-4">
              Minimalist learning roadmaps for developers
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Browse structured skill roadmaps
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Step-by-step milestones with resources, progress tracking, and a distraction-free layout inspired by roadmap.sh.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2">
                <input
                  className="input-field"
                  placeholder="Search roadmaps… (Web, AI/ML, DevOps, Data Science)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-secondary px-4 py-2.5 whitespace-nowrap"
                  onClick={startListening}
                  disabled={!voiceSupported || voiceState === 'listening'}
                >
                  {voiceState === 'listening' ? 'Listening' : 'Mic'}
                </button>
              </div>
              <Link to="/generator" className="btn-secondary px-5 py-2.5">
                Generate personalized path
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Featured roadmaps</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">Career paths</div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} roadmap{filtered.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Link
              key={r.slug}
              to={`/roadmaps/${r.slug}`}
              className="card hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white truncate">{r.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {r.description}
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {r.level}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.slice(0, 4).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[11px] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-gray-500 dark:text-gray-400">{r.sections.length} sections</div>
                <div className="text-primary-700 dark:text-primary-300">Open →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
