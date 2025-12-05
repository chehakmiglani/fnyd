import React, { useState } from 'react'
import { submitReview } from '../api/client'

export default function UserDashboard() {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!review.trim()) {
      setError('Please enter a review')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await submitReview(rating, review)
      setAiResponse(response.data.ai_response)
      setSubmitted(true)
      setReview('')

      setTimeout(() => {
        setSubmitted(false)
        setAiResponse('')
      }, 5000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Share Your Feedback</h1>
          <p className="text-gray-600">Help us improve by sharing your experience</p>
        </div>

        {/* Main Card */}
        <div className="card shadow-xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                How would you rate us? ({rating} stars)
              </label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-14 h-14 rounded-full font-bold text-xl transition-all transform hover:scale-110 ${rating === star
                        ? 'bg-yellow-400 text-white scale-110 shadow-lg'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Tell us more
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your detailed feedback here... (min 10 characters)"
                className="textarea h-32"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {review.length}/5000 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'btn-primary'
                } py-3 text-lg font-semibold`}
            >
              {loading ? '⏳ Submitting...' : '✓ Submit Feedback'}
            </button>
          </form>
        </div>

        {/* AI Response */}
        {submitted && aiResponse && (
          <div className="card bg-green-50 border-2 border-green-200 animate-in">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 mb-2">AI Response</h3>
                <p className="text-gray-700">{aiResponse}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">✓ Your feedback has been recorded</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Thank you for your valuable feedback!</p>
        </div>
      </div>
    </div>
  )
}
