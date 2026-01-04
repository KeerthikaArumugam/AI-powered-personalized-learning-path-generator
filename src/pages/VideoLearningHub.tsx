import { useEffect, useMemo, useState } from 'react'
import { LearningPath } from '../types'
import { VideoItem, addUserVideo, getRankedVideos, markVideoLiked } from '../services/videoRecommendations'

type DifficultySignal = 'Easy' | 'Moderate' | 'Difficult'

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

interface VideoLearningHubProps {
  learningPath?: LearningPath | null
}

const VideoLearningHub = ({ learningPath }: VideoLearningHubProps) => {
  const [topic, setTopic] = useState('')
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [difficulty, setDifficulty] = useState<DifficultySignal>('Easy')
  const [current, setCurrent] = useState<VideoItem | null>(null)
  const [notes, setNotes] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [preferredUrl, setPreferredUrl] = useState('')
  const [preferredTitle, setPreferredTitle] = useState('')

  const difficultyMap = useMemo(() => {
    const entries = loadDifficulty()
    const map = new Map<string, DifficultySignal>()
    entries.forEach(e => {
      map.set(e.name.toLowerCase(), e.level)
    })
    return map
  }, [])

  const topicsFromPath = useMemo(() => {
    if (!learningPath) return []
    const set = new Set<string>()
    learningPath.phases.forEach(p => {
      p.topics.forEach(t => set.add(t.name))
    })
    return Array.from(set)
  }, [learningPath])

  const effectiveDifficulty = useMemo<DifficultySignal>(() => {
    if (!topic) return 'Easy'
    const lower = topic.toLowerCase()
    const direct = difficultyMap.get(lower)
    if (direct) return direct
    for (const [name, level] of difficultyMap.entries()) {
      if (lower.includes(name)) return level
    }
    return 'Easy'
  }, [topic, difficultyMap])

  useEffect(() => {
    if (!topic) {
      setVideos([])
      setCurrent(null)
      setDifficulty('Easy')
      return
    }
    const ranked = getRankedVideos({
      topic,
      learningPath,
      difficultySignal: effectiveDifficulty,
    })
    setVideos(ranked.items)
    setDifficulty(ranked.effectiveDifficulty)
    if (!current || !ranked.items.find(v => v.id === current.id)) {
      setCurrent(ranked.items[0] || null)
    }
  }, [topic, learningPath, effectiveDifficulty])

  useEffect(() => {
    if (!current || !topic) {
      setNotes('')
      setUnderstood(false)
      return
    }
    const key = `video-notes-${current.id}`
    const statusKey = `video-understood-${topic.toLowerCase()}-${current.id}`
    try {
      const raw = localStorage.getItem(key)
      setNotes(raw || '')
    } catch {
      setNotes('')
    }
    try {
      const raw = localStorage.getItem(statusKey)
      setUnderstood(raw === 'true')
    } catch {
      setUnderstood(false)
    }
  }, [current, topic])

  const onChangeNotes = (value: string) => {
    setNotes(value)
    if (!current) return
    const key = `video-notes-${current.id}`
    try {
      localStorage.setItem(key, value)
    } catch {}
  }

  const markAsUnderstood = () => {
    if (!current || !topic) return
    const statusKey = `video-understood-${topic.toLowerCase()}-${current.id}`
    try {
      localStorage.setItem(statusKey, 'true')
    } catch {}
    setUnderstood(true)
    markVideoLiked(topic, current.id)
  }

  const addPreferred = () => {
    if (!topic || !preferredUrl.trim()) return
    const created = addUserVideo(topic, preferredUrl, preferredTitle)
    setPreferredUrl('')
    setPreferredTitle('')
    const ranked = getRankedVideos({
      topic,
      learningPath,
      difficultySignal: effectiveDifficulty,
    })
    setVideos(ranked.items)
    if (!current) setCurrent(created)
  }

  const difficultyBadge = () => {
    if (difficulty === 'Easy') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
          Topic feels easy
        </span>
      )
    }
    if (difficulty === 'Moderate') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
          Needs practice
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
        Marked as difficult
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            🎥 Personalized Video Learning Support
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Watch guided videos for each topic</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            See beginner, concept explanation, and advanced tutorial videos inside a focused player, with support for difficult topics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">Select a topic and difficulty</div>
          <input
            className="input-field mb-2"
            placeholder="e.g., State Management, Async/Await"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          {topicsFromPath.length > 0 && (
            <div className="text-xs text-gray-500 mb-1">From your learning path</div>
          )}
          {topicsFromPath.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {topicsFromPath.slice(0, 10).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`px-2 py-1 rounded-full text-xs border ${
                    t === topic ? 'bg-primary-100 text-primary-800 border-primary-300' : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-600">Difficulty signal</div>
            {difficultyBadge()}
          </div>
          {difficulty === 'Difficult' && (
            <div className="mt-2 text-[11px] text-red-600">
              This topic was detected as difficult. Suggested videos below are prioritized to simplify understanding.
            </div>
          )}
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-lg font-semibold">Recommended videos</div>
              <div className="text-xs text-gray-500">
                Ranked by topic match, difficulty, and what helped you before.
              </div>
            </div>
          </div>
          {videos.length === 0 ? (
            <div className="text-gray-500 text-sm">
              Enter a topic or pick one from your learning path to see suggestions.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {videos.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setCurrent(v)}
                  className={`w-full text-left border rounded-lg p-2 flex items-center justify-between ${
                    current && current.id === v.id ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <span>{v.title}</span>
                      {v.source === 'user' && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                          My Preferred Video
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {v.label === 'Beginner Friendly' && '🎯 Beginner Video'}
                      {v.label === 'Concept Understanding' && '📘 Concept Explanation Video'}
                      {v.label === 'Advanced Explanation' && '🔬 Advanced Tutorial Video'}
                      {v.durationMinutes > 0 && ` • ${v.durationMinutes} min`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{v.difficulty}</span>
                    <span className="text-lg">▶️</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Embedded video player</div>
            {topic && (
              <div className="px-2 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px]">
                Topic: {topic}
              </div>
            )}
          </div>
          {!current ? (
            <div className="text-gray-500 text-sm">Select a video to start learning.</div>
          ) : (
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                {current.url.includes('youtube.com/embed') ? (
                  <iframe
                    className="w-full h-full"
                    src={current.url}
                    title={current.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">
                    Open this video in a new tab: {current.url}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{current.title}</div>
                  <div className="text-xs text-gray-500">
                    {current.label === 'Beginner Friendly' && '🎯 Beginner Friendly'}
                    {current.label === 'Concept Understanding' && '📘 Concept Understanding'}
                    {current.label === 'Advanced Explanation' && '🔬 Advanced Explanation'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={markAsUnderstood}
                >
                  {understood ? 'Marked as understood' : 'Mark as understood'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="text-sm font-semibold mb-2">Topic details and key takeaways</div>
          <textarea
            className="input-field h-32 resize-none"
            placeholder="Write your own summary, examples, and next questions."
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
          />
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Add My Preferred Video</div>
            <input
              className="input-field mb-2"
              placeholder="Paste a video URL"
              value={preferredUrl}
              onChange={(e) => setPreferredUrl(e.target.value)}
            />
            <input
              className="input-field mb-2"
              placeholder="Optional title"
              value={preferredTitle}
              onChange={(e) => setPreferredTitle(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary w-full text-sm"
              onClick={addPreferred}
              disabled={!topic || !preferredUrl.trim()}
            >
              Save as my preferred video for this topic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoLearningHub
