import { useState } from 'react'
import { Sparkles, TrendingUp, Target, Lightbulb, Save, Check } from 'lucide-react'
import JobCard from '../components/JobCard'
import MarketDemandBar from '../components/MarketDemandBar'
import { getMarketAnalysis, getInsights, saveAnalysis } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard({ resumeData, jobs, rankResults, onBack }) {
  const { token } = useAuth()
  const [marketData, setMarketData] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loadingExtra, setLoadingExtra] = useState(false)
  const [extraError, setExtraError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function loadDeeperInsights() {
    setLoadingExtra(true)
    try {
      const market = await getMarketAnalysis(
        resumeData.extracted_text,
        resumeData.skills_found,
        jobs
      )
      setMarketData(market)

      const topJob = rankResults.ranked_jobs[0]
      const insightData = await getInsights({
        resume_skills: resumeData.skills_found,
        job_title: topJob.title,
        final_score: topJob.final_score,
        matching_skills: topJob.matching_skills,
        missing_skills: topJob.missing_skills,
        market_high_demand_missing: market.high_demand_missing_skills,
      })
      setInsights(insightData)
    } catch (err) {
      setExtraError(err.response?.data?.detail || 'Could not generate deeper insights. Please try again.')
    } finally {
      setLoadingExtra(false)
    }
  }

  async function handleSaveAnalysis() {
    setSaving(true)
    try {
      await saveAnalysis(resumeData.skills_found, rankResults.ranked_jobs, token)
      setSaved(true)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm text-gray-500 mb-1">Career Overview</p>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-emerald-400" />
              Your Job Intelligence Report
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveAnalysis}
              disabled={saving || saved}
              className="flex items-center gap-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Saved' : saving ? 'Saving...' : 'Save Analysis'}
            </button>
            <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">
              ← New Analysis
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            {resumeData.skills_found.length} skills detected · {rankResults.ranked_jobs.length} jobs analyzed
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold">Best Job Matches</h2>
        </div>

        <div className="space-y-4 mb-12">
          {rankResults.ranked_jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No jobs to display. Go back and add at least one job description.</p>
            </div>
          ) : (
            rankResults.ranked_jobs.map((job, i) => (
              <JobCard key={i} job={job} rank={i + 1} />
            ))
          )}
        </div>

        {!marketData && (
          <>
            <button
              onClick={loadDeeperInsights}
              disabled={loadingExtra}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold mb-3 disabled:opacity-70"
            >
              {loadingExtra ? 'Generating deeper insights...' : 'Generate Market Insights + AI Analysis'}
            </button>
            {extraError && (
              <div className="mb-12 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {extraError}
              </div>
            )}
          </>
        )}

        {marketData && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold">Market Demand</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Based on {marketData.total_jobs_analyzed} job(s) you analyzed — not the entire market.
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              {marketData.skill_frequencies.slice(0, 8).map(s => (
                <MarketDemandBar
                  key={s.skill}
                  skill={s.skill}
                  percentage={s.percentage}
                  hasIt={s.resume_has_it}
                />
              ))}
            </div>
          </div>
        )}

        {insights && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">AI Insights</h2>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              <p className="text-gray-300 leading-relaxed">{insights.summary}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-emerald-400 mb-2">Strengths</p>
                  <ul className="space-y-1.5">
                    {insights.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-400">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-2">Weaknesses</p>
                  <ul className="space-y-1.5">
                    {insights.weaknesses.map((s, i) => (
                      <li key={i} className="text-sm text-gray-400">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white mb-2">Resume Improvements</p>
                <ul className="space-y-1.5">
                  {insights.resume_improvements.map((s, i) => (
                    <li key={i} className="text-sm text-gray-400">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}