import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const submitReview = async (userRating, userReview) => {
  return api.post('/submit', {
    user_rating: userRating,
    user_review: userReview
  })
}

export const getSubmissions = async (limit = 100, offset = 0) => {
  return api.get('/submissions', {
    params: { limit, offset }
  })
}

export const getSubmission = async (id) => {
  return api.get(`/submissions/${id}`)
}

export const getStats = async () => {
  return api.get('/stats')
}

export default api
