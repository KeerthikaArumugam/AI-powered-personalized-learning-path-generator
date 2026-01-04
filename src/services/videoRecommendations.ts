import { LearningPath } from '../types'

export type VideoLabel = 'Beginner Friendly' | 'Concept Understanding' | 'Advanced Explanation'

export type VideoItem = {
  id: string
  topic: string
  title: string
  url: string
  durationMinutes: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  label: VideoLabel
  source: 'curated' | 'user'
}

type PreferenceSignal = {
  topic: string
  likedIds: string[]
}

const curatedVideos: VideoItem[] = [
  {
    id: 'vid-react-state-1',
    topic: 'State Management',
    title: 'React State Basics for Beginners',
    url: 'https://www.youtube.com/embed/5yHFTN-_mOo',
    durationMinutes: 15,
    difficulty: 'Beginner',
    label: 'Beginner Friendly',
    source: 'curated',
  },
  {
    id: 'vid-react-state-2',
    topic: 'State Management',
    title: 'Understanding React State and Props',
    url: 'https://www.youtube.com/embed/35lXWvCuM8o',
    durationMinutes: 20,
    difficulty: 'Intermediate',
    label: 'Concept Understanding',
    source: 'curated',
  },
  {
    id: 'vid-react-state-3',
    topic: 'State Management',
    title: 'Advanced Patterns for React State Management',
    url: 'https://www.youtube.com/embed/7iYKf4gD9sY',
    durationMinutes: 35,
    difficulty: 'Advanced',
    label: 'Advanced Explanation',
    source: 'curated',
  },
  {
    id: 'vid-async-1',
    topic: 'Async/Await',
    title: 'Async/Await in JavaScript Explained',
    url: 'https://www.youtube.com/embed/V_Kr9OSfDeU',
    durationMinutes: 18,
    difficulty: 'Beginner',
    label: 'Concept Understanding',
    source: 'curated',
  },
  {
    id: 'vid-flexbox-1',
    topic: 'CSS Flexbox',
    title: 'CSS Flexbox in 20 Minutes',
    url: 'https://www.youtube.com/embed/fYq5PXgSsbE',
    durationMinutes: 20,
    difficulty: 'Beginner',
    label: 'Beginner Friendly',
    source: 'curated',
  },
  {
    id: 'vid-recursion-1',
    topic: 'Recursion',
    title: 'Recursion for Beginners',
    url: 'https://www.youtube.com/embed/k7-N8R0-KY4',
    durationMinutes: 22,
    difficulty: 'Beginner',
    label: 'Beginner Friendly',
    source: 'curated',
  },
  {
    id: 'vid-recursion-2',
    topic: 'Recursion',
    title: 'Recursive Problem Solving Techniques',
    url: 'https://www.youtube.com/embed/ngCos392W4w',
    durationMinutes: 28,
    difficulty: 'Intermediate',
    label: 'Concept Understanding',
    source: 'curated',
  },
]

const getUserVideos = (): VideoItem[] => {
  try {
    const raw = localStorage.getItem('user-preferred-videos')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as VideoItem[]
  } catch {
    return []
  }
}

const saveUserVideos = (items: VideoItem[]) => {
  try {
    localStorage.setItem('user-preferred-videos', JSON.stringify(items))
  } catch {}
}

const getPreferences = (): PreferenceSignal[] => {
  try {
    const raw = localStorage.getItem('video-preferences')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as PreferenceSignal[]
  } catch {
    return []
  }
}

const savePreferences = (items: PreferenceSignal[]) => {
  try {
    localStorage.setItem('video-preferences', JSON.stringify(items))
  } catch {}
}

export const isVideoLiked = (topic: string, videoId: string) => {
  const topicLower = topic.trim().toLowerCase()
  const prefs = getPreferences()
  const existing = prefs.find(p => p.topic.trim().toLowerCase() === topicLower)
  return !!existing && existing.likedIds.includes(videoId)
}

export const unmarkVideoLiked = (topic: string, videoId: string) => {
  const topicLower = topic.trim().toLowerCase()
  const prefs = getPreferences()
  const existing = prefs.find(p => p.topic.trim().toLowerCase() === topicLower)
  if (!existing) return
  if (!existing.likedIds.includes(videoId)) return
  const updated = prefs.map(p => {
    if (p.topic.trim().toLowerCase() !== topicLower) return p
    return { ...p, likedIds: p.likedIds.filter(id => id !== videoId) }
  })
  savePreferences(updated)
}

export const toggleVideoLiked = (topic: string, videoId: string) => {
  if (isVideoLiked(topic, videoId)) unmarkVideoLiked(topic, videoId)
  else markVideoLiked(topic, videoId)
}

export const addUserVideo = (topic: string, url: string, title: string): VideoItem => {
  const trimmedTopic = topic.trim()
  const trimmedUrl = url.trim()
  const trimmedTitle = title.trim() || 'My Preferred Learning Video'
  const next: VideoItem = {
    id: `user-${Date.now()}`,
    topic: trimmedTopic,
    title: trimmedTitle,
    url: trimmedUrl,
    durationMinutes: 0,
    difficulty: 'Beginner',
    label: 'Beginner Friendly',
    source: 'user',
  }
  const existing = getUserVideos()
  const updated = [...existing, next]
  saveUserVideos(updated)
  return next
}

export const markVideoLiked = (topic: string, videoId: string) => {
  const prefs = getPreferences()
  const existing = prefs.find(p => p.topic === topic)
  if (!existing) {
    const created: PreferenceSignal = { topic, likedIds: [videoId] }
    savePreferences([...prefs, created])
    return
  }
  if (existing.likedIds.includes(videoId)) return
  const updated = prefs.map(p => p.topic === topic ? { ...p, likedIds: [...p.likedIds, videoId] } : p)
  savePreferences(updated)
}

export const getRankedVideos = (params: {
  topic: string
  learningPath?: LearningPath | null
  difficultySignal?: 'Easy' | 'Moderate' | 'Difficult'
}) => {
  const { topic, learningPath, difficultySignal } = params
  const topicLower = topic.toLowerCase()
  const allUserVideos = getUserVideos()
  const prefs = getPreferences()
  const preference = prefs.find(p => p.topic.toLowerCase() === topicLower)

  const fromPathDifficulty = (() => {
    if (!learningPath) return null
    const key = topicLower.split(' ')[0]
    const inPath = learningPath.phases.some(phase =>
      phase.topics.some(t => t.name.toLowerCase().includes(key))
    )
    if (!inPath) return null
    return 'Moderate' as const
  })()

  const effectiveDifficulty = difficultySignal || fromPathDifficulty || 'Easy'

  const pool = [...curatedVideos.filter(v => v.topic.toLowerCase().includes(topicLower)), ...allUserVideos.filter(v => v.topic.toLowerCase().includes(topicLower))]
  if (pool.length === 0) {
    return {
      items: [...curatedVideos, ...allUserVideos],
      effectiveDifficulty,
    }
  }

  const scored = pool.map(v => {
    let score = 0
    const nameMatch = v.topic.toLowerCase().includes(topicLower) || topicLower.includes(v.topic.toLowerCase())
    if (nameMatch) score += 4
    const labelBonus = v.label === 'Beginner Friendly' ? 3 : v.label === 'Concept Understanding' ? 2 : 1
    score += labelBonus
    if (effectiveDifficulty === 'Difficult') {
      if (v.difficulty === 'Beginner') score += 4
      if (v.durationMinutes && v.durationMinutes <= 20) score += 2
    } else if (effectiveDifficulty === 'Moderate') {
      if (v.difficulty === 'Intermediate') score += 3
    } else {
      if (v.difficulty === 'Beginner') score += 2
    }
    if (preference && preference.likedIds.includes(v.id)) score += 5
    return { video: v, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return {
    items: scored.map(s => s.video),
    effectiveDifficulty,
  }
}
