import { useState } from 'react'
import { LogIn, Sparkles } from 'lucide-react'
import { login as loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await loginApi(email, password)
      login(result.access_token, { name: result.name, email: result.email })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Job Intelligence
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-gray-500 text-base">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 focus:border-emerald-500/50 outline-none rounded-2xl px-4 py-3.5 text-base text-white placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 focus:border-emerald-500/50 outline-none rounded-2xl px-4 py-3.5 text-base text-white placeholder-gray-600 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black py-3.5 rounded-2xl font-bold text-base disabled:opacity-70 transition-all hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-base mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-emerald-400 hover:text-emerald-300 font-semibold">
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}