const PrintableQuickGuide = () => {
  const onPrint = () => window.print()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Printable Quick Study Guide</h1>
        <p className="text-gray-600 dark:text-gray-300">Compact checklist optimized for print.</p>
      </div>
      <div className="card">
        <div className="text-lg font-semibold mb-2">Checklist</div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
          <li>Set up environment</li>
          <li>Complete fundamentals exercises</li>
          <li>Watch short primer</li>
          <li>Build mini project</li>
          <li>Review and reflect</li>
        </ul>
        <div className="mt-3">
          <button className="btn-primary" onClick={onPrint}>Download / Print</button>
        </div>
      </div>
    </div>
  )
}

export default PrintableQuickGuide

