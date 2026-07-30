import { useState, useEffect } from 'react'
import { Sparkles, Brain, Target, TrendingUp } from 'lucide-react'

export default function Splash({ onContinue }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  function handleContinue() {
    setExiting(true)
    setTimeout(onContinue, 400)
  }

  return (
    <div
      onClick={handleContinue}
      className={`min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden cursor-pointer transition-opacity duration-400 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div
        className={`relative text-center max-w-lg transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6 animate-bounce" style={{ animationDuration: '2.5s' }}>
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          AI Job Intelligence
        </h1>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Upload your resume, compare it against real job descriptions, and get an
          AI-powered breakdown of your fit, skill gaps, and career roadmap —
          backed by semantic embeddings, not guesswork.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-12 max-w-sm mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500">AI Analysis</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Target className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500">Fit Scoring</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500">Market Data</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm animate-pulse">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  )
}