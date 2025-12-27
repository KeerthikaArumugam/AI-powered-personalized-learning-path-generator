import { useEffect, useMemo, useState } from 'react'

const makeQrPlaceholder = (text: string) => {
  return `QR:${btoa(text).slice(0, 16)}`
}

const ShareLearningPath = () => {
  const [link, setLink] = useState('')
  const [qr, setQr] = useState('')
  const summary = useMemo(() => 'Personalized path with phases, resources, and milestones.', [])

  useEffect(() => {
    const l = `${location.origin}/results`
    setLink(l)
    setQr(makeQrPlaceholder(l))
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            🔗 Share Learning Path
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate link or QR code</h1>
          <p className="text-gray-600 dark:text-gray-300">Preview summary and copy or download.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-lg font-semibold mb-2">Shareable Link</div>
          <div className="flex items-center gap-2">
            <input className="input-field flex-1" readOnly value={link} />
            <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(link)}>Copy</button>
          </div>
          <div className="mt-3">
            <button className="btn-secondary" onClick={() => {
              const blob = new Blob([link], { type: 'text/plain' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = 'learning-path-link.txt'
              a.click()
            }}>Download Link</button>
          </div>
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-2">QR Code</div>
          <div className="p-6 border rounded-lg text-center text-2xl tracking-widest">{qr}</div>
          <div className="mt-3">
            <button className="btn-secondary" onClick={() => {
              const blob = new Blob([qr], { type: 'text/plain' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = 'learning-path-qr.txt'
              a.click()
            }}>Download QR</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-lg font-semibold mb-2">Path Summary Preview</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">{summary}</div>
      </div>
    </div>
  )
}

export default ShareLearningPath

