import { useState, useEffect } from 'react'
import { Clock, ChevronRight } from 'lucide-react'
import { getAnalysisHistory } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function History({ onSelectAnalysis }) {
  const { token } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAnalysisHistory(token)
        setHistory(data)
      } catch (err) {
        setError('Could not load your analysis history.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading history...</p>
  }

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No saved analyses yet. Run an analysis and save it to see it here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectAnalysis(item.id)}
          className="w-full flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-4 transition-colors text-left"
        >
          <div>
            <p className="font-semibold text-white text-sm">{item.top_job_title}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3" />
              {new Date(item.created_at).toLocaleDateString()} · {item.job_count} job{item.job_count !== 1 ? 's' : ''} analyzed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold text-sm">{item.top_job_score}%</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </button>
      ))}
    </div>
  )
}