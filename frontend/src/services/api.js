import axios from 'axios'

const API_BASE_URL = 'https://ai-job-intelligence-production-e2ee.up.railway.app'

export async function uploadResume(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${API_BASE_URL}/api/resume/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function rankJobs(resumeText, resumeSkills, jobs) {
  const response = await axios.post(`${API_BASE_URL}/api/jobs/rank`, {
    resume_text: resumeText,
    resume_skills: resumeSkills,
    jobs: jobs,
  })
  return response.data
}

export async function getMarketAnalysis(resumeText, resumeSkills, jobs) {
  const response = await axios.post(`${API_BASE_URL}/api/jobs/market-analysis`, {
    resume_text: resumeText,
    resume_skills: resumeSkills,
    jobs: jobs,
  })
  return response.data
}

export async function getInsights(payload) {
  const response = await axios.post(`${API_BASE_URL}/api/insights/generate`, payload)
  return response.data
}

export async function signup(email, password, name) {
  const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password, name })
  return response.data
}

export async function login(email, password) {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password })
  return response.data
}

export async function saveAnalysis(resumeSkills, rankedJobs, token) {
  const response = await axios.post(
    `${API_BASE_URL}/api/analyses/save`,
    { resume_skills: resumeSkills, ranked_jobs: rankedJobs },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function getAnalysisHistory(token) {
  const response = await axios.get(`${API_BASE_URL}/api/analyses/history`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getAnalysisById(id, token) {
  const response = await axios.get(`${API_BASE_URL}/api/analyses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}