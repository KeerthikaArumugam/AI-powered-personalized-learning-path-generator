import { useMemo, useState } from 'react'

type Feedback = {
  understanding: 'Low' | 'Medium' | 'High'
  suggestions: string[]
  nextSteps: string[]
  motivation: string
}

const analyzeReflection = (text: string): Feedback => {
  const len = text.trim().length
  const keywords = ['learned', 'understood', 'struggled', 'practice', 'examples', 'concept', 'applied', 'review']
  const density = keywords.filter(k => text.toLowerCase().includes(k)).length
  const understanding = len < 30 || density === 0 ? 'Low' : density <= 2 ? 'Medium' : 'High'
  const suggestions =
    understanding === 'Low'
      ? ['Summarize the concept in your own words', 'Find a short video primer', 'Do one small example']
      : understanding === 'Medium'
      ? ['List key takeaways as bullet points', 'Apply the concept to a mini task', 'Teach it briefly to a friend']
      : ['Connect with related topics', 'Solve a challenge using this concept', 'Write a concise blog‑style recap']
  const nextSteps =
    understanding === 'Low'
      ? ['Revisit foundational materials', 'Try guided exercises']
      : understanding === 'Medium'
      ? ['Attempt intermediate exercises', 'Explore documentation sections']
      : ['Pick an advanced use‑case', 'Refactor or optimize an existing example']
  const motivation =
    understanding === 'Low'
      ? 'Progress starts small. You’ve got this — one clear step at a time.'
      : understanding === 'Medium'
      ? 'Nice work! Keep building momentum with hands‑on practice.'
      : 'Great clarity! Push a bit further to deepen mastery.'
  return { understanding, suggestions, nextSteps, motivation }
}

const AIReflectionFeedback = () => {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const canSubmit = useMemo(() => text.trim().length > 0, [text])

  const submit = () => {
    setFeedback(analyzeReflection(text))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            ✨ AI Reflection Feedback
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reflect and get personalized guidance</h1>
          <p className="text-gray-600 dark:text-gray-300">Write a short reflection like “What I learned today”. Get feedback and next steps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Reflection</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="I learned about closures today. I understood how inner functions retain access to variables in outer scope..."
            className="input-field dark:bg-gray-900 dark:border-gray-700"
          />
          <div className="mt-3">
            <button className="btn-primary" disabled={!canSubmit} onClick={submit}>Analyze Reflection</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">AI Feedback</h2>
          {!feedback ? (
            <div className="text-gray-500">Submit a reflection to see feedback.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  feedback.understanding === 'High'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : feedback.understanding === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {feedback.understanding} understanding
                </span>
              </div>

              <div>
                <div className="font-medium mb-2">Suggestions</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {feedback.suggestions.map((s, i) => (<li key={i}>{s}</li>))}
                </ul>
              </div>

              <div>
                <div className="font-medium mb-2">Recommended next steps</div>
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {feedback.nextSteps.map((s, i) => (<li key={i}>{s}</li>))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-primary-50 text-primary-800">
                {feedback.motivation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIReflectionFeedback

