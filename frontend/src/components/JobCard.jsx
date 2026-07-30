import ScoreRing from './ScoreRing'
import SkillBadge from './SkillBadge'

export default function JobCard({ job, rank }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-gray-500">#{rank}</span>
            <h3 className="text-lg font-bold text-white">{job.title}</h3>
          </div>
          {job.company && (
            <p className="text-sm text-gray-500 mb-4">{job.company}</p>
          )}

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-500">Semantic</p>
              <p className="text-sm font-semibold text-white">{job.semantic_similarity}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Skills</p>
              <p className="text-sm font-semibold text-white">{job.skill_match}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Requirements</p>
              <p className="text-sm font-semibold text-white">{job.requirement_match}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Keywords</p>
              <p className="text-sm font-semibold text-white">{job.keyword_match}%</p>
            </div>
          </div>

          {job.matching_skills.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1.5">Matching</p>
              <div className="flex flex-wrap gap-1.5">
                {job.matching_skills.map(s => <SkillBadge key={s} skill={s} variant="match" />)}
              </div>
            </div>
          )}

          {job.missing_skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Missing</p>
              <div className="flex flex-wrap gap-1.5">
                {job.missing_skills.map(s => <SkillBadge key={s} skill={s} variant="missing" />)}
              </div>
            </div>
          )}
        </div>

        <ScoreRing score={job.final_score} size={100} />
      </div>
    </div>
  )
}