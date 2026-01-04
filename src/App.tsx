import { Routes, Route } from 'react-router-dom'
import { useState, Suspense, lazy } from 'react'
import Header from './components/Header'
import ProfileForm from './components/ProfileForm'
import ProgressDashboard from './components/ProgressDashboard'
import { UserProfile, LearningPath } from './types'
import Home from './pages/Home'
import SkillLibraryPage from './pages/SkillLibraryPage'
import RoadmapResultsPage from './pages/RoadmapResultsPage'
import About from './pages/About'
import Contact from './pages/Contact'
import CareerRoadmapPage from './pages/CareerRoadmapPage'
import CareerDashboardPage from './pages/CareerDashboardPage'
const ConceptDifficultyAnalyzer = lazy(() => import('./pages/ConceptDifficultyAnalyzer'))
const KnowledgeRetentionChecker = lazy(() => import('./pages/KnowledgeRetentionChecker'))
const AIReflectionFeedback = lazy(() => import('./pages/AIReflectionFeedback'))
const LabsHub = lazy(() => import('./pages/LabsHub'))
const AlternateLearningPaths = lazy(() => import('./pages/AlternateLearningPaths'))
const PeerLearningSuggestions = lazy(() => import('./pages/PeerLearningSuggestions'))
const ShareLearningPath = lazy(() => import('./pages/ShareLearningPath'))
const CommunityRatedResources = lazy(() => import('./pages/CommunityRatedResources'))
const TaskBreakdownGenerator = lazy(() => import('./pages/TaskBreakdownGenerator'))
const AITopicSummarizer = lazy(() => import('./pages/AITopicSummarizer'))
const VersionSwitcher = lazy(() => import('./pages/VersionSwitcher'))
const PrintableQuickGuide = lazy(() => import('./pages/PrintableQuickGuide'))
const JobRoleTrendIndicator = lazy(() => import('./pages/JobRoleTrendIndicator'))
const ToolReadinessMap = lazy(() => import('./pages/ToolReadinessMap'))
const ProjectBasedLearningMode = lazy(() => import('./pages/ProjectBasedLearningMode'))
const DailyLearningChallenge = lazy(() => import('./pages/DailyLearningChallenge'))
const ExplainableAIRecommendations = lazy(() => import('./pages/ExplainableAIRecommendations'))
const CognitiveLoadBalancer = lazy(() => import('./pages/CognitiveLoadBalancer'))
const VideoLearningHub = lazy(() => import('./pages/VideoLearningHub'))

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmaps" element={<Home />} />
          <Route path="/roadmaps/:slug" element={<CareerRoadmapPage />} />
          <Route path="/dashboard" element={<CareerDashboardPage />} />
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
          <Route path="/analyzer" element={<Suspense fallback={<div>Loading...</div>}><ConceptDifficultyAnalyzer /></Suspense>} />
          <Route path="/retention" element={<Suspense fallback={<div>Loading...</div>}><KnowledgeRetentionChecker learningPath={learningPath} /></Suspense>} />
          <Route path="/reflection" element={<Suspense fallback={<div>Loading...</div>}><AIReflectionFeedback /></Suspense>} />
          <Route path="/labs" element={<Suspense fallback={<div>Loading...</div>}><LabsHub /></Suspense>} />
          <Route path="/alt-paths" element={<Suspense fallback={<div>Loading...</div>}><AlternateLearningPaths profile={userProfile} /></Suspense>} />
          <Route path="/peer-suggestions" element={<Suspense fallback={<div>Loading...</div>}><PeerLearningSuggestions /></Suspense>} />
          <Route path="/share-path" element={<Suspense fallback={<div>Loading...</div>}><ShareLearningPath /></Suspense>} />
          <Route path="/community-resources" element={<Suspense fallback={<div>Loading...</div>}><CommunityRatedResources /></Suspense>} />
          <Route path="/task-breakdown" element={<Suspense fallback={<div>Loading...</div>}><TaskBreakdownGenerator /></Suspense>} />
          <Route path="/topic-summarizer" element={<Suspense fallback={<div>Loading...</div>}><AITopicSummarizer /></Suspense>} />
          <Route path="/version-switcher" element={<Suspense fallback={<div>Loading...</div>}><VersionSwitcher /></Suspense>} />
          <Route path="/printable-guide" element={<Suspense fallback={<div>Loading...</div>}><PrintableQuickGuide /></Suspense>} />
          <Route path="/job-trend" element={<Suspense fallback={<div>Loading...</div>}><JobRoleTrendIndicator /></Suspense>} />
          <Route path="/tool-readiness" element={<Suspense fallback={<div>Loading...</div>}><ToolReadinessMap /></Suspense>} />
          <Route path="/project-mode" element={<Suspense fallback={<div>Loading...</div>}><ProjectBasedLearningMode /></Suspense>} />
          <Route
            path="/daily-challenge"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DailyLearningChallenge profile={userProfile} learningPath={learningPath} />
              </Suspense>
            }
          />
          <Route
            path="/video-hub"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <VideoLearningHub learningPath={learningPath} />
              </Suspense>
            }
          />
          <Route path="/explainable-ai" element={<Suspense fallback={<div>Loading...</div>}><ExplainableAIRecommendations learningPath={learningPath} /></Suspense>} />
          <Route path="/load-balancer" element={<Suspense fallback={<div>Loading...</div>}><CognitiveLoadBalancer /></Suspense>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
