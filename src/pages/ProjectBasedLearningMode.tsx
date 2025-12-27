import { useState } from 'react'

type MiniProject = {
  id: string
  title: string
  objectives: string[]
  tasks: { id: string; title: string; done: boolean }[]
  progress: number
}

const ProjectBasedLearningMode = () => {
  const [projects, setProjects] = useState<MiniProject[]>([
    { id: 'mp1', title: 'Portfolio Landing Page', objectives: ['Responsive layout', 'Accessibility'], tasks: [{ id: 'a1', title: 'Header & nav', done: false }, { id: 'a2', title: 'Hero section', done: false }, { id: 'a3', title: 'Footer', done: false }], progress: 0 },
    { id: 'mp2', title: 'API Notes App', objectives: ['CRUD operations', 'State management'], tasks: [{ id: 'b1', title: 'List notes', done: false }, { id: 'b2', title: 'Create note', done: false }, { id: 'b3', title: 'Delete note', done: false }], progress: 0 },
  ])

  const toggleTask = (pid: string, tid: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== pid) return p
      const tasks = p.tasks.map(t => t.id === tid ? { ...t, done: !t.done } : t)
      const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)
      return { ...p, tasks, progress }
    }))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project‑Based Learning Mode</h1>
        <p className="text-gray-600 dark:text-gray-300">Progress through mini projects with objectives and tasks.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{p.title}</div>
              <div className="text-xs text-gray-500">{p.progress}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${p.progress}%` }} />
            </div>
            <div className="mt-3">
              <div className="font-medium">Objectives</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {p.objectives.map((o, i) => (<span key={i} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{o}</span>))}
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium">Tasks</div>
              <div className="space-y-1 mt-1">
                {p.tasks.map(t => (
                  <label key={t.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={t.done} onChange={() => toggleTask(p.id, t.id)} />
                      <span className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>{t.title}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectBasedLearningMode
