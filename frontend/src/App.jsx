import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Analyze from './pages/Analyze'
import About from './pages/About'

function AppContent() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState('login')
  const [showSplash, setShowSplash] = useState(true)
  const [showAbout, setShowAbout] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    )
  }

  if (showAbout) {
    return <About onBack={() => setShowAbout(false)} />
  }

  if (showSplash && !user) {
    return <Splash onContinue={() => setShowSplash(false)} onAbout={() => setShowAbout(true)} />
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSuccess={() => {}} onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onSuccess={() => {}} onSwitchToLogin={() => setAuthView('login')} />
    )
  }

  return <Analyze onAbout={() => setShowAbout(true)} />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App