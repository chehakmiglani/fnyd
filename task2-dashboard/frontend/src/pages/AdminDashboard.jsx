import React, { useState, useEffect } from 'react'
import { getSubmissions, getStats } from '../api/client'

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [page, filter])

  const loadData = async () => {
    setLoading(true)
    try {
      const offset = (page - 1) * 20
      const submissionsRes = await getSubmissions(20, offset)
      setSubmissions(submissionsRes.data.submissions)

      const statsRes = await getStats()
      setStats(statsRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStarColor = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage customer feedback</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Total Submissions</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total_submissions}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Average Rating</h3>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.average_rating}★</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Rating Distribution</h3>
              <div className="mt-2 space-y-1 text-sm">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="w-8">{r}★</span>
                    <div className="w-32 bg-gray-200 rounded">
                      <div
                        className="bg-yellow-400 h-4 rounded"
                        style={{
                          width: `${stats.rating_distribution[r] ? (stats.rating_distribution[r] / stats.total_submissions * 100) : 0}%`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{stats.rating_distribution[r] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submissions Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Submissions</h2>
            <button
              onClick={loadData}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Review</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Summary</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-800">#{sub.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full font-bold ${getStarColor(sub.user_rating)}`}>
                          {sub.user_rating}★
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 truncate max-w-xs">{sub.user_review}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm truncate max-w-xs">{sub.ai_summary}</p>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="btn btn-primary text-sm"
                        >
                          View Details
                        </button>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={submissions.length < 20}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Submission #{selectedSubmission.id}</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Rating</h4>
                  <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getStarColor(selectedSubmission.user_rating)}`}>
                    {selectedSubmission.user_rating} / 5 ★
                  </div>
                </div>

                {/* Review */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">User Review</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedSubmission.user_review}</p>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">AI Summary</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{selectedSubmission.ai_summary}</p>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Recommended Actions</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.recommended_actions}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">AI Response Sent to User</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{selectedSubmission.ai_response}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
