'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Store auth token
        localStorage.setItem('authToken', data.token)
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <Link href='/' className='flex items-center'>
              <h1 className='text-2xl font-bold text-gray-900'>
                HTML Content Editor
              </h1>
            </Link>
            <Link
              href='/'
              className='inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200'
            >
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className='flex items-center justify-center px-4 py-16'>
        <div className='w-full max-w-md'>
          <div className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                Welcome Back
              </h2>
              <p className='text-gray-600'>
                Sign in to access your dashboard
              </p>
            </div>

            {error && (
              <div className='mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 rounded-2xl'>
                <div className='flex items-center'>
                  <svg className='w-5 h-5 text-red-600 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  placeholder='Enter your email'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  placeholder='Enter your password'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3'></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className='mt-8 text-center'>
              <p className='text-sm text-gray-600'>
                Demo credentials: admin@example.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}