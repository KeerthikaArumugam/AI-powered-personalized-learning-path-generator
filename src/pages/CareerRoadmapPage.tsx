import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CareerRoadmap, RoadmapSection, RoadmapStep, findRoadmapBySlug } from '../services/roadmapsCatalog'
import { addUserVideo, getRankedVideos, isVideoLiked, toggleVideoLiked } from '../services/videoRecommendations'

type StepStatus = 'to_learn' | 'in_progress' | 'completed'

type StoredProgressState =
  | { completedStepIds: string[] }
  | { statuses: Record<string, StepStatus> }

const completedKey = (slug: string) => `career-roadmap-progress-${slug}`

const normalizeStatus = (value: any): StepStatus => {
  if (value === 'completed') return 'completed'
  if (value === 'in_progress') return 'in_progress'
  return 'to_learn'
}

const loadStatuses = (slug: string): Record<string, StepStatus> => {
  try {
    const raw = localStorage.getItem(completedKey(slug))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredProgressState
    if (parsed && typeof parsed === 'object' && 'statuses' in parsed && parsed.statuses && typeof parsed.statuses === 'object') {
      const entries = Object.entries(parsed.statuses as Record<string, any>)
      return entries.reduce<Record<string, StepStatus>>((acc, [k, v]) => {
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

const persistStatuses = (slug: string, statuses: Record<string, StepStatus>) => {
  try {
    const payload: StoredProgressState = { statuses }
    localStorage.setItem(completedKey(slug), JSON.stringify(payload))
  } catch {}
}

const flattenSteps = (roadmap: CareerRoadmap) => {
  const items: { section: RoadmapSection; step: RoadmapStep }[] = []
  roadmap.sections.forEach(section => {
    section.steps.forEach(step => items.push({ section, step }))
  })
  return items
}

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = value
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return true
    } catch {
      return false
    }
  }
}

const getSpeechRecognition = () => {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

const favoritesKey = 'career-roadmap-favorites'

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

const persistFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favorites)))
  } catch {}
}

const CareerRoadmapPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const roadmap = useMemo(() => (slug ? findRoadmapBySlug(slug) : null), [slug])
  const allSteps = useMemo(() => (roadmap ? flattenSteps(roadmap) : []), [roadmap])

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (!roadmap) return new Set()
    return new Set(roadmap.sections.map((s, idx) => (idx === 0 ? s.id : '')).filter(Boolean))
  })
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const first = allSteps[0]?.step.id
    return first || null
  })

  const [statuses, setStatuses] = useState<Record<string, StepStatus>>(() => (slug ? loadStatuses(slug) : {}))
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  const [voiceSupported] = useState(() => !!getSpeechRecognition())
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'error'>('idle')
  const [lastHeard, setLastHeard] = useState('')
  const recognitionRef = useRef<any>(null)

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  const [preferredUrl, setPreferredUrl] = useState('')
  const [preferredTitle, setPreferredTitle] = useState('')

  useEffect(() => {
    if (!slug) return
    setStatuses(loadStatuses(slug))
  }, [slug])

  useEffect(() => {
    if (!roadmap) return
    setExpandedSections(new Set(roadmap.sections.map((s, idx) => (idx === 0 ? s.id : '')).filter(Boolean)))
  }, [roadmap])

  useEffect(() => {
    const first = allSteps[0]?.step.id || null
    setSelectedId(first)
  }, [roadmap?.slug])

  const selected = useMemo(() => {
    if (!selectedId) return null
    return allSteps.find(x => x.step.id === selectedId) || null
  }, [allSteps, selectedId])

  const selectedStatus: StepStatus = useMemo(() => {
    if (!selected) return 'to_learn'
    return statuses[selected.step.id] || 'to_learn'
  }, [selected, statuses])

  const progress = useMemo(() => {
    const total = allSteps.length
    const byId = new Map(allSteps.map(s => [s.step.id, true]))
    const counts = Object.entries(statuses).reduce(
      (acc, [id, st]) => {
        if (!byId.has(id)) return acc
        if (st === 'completed') acc.completed += 1
        else if (st === 'in_progress') acc.inProgress += 1
        else acc.toLearn += 1
        return acc
      },
      { completed: 0, inProgress: 0, toLearn: 0 },
    )
    const counted = counts.completed + counts.inProgress + counts.toLearn
    const remaining = Math.max(0, total - counted)
    counts.toLearn += remaining
    const weighted = counts.completed + counts.inProgress * 0.5
    const pct = total > 0 ? Math.round((weighted / total) * 100) : 0
    return { total, ...counts, pct }
  }, [allSteps, statuses])

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    if (!roadmap) return
    setExpandedSections(new Set(roadmap.sections.map(s => s.id)))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  const setStatus = (stepId: string, nextStatus: StepStatus) => {
    if (!slug) return
    setStatuses(prev => {
      const next: Record<string, StepStatus> = { ...prev, [stepId]: nextStatus }
      persistStatuses(slug, next)
      return next
    })
  }

  const cycleStatus = (stepId: string) => {
    const current = statuses[stepId] || 'to_learn'
    const next: StepStatus = current === 'to_learn' ? 'in_progress' : current === 'in_progress' ? 'completed' : 'to_learn'
    setStatus(stepId, next)
  }

  const openNext = () => {
    const idx = selectedId ? allSteps.findIndex(x => x.step.id === selectedId) : -1
    const after = idx >= 0 ? allSteps.slice(idx + 1) : allSteps
    const isDone = (id: string) => (statuses[id] || 'to_learn') === 'completed'
    const next = after.find(x => !isDone(x.step.id)) || allSteps.find(x => !isDone(x.step.id)) || allSteps[0]
    if (!next) return
    setSelectedId(next.step.id)
    const el = document.getElementById(`roadmap-step-${next.step.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const share = async () => {
    const url = window.location.href
    const ok = await copyToClipboard(url)
    setShareState(ok ? 'copied' : 'failed')
    window.setTimeout(() => setShareState('idle'), 2000)
  }

  const toggleFavorite = () => {
    if (!slug) return
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      persistFavorites(next)
      return next
    })
  }

  const startListening = () => {
    const SR = getSpeechRecognition()
    if (!SR) return
    if (voiceState === 'listening') return
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.stop?.()
      }
    } catch {}

    const rec = new SR()
    recognitionRef.current = rec
    setVoiceState('listening')
    setLastHeard('')

    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event: any) => {
      const results = Array.from(event.results || [])
      const transcript = results.map((r: any) => String(r[0]?.transcript || '')).join(' ').trim()
      if (!transcript) return
      setLastHeard(transcript)
      const last = event.results?.[event.results.length - 1]
      const isFinal = !!last?.isFinal
      if (!isFinal) return

      const normalized = transcript.toLowerCase().trim()
      if (normalized.startsWith('open ')) {
        const q = normalized.slice(5).trim()
        const match = allSteps.find(s => s.step.title.toLowerCase().includes(q)) || allSteps.find(s => s.step.description.toLowerCase().includes(q))
        if (match) setSelectedId(match.step.id)
      } else if (normalized.includes('next')) {
        openNext()
      } else if (normalized.includes('mark') && selected) {
        if (normalized.includes('done') || normalized.includes('complete')) setStatus(selected.step.id, 'completed')
        else if (normalized.includes('progress')) setStatus(selected.step.id, 'in_progress')
        else if (normalized.includes('learn') || normalized.includes('to learn')) setStatus(selected.step.id, 'to_learn')
      } else if (selected) {
        const match = allSteps.find(s => s.step.title.toLowerCase().includes(normalized)) || allSteps.find(s => s.step.description.toLowerCase().includes(normalized))
        if (match) setSelectedId(match.step.id)
      }
    }

    rec.onerror = () => {
      setVoiceState('error')
    }

    rec.onend = () => {
      setVoiceState((s) => (s === 'error' ? 'error' : 'idle'))
    }

    try {
      rec.start()
    } catch {
      setVoiceState('error')
    }
  }

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.()
    } catch {}
  }

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.()
      } catch {}
    }
  }, [])

  const clampZoom = (next: number) => Math.min(1.6, Math.max(0.7, next))

  const startPan = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement | null
    if (el && el.closest('button, a, input, textarea, select')) return
    panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    ;(e.currentTarget as any).setPointerCapture?.(e.pointerId)
  }

  const movePan = (e: PointerEvent<HTMLDivElement>) => {
    if (!panStartRef.current) return
    const dx = e.clientX - panStartRef.current.x
    const dy = e.clientY - panStartRef.current.y
    setPan({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy })
  }

  const endPan = () => {
    panStartRef.current = null
  }

  const selectedVideos = useMemo(() => {
    if (!selected) return []
    const result = getRankedVideos({ topic: selected.step.title })
    return result.items.slice(0, 4)
  }, [selected])

  const addPreferredVideoForSelected = () => {
    if (!selected) return
    if (!preferredUrl.trim()) return
    addUserVideo(selected.step.title, preferredUrl, preferredTitle)
    setPreferredUrl('')
    setPreferredTitle('')
  }

  if (!slug || !roadmap) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">Roadmap not found</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            The requested roadmap doesn’t exist. Browse available roadmaps to continue.
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Go back
            </button>
            <Link to="/roadmaps" className="btn-primary">
              Browse roadmaps
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link to="/roadmaps" className="hover:underline">Roadmaps</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 dark:text-gray-200">{roadmap.title}</span>
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{roadmap.title}</div>
          <div className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">{roadmap.description}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary text-sm" onClick={() => window.print()}>
            Download PDF
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={toggleFavorite}>
            {favorites.has(slug) ? 'Saved' : 'Save'}
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={share}>
            {shareState === 'copied' ? 'Link copied' : shareState === 'failed' ? 'Copy failed' : 'Share'}
          </button>
          <button type="button" className="btn-primary text-sm" onClick={openNext}>
            Next incomplete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="card p-0 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Roadmap</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {progress.completed}/{progress.total} completed · {progress.inProgress} in progress
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <button type="button" className="btn-secondary text-xs" onClick={expandAll}>
                  Expand all
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={collapseAll}>
                  Collapse all
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => setZoom(z => clampZoom(z - 0.1))}>
                  −
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => setZoom(z => clampZoom(z + 0.1))}>
                  +
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}>
                  Reset view
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-28 sm:w-36 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progress.pct}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{progress.pct}%</div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div
              className="space-y-6 select-none"
              onPointerDown={startPan}
              onPointerMove={movePan}
              onPointerUp={endPan}
              onPointerCancel={endPan}
              style={{ touchAction: 'none' }}
            >
              <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
                <div className="space-y-6 select-text">
              {roadmap.sections.map((section) => {
                const open = expandedSections.has(section.id)
                return (
                  <div key={section.id} className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full text-left flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{section.description}</div>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">{open ? '−' : '+'}</div>
                    </button>

                    {open && (
                      <div className="relative pl-6">
                        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="space-y-4">
                          {section.steps.map((step) => {
                            const isSelected = selectedId === step.id
                            const status: StepStatus = statuses[step.id] || 'to_learn'
                            const done = status === 'completed'
                            const inProgress = status === 'in_progress'
                            return (
                              <div key={step.id} id={`roadmap-step-${step.id}`} className="relative">
                                <div className="absolute -left-[3px] top-3">
                                  <div
                                    className={`w-3 h-3 rounded-full border ${
                                      done
                                        ? 'bg-green-500 border-green-500'
                                        : inProgress
                                          ? 'bg-primary-600 border-primary-600'
                                          : isSelected
                                            ? 'bg-gray-700 border-gray-700'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                    }`}
                                  ></div>
                                </div>

                                <div className={`rounded-xl border p-4 ${isSelected ? 'border-primary-300 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <button
                                      type="button"
                                      className="text-left min-w-0"
                                      onClick={() => setSelectedId(step.id)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {step.title}
                                        </div>
                                        {done ? (
                                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                                            ✓ done
                                          </span>
                                        ) : inProgress ? (
                                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                                            ◐ in progress
                                          </span>
                                        ) : null}
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                        {step.description}
                                      </div>
                                    </button>

                                    <button
                                      type="button"
                                      className={`px-2 py-1 rounded-lg text-xs border ${
                                        done
                                          ? 'bg-green-50 border-green-200 text-green-800'
                                          : inProgress
                                            ? 'bg-primary-50 border-primary-200 text-primary-800'
                                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                                      }`}
                                      onClick={() => cycleStatus(step.id)}
                                    >
                                      {done ? 'Completed' : inProgress ? 'In progress' : 'To learn'}
                                    </button>
                                  </div>

                                  {isSelected && step.resources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Resources</div>
                                      <div className="space-y-1">
                                        {step.resources.map((r) => (
                                          <a
                                            key={`${step.id}-${r.url}`}
                                            href={r.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:border-gray-300 dark:hover:border-gray-600"
                                          >
                                            <div className="min-w-0">
                                              <div className="text-gray-900 dark:text-white truncate">{r.title}</div>
                                              <div className="text-gray-500 dark:text-gray-400">{r.type}</div>
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400">↗</div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Details</div>
            {!selected ? (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Select a step to see details.</div>
            ) : (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{selected.step.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{selected.step.description}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Section: <span className="text-gray-700 dark:text-gray-200">{selected.section.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="btn-secondary text-xs" onClick={() => cycleStatus(selected.step.id)}>
                      {selectedStatus === 'completed' ? 'Completed' : selectedStatus === 'in_progress' ? 'In progress' : 'To learn'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-xs"
                      onClick={() => {
                        if (voiceState === 'listening') stopListening()
                        else startListening()
                      }}
                      disabled={!voiceSupported}
                    >
                      {voiceState === 'listening' ? 'Listening' : 'Mic'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Resources</div>
                  {selected.step.resources.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400">No resources added yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {selected.step.resources.map((r) => (
                        <a
                          key={`${selected.step.id}-panel-${r.url}`}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block border border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:border-gray-300 dark:hover:border-gray-600"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.type}</div>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">↗</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Recommended videos</div>
                  {selectedVideos.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400">No videos found yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedVideos.map((v) => {
                        const liked = isVideoLiked(selected.step.title, v.id)
                        return (
                          <div
                            key={v.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <a
                                href={v.url}
                                target="_blank"
                                rel="noreferrer"
                                className="min-w-0"
                              >
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {v.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {v.label} · {v.difficulty}{v.durationMinutes > 0 ? ` · ${v.durationMinutes}m` : ''}
                                </div>
                              </a>
                              <button
                                type="button"
                                className="btn-secondary text-xs whitespace-nowrap"
                                onClick={() => toggleVideoLiked(selected.step.title, v.id)}
                              >
                                {liked ? 'Saved' : 'Save'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Add preferred video</div>
                  <div className="space-y-2">
                    <input
                      className="input-field text-sm"
                      placeholder="Paste a video URL"
                      value={preferredUrl}
                      onChange={(e) => setPreferredUrl(e.target.value)}
                    />
                    <input
                      className="input-field text-sm"
                      placeholder="Optional title"
                      value={preferredTitle}
                      onChange={(e) => setPreferredTitle(e.target.value)}
                    />
                    <button type="button" className="btn-secondary text-xs w-full" onClick={addPreferredVideoForSelected}>
                      Add video
                    </button>
                  </div>
                </div>

                {lastHeard && (
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Heard: {lastHeard}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {roadmap.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-[11px] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerRoadmapPage
