import { ArrowLeft, Brain, Target, TrendingUp, ShieldCheck, Sparkles, Code2 } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Semantic Matching',
    desc: 'Resume and job text are encoded into embeddings (all-MiniLM-L6-v2) and compared with cosine similarity — real semantic fit, not keyword overlap.',
  },
  {
    icon: Target,
    title: 'Explainable Scoring',
    desc: 'A transparent weighted Job Fit Score: Semantic Similarity (50%) + Skill Match (30%) + Requirement Match (10%) + Keyword Match (10%). No black-box numbers.',
  },
  {
    icon: TrendingUp,
    title: 'Market Analysis',
    desc: 'Skill frequency across every job you analyze, surfacing the highest-demand gaps between your resume and the roles you want.',
  },
  {
    icon: ShieldCheck,
    title: 'LLM-Grounded Insights',
    desc: 'Gemini generates strengths, weaknesses, and resume suggestions grounded in the calculated scores — the LLM explains the score, it never sets it.',
  },
]

const STACK = [
  'React', 'Vite', 'Tailwind CSS', 'FastAPI', 'Sentence Transformers',
  'scikit-learn', 'Google Gemini', 'MongoDB', 'JWT Auth', 'PyMuPDF',
]

export default function About({ onBack }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-white flex items-center gap-1.5 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            About the project
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            AI Job Intelligence
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            AI Job Intelligence answers a simple question with rigorous methods: given your
            resume and a set of target jobs, which ones actually fit, why, and what should
            you learn next? Instead of a keyword-matching resume scanner or a thin LLM
            wrapper, it combines rule-based NLP skill extraction, sentence-transformer
            embeddings, a transparent weighted scoring engine, and LLM-generated qualitative
            reasoning — with a hard architectural rule that the LLM never controls the
            numeric score.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-10">
          <h3 className="text-sm font-semibold mb-4 text-gray-300">Built with</h3>
          <div className="flex flex-wrap gap-2">
            {STACK.map(tech => (
              <span
                key={tech}
                className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
<div className="text-center">
  <a
    href="https://github.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
  >
   <Code2 className="w-4 h-4" />
    View source on GitHub
  </a>

        </div>
      </div>
    </div>
  )
}