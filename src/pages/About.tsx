const About = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About</h1>
      <p className="text-gray-700 dark:text-gray-300">
        This AI-Powered Learning Path Generator helps learners build structured, adaptive roadmaps to achieve their goals.
        It focuses on accessibility, clarity, and personalization to optimize learning outcomes.
      </p>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Design Principles</h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Clean layout with soft gradients and rounded cards</li>
          <li>Clear headers and descriptive labels</li>
          <li>Mobile-first responsive experience</li>
          <li>Accessible and keyboard-friendly design</li>
        </ul>
      </div>
    </div>
  )
}

export default About

