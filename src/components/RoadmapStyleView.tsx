import { useEffect, useMemo, useRef, useState } from 'react'
import { LearningPath } from '../types'
import { generateRecommendations } from '../services/pathGenerator'
import { addUserVideo, getRankedVideos } from '../services/videoRecommendations'

type DifficultySignal = 'Easy' | 'Moderate' | 'Difficult'

type TopicRef = {
  phaseId: string
  topicId: string
  name: string
  description: string
  subtopics: string[]
  phaseTitle: string
  phaseDifficulty: number
  phasePrereqIds: string[]
}

type DifficultySnapshot = {
  name: string
  level: DifficultySignal
}

const loadDifficulty = (): DifficultySnapshot[] => {
  try {
    const raw = localStorage.getItem('concept-difficulty-results')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((x: any) => ({
      name: String(x.name),
      level: x.level === 'Difficult' ? 'Difficult' : x.level === 'Moderate' ? 'Moderate' : 'Easy',
    }))
  } catch {
    return []
  }
}

const loadWeakSnapshot = (): { date: string; topics: string[] } | null => {
  try {
    const raw = localStorage.getItem('retention-weak-topics')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (!Array.isArray((parsed as any).topics)) return null
    return { date: String((parsed as any).date || ''), topics: (parsed as any).topics as string[] }
  } catch {
    return null
  }
}

