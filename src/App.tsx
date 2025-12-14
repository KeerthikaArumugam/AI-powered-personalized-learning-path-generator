import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import ProfileForm from './components/ProfileForm'
import LearningPathView from './components/LearningPathView'
import ProgressDashboard from './components/ProgressDashboard'
import { UserProfile, LearningPath } from './types'

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProfileForm 
                onProfileComplete={setUserProfile}
                onPathGenerated={setLearningPath}
              />
            } 
          />
          <Route 
            path="/learning-path" 
            element={
              <LearningPathView 
                profile={userProfile}
                learningPath={learningPath}
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
        </Routes>
      </main>
    </div>
  )
}

export default App