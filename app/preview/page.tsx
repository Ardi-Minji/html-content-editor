'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Preview () {
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to prevent flash of loading state for fast responses
    const timer = setTimeout(() => {
      fetchHTML()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const fetchHTML = async () => {
    try {
      setLoading(true)

      // Use a single optimized API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch('/api/generate-html', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const html = await response.text()
        setHtmlContent(html)
        return
      }

      // If GET fails, try POST as fallback
      const postResponse = await fetch('/api/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveVersion: false })
      })

      if (postResponse.ok) {
        const data = await postResponse.json()
        if (data.html) {
          setHtmlContent(data.html)
          return
        }
      }

      throw new Error('Unable to generate preview')
    } catch (err) {
      console.error('Preview error:', err)
      
      if (err instanceof Error && err.name === 'AbortError') {
        setHtmlContent(`
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
            <div style="text-align: center; padding: 2rem;">
              <h1 style="color: #f59e0b; margin-bottom: 1rem;">Preview Timeout</h1>
              <p style="color: #6b7280; margin-bottom: 2rem;">The preview is taking longer than expected to load.</p>
              <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">Try Again</button>
            </div>
          </div>
        `)
      } else {
        setHtmlContent(`
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
            <div style="text-align: center; padding: 2rem;">
              <h1 style="color: #ef4444; margin-bottom: 1rem;">Preview Error</h1>
              <p style="color: #6b7280; margin-bottom: 2rem;">Unable to load preview. Please save your content first.</p>
              <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.location.reload()" style="background: #10b981; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">Retry</button>
                <button onclick="window.close()" style="background: #6b7280; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">Close</button>
              </div>
            </div>
          </div>
        `)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FBF8F3',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div style={{ fontSize: '1.2rem', color: '#1A2332', marginBottom: '0.5rem' }}>
            Loading preview...
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Generating your website preview
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `
          }} />
        </div>
      </div>
    )
  }

  // Render the HTML directly - no wrapper, no buttons
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
