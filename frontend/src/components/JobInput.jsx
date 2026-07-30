import { Plus, X, Briefcase } from 'lucide-react'

export default function JobInput({ jobs, setJobs }) {
  function addJob() {
    setJobs([...jobs, { title: '', company: '', description: '' }])
  }

  function updateJob(index, field, value) {
    const updated = [...jobs]
    updated[index][field] = value
    setJobs(updated)
  }

  function removeJob(index) {
    setJobs(jobs.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 sm:p-7">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-emerald-400" />
        Job Descriptions
      </h2>
      <p className="text-gray-500 text-sm mb-5">Add one or more jobs to compare against.</p>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="bg-black/20 border border-white/10 rounded-2xl p-4 relative">
            {jobs.length > 1 && (
              <button
                onClick={() => removeJob(index)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <input
              type="text"
              placeholder="Job Title"
              value={job.title}
              onChange={(e) => updateJob(index, 'title', e.target.value)}
              className="bg-transparent border-b border-white/10 focus:border-emerald-500/50 outline-none text-white placeholder-gray-600 w-full mb-3 pb-2 text-sm font-medium transition-colors"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={job.company}
              onChange={(e) => updateJob(index, 'company', e.target.value)}
              className="bg-transparent border-b border-white/10 focus:border-emerald-500/50 outline-none text-gray-400 placeholder-gray-600 w-full mb-3 pb-2 text-sm transition-colors"
            />
            <textarea
              placeholder="Paste job description here..."
              value={job.description}
              onChange={(e) => updateJob(index, 'description', e.target.value)}
              className="bg-black/30 border border-white/10 focus:border-emerald-500/50 outline-none rounded-xl p-3 w-full h-28 text-sm text-gray-300 placeholder-gray-600 resize-none transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addJob}
        className="mt-4 w-full border border-dashed border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-gray-400 hover:text-emerald-400 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Job
      </button>
    </div>
  )
}