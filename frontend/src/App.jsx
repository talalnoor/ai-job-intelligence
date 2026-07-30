import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Analyze from './pages/Analyze'

function AppContent() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState('login')
  const [showSplash, setShowSplash] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    )
  }

  if (showSplash && !user) {
    return <Splash onContinue={() => setShowSplash(false)} />
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSuccess={() => {}} onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onSuccess={() => {}} onSwitchToLogin={() => setAuthView('login')} />
    )
  }

  return <Analyze />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App