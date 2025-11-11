'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated()
      
      if (!isAuth) {
        router.push('/login')
        return
      }
      
      setAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
          <div className='text-xl text-gray-600'>Checking authentication...</div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}