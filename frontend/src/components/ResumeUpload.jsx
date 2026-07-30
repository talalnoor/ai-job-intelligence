import { useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { uploadResume } from '../services/api'

export default function ResumeUpload({ onResumeAnalyzed }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleFileChange(e) {
    setFile(e.target.files[0])
    setError(null)
  }

  async function handleUpload() {
    if (!file) {
      setError('Please select a PDF file first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await uploadResume(file)
      onResumeAnalyzed(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-7">
      <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-400" />
        Upload Resume
      </h2>
      <p className="text-gray-500 text-sm mb-5">PDF only — we don't store your file.</p>

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl py-8 cursor-pointer transition-colors bg-black/20">
        <Upload className="w-6 h-6 text-gray-500" />
        <span className="text-sm text-gray-400">
          {file ? file.name : 'Click to choose a PDF'}
        </span>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  )
}