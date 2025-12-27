import { Link } from 'react-router-dom'

const items = [
  { path: '/alt-paths', title: 'Alternate Learning Path Generator', desc: 'Theory, Hands‑On, and Fast‑Track roadmaps' },
  { path: '/peer-suggestions', title: 'Peer Learning Suggestions', desc: 'Anonymous groups, topics, and share link' },
  { path: '/share-path', title: 'Share Learning Path', desc: 'Generate shareable link and QR, preview' },
  { path: '/community-resources', title: 'Community‑Rated Resources', desc: 'Ranked resources with filters' },
  { path: '/task-breakdown', title: 'Task Breakdown Generator', desc: 'Actionable tasks and checklist' },
  { path: '/topic-summarizer', title: 'AI Topic Summarizer', desc: 'Concise explanation and key points' },
  { path: '/version-switcher', title: 'Learning Path Version Switcher', desc: 'Compare and switch versions' },
  { path: '/printable-guide', title: 'Printable Quick Study Guide', desc: 'Compact checklist and print' },
  { path: '/job-trend', title: 'Job‑Role Trend Indicator', desc: 'Trend label and simple graph' },
  { path: '/tool-readiness', title: 'Tool Readiness Map', desc: 'Skills mapped to tools and readiness' },
  { path: '/project-mode', title: 'Project‑Based Learning Mode', desc: 'Mini projects with objectives and progress' },
  { path: '/daily-challenge', title: 'Daily Learning Challenge', desc: 'Daily challenge, time, and streak' },
  { path: '/explainable-ai', title: 'Explainable AI Recommendations', desc: 'Why recommended, dependencies, outcome' },
  { path: '/load-balancer', title: 'Cognitive Load Balancer', desc: 'Distribution, overload warnings, reorder' },
]

const LabsHub = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            🧪 Feature Lab
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Advanced Learning Features</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Clean, responsive designs without authentication.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link to={item.path} key={item.path} className="card hover:shadow-md transition-shadow">
            <div className="text-xl font-semibold">{item.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.desc}</div>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs">Open</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LabsHub

