export default function MarketDemandBar({ skill, percentage, hasIt }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className={hasIt ? 'text-emerald-400' : 'text-gray-300'}>
          {skill} {hasIt && '✓'}
        </span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${
            hasIt ? 'bg-emerald-500' : 'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}