const getSpeechRecognition = () => {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

interface RoadmapStyleViewProps {
  learningPath: LearningPath
}

const RoadmapStyleView = ({ learningPath }: RoadmapStyleViewProps) => {
  const topics = useMemo<TopicRef[]>(() => {
    return learningPath.phases.flatMap((p) =>
      p.topics.map((t) => ({
        phaseId: p.id,
        topicId: t.id,
        name: t.name,
        description: t.description,
        subtopics: t.subtopics || [],
        phaseTitle: p.title,
        phaseDifficulty: p.difficultyLevel,
        phasePrereqIds: p.prerequisites,
      })),
    )
  }, [learningPath])

  const completedKey = `roadmap-completed-${learningPath.id}`
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(completedKey)
      if (!raw) return new Set()
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return new Set()
      return new Set(parsed as string[])
    } catch {
      return new Set()
    }
  })

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(topics[0]?.topicId || null)
  const selected = useMemo(() => topics.find(t => t.topicId === selectedTopicId) || null, [topics, selectedTopicId])

  const streak = useMemo(() => {
    try {
      const v = parseInt(localStorage.getItem('daily-streak') || '0', 10)
      return Number.isFinite(v) ? v : 0
    } catch {
      return 0
    }
  }, [])

  const weakSnapshot = useMemo(() => loadWeakSnapshot(), [])

  const difficultyMap = useMemo(() => {
    const entries = loadDifficulty()
    const map = new Map<string, DifficultySignal>()
    entries.forEach(e => map.set(e.name.toLowerCase(), e.level))
    return map
  }, [])

  const [voiceSupported] = useState(() => !!getSpeechRecognition())
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle')
  const [lastHeard, setLastHeard] = useState('')
  const [manualCommand, setManualCommand] = useState('')
  const recognitionRef = useRef<any>(null)
  const voiceStateRef = useRef<'idle' | 'listening' | 'processing' | 'error'>('idle')
  const silenceTimerRef = useRef<number | null>(null)
  const hardStopTimerRef = useRef<number | null>(null)
  const lastFinalRef = useRef<string>('')

  const progress = useMemo(() => {
    const total = topics.length
    const done = completed.size
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, pct }
  }, [topics.length, completed])

  const phaseTitleById = useMemo(() => {
    const map = new Map<string, string>()
    learningPath.phases.forEach(p => map.set(p.id, p.title))
    return map
  }, [learningPath])

  const getDifficultyForTopic = (topicName: string) => {
    const lower = topicName.toLowerCase()
    const direct = difficultyMap.get(lower)
    if (direct) return direct
    for (const [name, level] of difficultyMap.entries()) {
      if (lower.includes(name)) return level
    }
    return 'Easy' as DifficultySignal
  }

  const isWeakTopic = (topicName: string) => {
    if (!weakSnapshot) return false
    const key = topicName.toLowerCase().split(' ')[0]
    return weakSnapshot.topics.some(t => t.toLowerCase().includes(key))
  }

  const persistCompleted = (next: Set<string>) => {
    setCompleted(next)
    try {
      localStorage.setItem(completedKey, JSON.stringify(Array.from(next)))
    } catch {}
  }

  const markSelectedComplete = () => {
    if (!selectedTopicId) return
    const next = new Set(completed)
    next.add(selectedTopicId)
    persistCompleted(next)
  }

  const toggleComplete = (topicId: string) => {
    const next = new Set(completed)
    if (next.has(topicId)) next.delete(topicId)
    else next.add(topicId)
    persistCompleted(next)
  }

  const openNextTopic = () => {
    if (topics.length === 0) return
    const ordered = topics
    const currentIdx = selectedTopicId ? ordered.findIndex(t => t.topicId === selectedTopicId) : -1
    const after = currentIdx >= 0 ? ordered.slice(currentIdx + 1) : ordered
    const next = after.find(t => !completed.has(t.topicId)) || ordered.find(t => !completed.has(t.topicId)) || ordered[0]
    if (!next) return
    setSelectedTopicId(next.topicId)
    const el = document.getElementById(`topic-node-${next.topicId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const explainSelected = () => {
    if (!selected) return
    const el = document.getElementById(`topic-details`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyCommand = (raw: string) => {
    const text = raw.trim().toLowerCase()
    if (!text) return
    if (text.includes('mark') && (text.includes('complete') || text.includes('completed') || text.includes('done'))) {
      markSelectedComplete()
      return
    }
    if ((text.includes('show') || text.includes('open') || text.includes('next')) && text.includes('topic')) {
      openNextTopic()
      return
    }
    if (text.includes('explain') || text.includes('expand')) {
      explainSelected()
      return
    }
  }

  useEffect(() => {
    voiceStateRef.current = voiceState
  }, [voiceState])

  const stopListening = (next: 'idle' | 'error' = 'idle') => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (hardStopTimerRef.current) {
      window.clearTimeout(hardStopTimerRef.current)
      hardStopTimerRef.current = null
    }
    const rec = recognitionRef.current
    if (rec) {
      try {
        rec.stop()
      } catch {}
    }
    recognitionRef.current = null
    setVoiceState(next)
  }

  const startListening = () => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) return

    stopListening('idle')
    setLastHeard('')
    setVoiceState('listening')
    lastFinalRef.current = ''

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = true
    recognitionRef.current = rec

    const armSilenceStop = () => {
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = window.setTimeout(() => stopListening('idle'), 1600)
    }

    rec.onresult = (event: any) => {
      const results = event.results
      const lastRes = results?.[results.length - 1]
      const confidence = typeof lastRes?.[0]?.confidence === 'number' ? lastRes[0].confidence : 1
      const transcript = String(lastRes?.[0]?.transcript || '').replace(/\s+/g, ' ').trim()
      if (!transcript) return
      setLastHeard(transcript)
      armSilenceStop()

      if (lastRes?.isFinal) {
        if (confidence < 0.4) return
        if (transcript === lastFinalRef.current) return
        lastFinalRef.current = transcript
        setVoiceState('processing')
        applyCommand(transcript)
        window.setTimeout(() => stopListening('idle'), 250)
      }
    }

    rec.onerror = () => {
      stopListening('error')
    }

    rec.onend = () => {
      if (voiceStateRef.current !== 'error') setVoiceState('idle')
    }

    try {
      rec.start()
      armSilenceStop()
      hardStopTimerRef.current = window.setTimeout(() => stopListening('idle'), 15000)
    } catch {
      stopListening('error')
    }
  }

  useEffect(() => {
    return () => stopListening()
  }, [])

  const [preferredUrl, setPreferredUrl] = useState('')
  const [preferredTitle, setPreferredTitle] = useState('')

  const addPreferredVideoForSelected = () => {
    if (!selected) return
    if (!preferredUrl.trim()) return
    addUserVideo(selected.name, preferredUrl, preferredTitle)
    setPreferredUrl('')
    setPreferredTitle('')
  }

  const selectedDifficulty = selected ? (isWeakTopic(selected.name) ? 'Difficult' : getDifficultyForTopic(selected.name)) : 'Easy'

  const selectedVideos = useMemo(() => {
    if (!selected) return []
    const result = getRankedVideos({
      topic: selected.name,
      learningPath,
      difficultySignal: selectedDifficulty,
    })
    return result.items.slice(0, 4)
  }, [selected, learningPath, selectedDifficulty])

  const recommendations = useMemo(() => generateRecommendations(learningPath), [learningPath])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">Interactive Learning Roadmap</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Connected topic nodes with actions: expand, complete, resources, and preferred videos.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                {progress.done}/{progress.total} completed
              </div>
              <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs">
                {progress.pct}% progress
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <div className="min-w-[720px] space-y-6">
            {learningPath.phases.map((phase, phaseIndex) => {
              const phaseTopics = phase.topics
              return (
                <div key={phase.id} className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      Stage {phaseIndex + 1}: {phase.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Difficulty {phase.difficultyLevel}/10 • {phaseTopics.length} topics
                    </div>
                  </div>
                  <div className="mt-3 flex items-stretch gap-3">
                    {phaseTopics.map((t, idx) => {
                      const isSelected = selectedTopicId === t.id
                      const done = completed.has(t.id)
                      const weak = isWeakTopic(t.name) || getDifficultyForTopic(t.name) === 'Difficult'
                      const nodeBg = done ? 'bg-green-50 border-green-300' : isSelected ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200'
                      const pill = done ? 'bg-green-100 text-green-800 border-green-200' : weak ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                      const pillText = done ? 'Completed' : weak ? 'Difficult' : 'In progress'

                      return (
                        <div key={t.id} className="flex items-center">
                          <button
                            id={`topic-node-${t.id}`}
                            type="button"
                            onClick={() => setSelectedTopicId(t.id)}
                            className={`w-60 border rounded-2xl p-4 text-left transition-all ${nodeBg}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {t.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                  {t.subtopics?.slice(0, 2).join(' • ') || 'Explore key concepts'}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${pill}`}>
                                {pillText}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTopicId(t.id)
                                  explainSelected()
                                }}
                              >
                                Expand Topic
                              </button>
                              <button
                                type="button"
                                className="px-2 py-1 rounded-lg bg-primary-600 text-white text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleComplete(t.id)
                                }}
                              >
                                {done ? 'Unmark' : 'Mark as Completed'}
                              </button>
                            </div>
                          </button>

                          {idx < phaseTopics.length - 1 && (
                            <div className="w-10 flex items-center justify-center">
                              <div className="h-0.5 w-full bg-gray-200"></div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {phaseIndex < learningPath.phases.length - 1 && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-block w-3 h-3 rounded-full bg-gray-200"></span>
                      <span>Next stage unlocks after completing prior topics</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="card">
          <div className="text-sm font-semibold mb-2">Overall progress</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progress.pct}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress.pct}%` }}></div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Streak: {streak} day{streak === 1 ? '' : 's'}
          </div>
          {weakSnapshot && weakSnapshot.topics.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold text-gray-700 mb-1">Weak-area alerts</div>
              <div className="flex flex-wrap gap-1">
                {weakSnapshot.topics.slice(0, 4).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px]">
                    {t}
                  </span>
                ))}
                {weakSnapshot.topics.length > 4 && (
                  <span className="text-[11px] text-gray-500">+{weakSnapshot.topics.length - 4} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div id="topic-details" className="card">
          <div className="text-sm font-semibold mb-2">Topic panel</div>
          {!selected ? (
            <div className="text-sm text-gray-500">Select a topic node to see details.</div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">{selected.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{selected.phaseTitle}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-gray-100 text-gray-700 border-gray-200">
                    Skill level: {selected.phaseDifficulty}/10
                  </span>
                  {selectedDifficulty === 'Difficult' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-red-100 text-red-800 border-red-200">
                      Difficult topic
                    </span>
                  )}
                  {completed.has(selected.topicId) && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-green-100 text-green-800 border-green-200">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-300">
                {selected.description || 'No description available.'}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Prerequisites</div>
                {selected.phasePrereqIds.length === 0 ? (
                  <div className="text-xs text-gray-500">No prerequisites</div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selected.phasePrereqIds.map(id => (
                      <span key={id} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                        {phaseTitleById.get(id) || id}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Recommended resources</div>
                <div className="space-y-1">
                  {learningPath.phases.find(p => p.id === selected.phaseId)?.resources.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between text-[11px] border rounded-lg p-2">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 truncate">{r.title}</div>
                        <div className="text-gray-500 truncate">{r.type}</div>
                      </div>
                      <div className="text-gray-500">{r.estimatedTime}m</div>
                    </div>
                  )) || (
                    <div className="text-xs text-gray-500">No resources found</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Recommended videos</div>
                {selectedVideos.length === 0 ? (
                  <div className="text-xs text-gray-500">No videos found.</div>
                ) : (
                  <div className="space-y-1">
                    {selectedVideos.map(v => (
                      <a
                        key={v.id}
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block border rounded-lg p-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-[11px] font-medium text-gray-800">
                          {v.label === 'Beginner Friendly' && '🎯 '}
                          {v.label === 'Concept Understanding' && '📘 '}
                          {v.label === 'Advanced Explanation' && '🔬 '}
                          {v.title}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {v.difficulty} {v.durationMinutes > 0 ? `• ${v.durationMinutes} min` : ''}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Key takeaways</div>
                <textarea
                  className="input-field h-24 resize-none text-sm"
                  value={notesForTopic(learningPath.id, selected.topicId)}
                  onChange={(e) => setNotesForTopic(learningPath.id, selected.topicId, e.target.value)}
                  placeholder="Write key takeaways in your own words."
                />
              </div>

              <div className="flex gap-2">
                <button className="btn-primary flex-1 text-sm" onClick={markSelectedComplete}>
                  Mark as Understood
                </button>
                <button className="btn-secondary text-sm" onClick={openNextTopic}>
                  Next
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Add Preferred Video</div>
                <input
                  className="input-field mb-2 text-sm"
                  placeholder="Paste a video URL"
                  value={preferredUrl}
                  onChange={(e) => setPreferredUrl(e.target.value)}
                />
                <input
                  className="input-field mb-2 text-sm"
                  placeholder="Optional title"
                  value={preferredTitle}
                  onChange={(e) => setPreferredTitle(e.target.value)}
                />
                <button
                  className="btn-secondary w-full text-sm"
                  onClick={addPreferredVideoForSelected}
                  disabled={!preferredUrl.trim()}
                >
                  Save Preferred Video
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="text-sm font-semibold mb-2">AI suggested next steps</div>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map(r => (
              <div key={r.id} className="border rounded-lg p-2">
                <div className="text-xs font-medium text-gray-800">{r.topic}</div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Confidence {(r.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-semibold mb-2">Voice commands</div>
          <div className="text-xs text-gray-600 mb-2">
            Try: “Mark this topic as complete”, “Show next topic”, “Explain this concept”.
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                voiceState === 'listening'
                  ? 'bg-green-500'
                  : voiceState === 'processing'
                    ? 'bg-yellow-500'
                    : voiceState === 'error'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
              }`}
            ></div>
            <div className="text-xs text-gray-600">
              {voiceState === 'listening'
                ? 'Listening…'
                : voiceState === 'processing'
                  ? 'Buffering…'
                  : voiceState === 'error'
                    ? 'Mic error'
                    : voiceSupported
                      ? 'Ready'
                      : 'Not supported'}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                className="btn-secondary text-xs"
                onClick={startListening}
                disabled={!voiceSupported || voiceState === 'listening' || voiceState === 'processing'}
              >
                {voiceState === 'listening' ? 'Listening' : 'Start'}
              </button>
              <button className="btn-secondary text-xs" onClick={() => stopListening('idle')} disabled={voiceState !== 'listening'}>
                Stop
              </button>
            </div>
          </div>
          {lastHeard && (
            <div className="text-[11px] text-gray-500 mb-2">
              Heard: {lastHeard}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              className="input-field flex-1 text-sm"
              placeholder="Fallback: type a command"
              value={manualCommand}
              onChange={(e) => setManualCommand(e.target.value)}
            />
            <button
              className="btn-primary text-xs"
              onClick={() => {
                applyCommand(manualCommand)
                setManualCommand('')
              }}
            >
              Run
            </button>
          </div>
          {voiceState === 'error' && (
            <button className="mt-2 btn-secondary w-full text-xs" onClick={startListening}>
              Retry microphone
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const notesKey = (pathId: string, topicId: string) => `roadmap-topic-notes-${pathId}-${topicId}`

const notesForTopic = (pathId: string, topicId: string) => {
  try {
    return localStorage.getItem(notesKey(pathId, topicId)) || ''
  } catch {
    return ''
  }
}

const setNotesForTopic = (pathId: string, topicId: string, value: string) => {
  try {
    localStorage.setItem(notesKey(pathId, topicId), value)
  } catch {}
}

export default RoadmapStyleView
