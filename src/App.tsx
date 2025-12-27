import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import ProfileForm from './components/ProfileForm'
import ProgressDashboard from './components/ProgressDashboard'
import { UserProfile, LearningPath } from './types'
import Home from './pages/Home'
import SkillLibraryPage from './pages/SkillLibraryPage'
import RoadmapResultsPage from './pages/RoadmapResultsPage'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/generator" 
            element={
              <ProfileForm 
                onProfileComplete={setUserProfile}
                onPathGenerated={setLearningPath}
              />
            } 
          />
          <Route 
            path="/results" 
            element={<RoadmapResultsPage profile={userProfile} learningPath={learningPath} />} 
          />
          <Route 
            path="/library" 
            element={
              <SkillLibraryPage 
                resources={learningPath?.phases.flatMap(p => p.resources)} 
                learningStyle={userProfile?.learningStyle}
              />
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProgressDashboard 
                profile={userProfile}
                learningPath={learningPath}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
