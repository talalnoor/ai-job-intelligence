export default function SkillBadge({ skill, variant = 'match' }) {
  const styles = {
    match: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    missing: 'bg-red-500/10 text-red-400 border-red-500/30',
    neutral: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {skill}
    </span>
  )
}