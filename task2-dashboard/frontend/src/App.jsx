import React, { useState, useEffect } from 'react'
import './index.css'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    // Check URL hash for admin mode
    const handleHashChange = () => {
      setIsAdminMode(window.location.hash === '#/admin')
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">🤖 AI Feedback</div>
          <div className="flex gap-4">
            <a
              href="#/"
              onClick={() => setIsAdminMode(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isAdminMode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              User Dashboard
            </a>
            <a
              href="#/admin"
              onClick={() => setIsAdminMode(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isAdminMode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Admin Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      {isAdminMode ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}
