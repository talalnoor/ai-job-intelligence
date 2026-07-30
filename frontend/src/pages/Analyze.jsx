import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, LogOut, History as HistoryIcon } from 'lucide-react'
import ResumeUpload from '../components/ResumeUpload'
import JobInput from '../components/JobInput'
import Dashboard from './Dashboard'
import History from './History'
import { rankJobs, getAnalysisById } from '../services/api'
import { useAuth } from '../context/AuthContext'

const LOADING_STAGES = [
  'Analyzing job descriptions...',
  'Extracting required skills...',
  'Generating semantic embeddings...',
  'Calculating compatibility scores...',
  'Ranking jobs...',
]

export default function Analyze() {
  const { user, logout, token } = useAuth()
  const [view, setView] = useState('new') // 'new' | 'history'
  const [resumeData, setResumeData] = useState(null)
  const [jobs, setJobs] = useState([{ title: '', company: '', description: '' }])
  const [results, setResults] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!analyzing) return
    const interval = setInterval(() => {
      setStageIndex(prev => (prev + 1) % LOADING_STAGES.length)
    }, 900)
    return () => clearInterval(interval)
  }, [analyzing])

  async function handleAnalyze() {
    if (!resumeData) {
      setError('Please upload your resume first.')
      return
    }
    const validJobs = jobs.filter(j => j.title.trim() && j.description.trim())
    if (validJobs.length === 0) {
      setError('Please add at least one job with a title and description.')
      return
    }

    setAnalyzing(true)
    setStageIndex(0)
    setError(null)

    try {
      const result = await rankJobs(resumeData.extracted_text, resumeData.skills_found, validJobs)
      setResults(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleSelectHistoryItem(id) {
    try {
      const doc = await getAnalysisById(id, token)
      setResults({ ranked_jobs: doc.ranked_jobs })
      setResumeData({ skills_found: doc.resume_skills, extracted_text: '' })
    } catch (err) {
      setError('Could not load that analysis.')
    }
  }

  if (results) {
    return (
      <Dashboard
        resumeData={resumeData}
        jobs={jobs.filter(j => j.title.trim() && j.description.trim())}
        rankResults={results}
        onBack={() => setResults(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">Hi, {user?.name?.split(' ')[0]}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView(view === 'new' ? 'history' : 'new')}
              className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              {view === 'new' ? 'My Analyses' : 'New Analysis'}
            </button>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-1.5 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {view === 'history' && <History onSelectAnalysis={handleSelectHistoryItem} />}

        {view === 'new' && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Career Intelligence
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                AI Job Intelligence
              </h1>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                Understand your job-market fit, uncover skill gaps, and get a data-driven career roadmap.
              </p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 mb-5 overflow-hidden">
              <ResumeUpload onResumeAnalyzed={setResumeData} />
            </div>

            {resumeData && (
              <div className="flex items-center gap-2 mb-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-400 text-sm font-medium">
                  Resume analyzed — {resumeData.skills_found.length} skills detected
                </p>
              </div>
            )}

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 mb-6 overflow-hidden">
              <JobInput jobs={jobs} setJobs={setJobs} />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black py-4 rounded-2xl font-bold text-sm sm:text-base disabled:opacity-70 transition-all hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                LOADING_STAGES[stageIndex]
              ) : (
                <>
                  Analyze My Career Fit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}