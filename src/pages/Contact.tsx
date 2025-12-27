const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Have feedback or feature requests? Reach out and help us improve the learning experience.
      </p>
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
          <input type="email" className="input-field dark:bg-gray-900 dark:border-gray-700" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea className="input-field dark:bg-gray-900 dark:border-gray-700" rows={4} placeholder="Share your thoughts..." />
        </div>
        <button className="btn-primary">Send</button>
      </div>
    </div>
  )
}

export default Contact

