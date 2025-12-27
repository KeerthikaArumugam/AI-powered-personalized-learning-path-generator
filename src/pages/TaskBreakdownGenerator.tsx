import { useMemo, useState } from 'react'
import { LearningPath } from '../types'

type TaskItem = {
  id: string
  title: string
  time: number
  done: boolean
}

const makeTasks = (step?: string): TaskItem[] => {
  const base = step || 'Build Login Page'
  return [
    { id: 't1', title: `Plan ${base} components`, time: 20, done: false },
    { id: 't2', title: `Implement UI and forms`, time: 40, done: false },
    { id: 't3', title: `Add validation`, time: 30, done: false },
    { id: 't4', title: `Test and refine`, time: 30, done: false },
  ]
}

const TaskBreakdownGenerator = ({ learningPath }: { learningPath?: LearningPath | null }) => {
  const steps = useMemo(() => learningPath?.phases.map(p => p.title) || ['Foundation', 'Frontend', 'Advanced'], [learningPath])
  const [selectedStep, setSelectedStep] = useState(steps[0])
  const [tasks, setTasks] = useState<TaskItem[]>(makeTasks(steps[0]))

  const changeStep = (s: string) => {
    setSelectedStep(s)
    setTasks(makeTasks(s))
  }

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const markAll = () => {
    setTasks(prev => prev.map(t => ({ ...t, done: true })))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Breakdown Generator</h1>
        <p className="text-gray-600 dark:text-gray-300">Convert steps into smaller actionable tasks with time estimates.</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600">Select roadmap step:</span>
          <select className="input-field w-auto" value={selectedStep} onChange={(e) => changeStep(e.target.value)}>
            {steps.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          {tasks.map(t => (
            <label key={t.id} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <span className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>{t.title}</span>
              </div>
              <span className="text-xs text-gray-500">{t.time} min</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn-secondary" onClick={markAll}>Mark as Completed</button>
          <button className="btn-primary">Save Checklist</button>
        </div>
      </div>
    </div>
  )
}

export default TaskBreakdownGenerator

