import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { roadmapsCatalog } from '../services/roadmapsCatalog'

type StepStatus = 'to_learn' | 'in_progress' | 'completed'

type StoredProgressState =
  | { completedStepIds: string[] }
  | { statuses: Record<string, StepStatus> }

const progressKey = (slug: string) => `career-roadmap-progress-${slug}`
const favoritesKey = 'career-roadmap-favorites'
const skillInventoryKey = 'career-skill-inventory'

const normalizeStatus = (value: any): StepStatus => {
  if (value === 'completed') return 'completed'
  if (value === 'in_progress') return 'in_progress'
  return 'to_learn'
}

const loadStatuses = (slug: string): Record<string, StepStatus> => {
  try {
    const raw = localStorage.getItem(progressKey(slug))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredProgressState
    if (parsed && typeof parsed === 'object' && 'statuses' in parsed && parsed.statuses && typeof parsed.statuses === 'object') {
      return Object.entries(parsed.statuses as Record<string, any>).reduce<Record<string, StepStatus>>((acc, [k, v]) => {
        acc[k] = normalizeStatus(v)
        return acc
      }, {})
    }
    if (parsed && typeof parsed === 'object' && 'completedStepIds' in parsed && Array.isArray(parsed.completedStepIds)) {
      return parsed.completedStepIds.reduce<Record<string, StepStatus>>((acc, id) => {
        acc[String(id)] = 'completed'
        return acc
      }, {})
    }
    return {}
  } catch {
    return {}
  }
}

const loadFavorites = (): Set<string> => {
  try {
    const raw = localStorage.getItem(favoritesKey)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.map(x => String(x)))
  } catch {
    return new Set()
  }
}

const loadInventory = (): string[] => {
  try {
    const raw = localStorage.getItem(skillInventoryKey)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(x => String(x)).filter(Boolean)
  } catch {
    return []
  }
}

const saveInventory = (items: string[]) => {
  try {
    localStorage.setItem(skillInventoryKey, JSON.stringify(items))
  } catch {}
}

const tokenize = (value: string) => value.toLowerCase().split(/[^a-z0-9+.#-]+/g).filter(Boolean)

const CareerDashboardPage = () => {
  const [inventoryText, setInventoryText] = useState(() => loadInventory().join(', '))

  const favorites = useMemo(() => loadFavorites(), [])

  const inventoryTokens = useMemo(() => {
    const items = inventoryText
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
    return new Set(items.flatMap(tokenize))
  }, [inventoryText])

  const summaries = useMemo(() => {
    return roadmapsCatalog.map(r => {
      const statuses = loadStatuses(r.slug)
      const stepIds = r.sections.flatMap(s => s.steps.map(st => st.id))
      const counts = stepIds.reduce(
        (acc, id) => {
          const st = statuses[id] || 'to_learn'
          if (st === 'completed') acc.completed += 1
          else if (st === 'in_progress') acc.inProgress += 1
          else acc.toLearn += 1
          return acc
        },
        { completed: 0, inProgress: 0, toLearn: 0 },
      )
      const weighted = counts.completed + counts.inProgress * 0.5
      const pct = stepIds.length > 0 ? Math.round((weighted / stepIds.length) * 100) : 0

      const required = new Set([...r.tags, ...r.sections.flatMap(s => s.steps.map(st => st.title))].flatMap(tokenize))
      const matched = Array.from(required).filter(t => inventoryTokens.has(t)).length
      const skillPct = required.size > 0 ? Math.round((matched / required.size) * 100) : 0
      const missingSkills = r.sections
        .flatMap(s => s.steps.map(st => st.title))
        .filter(title => {
          const toks = tokenize(title)
          return toks.length > 0 && !toks.some(t => inventoryTokens.has(t))
        })
        .slice(0, 8)

      return { roadmap: r, ...counts, pct, skillPct, missingSkills }
    })
  }, [inventoryTokens])

  const global = useMemo(() => {
    const total = summaries.reduce((sum, s) => sum + s.roadmap.sections.reduce((a, sec) => a + sec.steps.length, 0), 0)
    const completed = summaries.reduce((sum, s) => sum + s.completed, 0)
    const inProgress = summaries.reduce((sum, s) => sum + s.inProgress, 0)
    const weighted = completed + inProgress * 0.5
    const pct = total > 0 ? Math.round((weighted / total) * 100) : 0
    const started = summaries.filter(s => s.completed + s.inProgress > 0).length
    const favCount = favorites.size
    return { total, completed, inProgress, pct, started, favCount }
  }, [summaries, favorites.size])

  const certificationSuggestions = useMemo(() => {
    const map: Record<string, string[]> = {
      'web-development': ['AWS Cloud Practitioner', 'Meta Front-End Developer (Coursera)'],
      'ai-ml': ['Google ML Crash Course', 'TensorFlow Developer Certificate'],
      devops: ['AWS Cloud Practitioner', 'CKA (Kubernetes)'],
      cybersecurity: ['CompTIA Security+', 'CEH (optional)'],
      'data-science': ['Google Data Analytics', 'Microsoft DP-100'],
      'mobile-development': ['Associate Android Developer', 'Apple Swift Certification (optional)'],
    }
    const fav = summaries.filter(s => favorites.has(s.roadmap.slug))
    const active = summaries.filter(s => s.completed + s.inProgress > 0)
    const pool = (fav.length > 0 ? fav : active).slice(0, 2)
    return pool.flatMap(s => map[s.roadmap.slug] || []).slice(0, 6)
  }, [summaries, favorites])

  const saveInventoryNow = () => {
    const items = inventoryText
      .split(',')
      .map(x => x.trim())
      .filter(Boolean)
    saveInventory(items)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Saved paths, progress analytics, and skill-gap mapping.</div>
        </div>
        <Link to="/roadmaps" className="btn-secondary text-sm">Browse roadmaps</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-gray-500 dark:text-gray-400">Overall progress</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{global.pct}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${global.pct}%` }}></div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{global.completed} done · {global.inProgress} in progress</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-500 dark:text-gray-400">Roadmaps started</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{global.started}</div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Any in-progress or completed step</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-500 dark:text-gray-400">Saved paths</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{global.favCount}</div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Pinned roadmaps</div>
        </div>
        <div className="card">
          <div className="text-xs text-gray-500 dark:text-gray-400">Next suggestions</div>
          {certificationSuggestions.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">Save a roadmap to see recommendations.</div>
          ) : (
            <div className="mt-2 space-y-1">
              {certificationSuggestions.map(c => (
                <div key={c} className="text-sm text-gray-900 dark:text-white truncate">{c}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Skill-gap mapping</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add your current skills to estimate missing topics.</div>
          <textarea
            className="input-field mt-3 h-28 resize-none text-sm"
            value={inventoryText}
            onChange={(e) => setInventoryText(e.target.value)}
            placeholder="e.g., HTML, CSS, JavaScript, Git, Linux, SQL"
          />
          <button type="button" className="btn-secondary text-sm mt-3 w-full" onClick={saveInventoryNow}>
            Save skills
          </button>
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">How it works</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              The dashboard compares your skill keywords against roadmap tags and step titles to estimate coverage.
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Saved paths</div>
            {summaries.filter(s => favorites.has(s.roadmap.slug)).length === 0 ? (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">No saved roadmaps yet. Open a roadmap and hit “Save”.</div>
            ) : (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {summaries.filter(s => favorites.has(s.roadmap.slug)).map(s => (
                  <Link key={s.roadmap.slug} to={`/roadmaps/${s.roadmap.slug}`} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.roadmap.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.completed} done · {s.inProgress} in progress</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.pct}%</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${s.pct}%` }}></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Skill coverage by roadmap</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on your saved skills and roadmap keywords.</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {summaries.map(s => (
                <div key={s.roadmap.slug} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.roadmap.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Skill match: {s.skillPct}% · Progress: {s.pct}%
                      </div>
                    </div>
                    <Link to={`/roadmaps/${s.roadmap.slug}`} className="btn-secondary text-xs">Open</Link>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">Skill match</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${s.skillPct}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">Roadmap progress</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${s.pct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {s.missingSkills.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 mb-1">Likely missing topics</div>
                      <div className="flex flex-wrap gap-2">
                        {s.missingSkills.map(ms => (
                          <span key={ms} className="px-2 py-0.5 rounded-full text-[11px] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                            {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerDashboardPage

