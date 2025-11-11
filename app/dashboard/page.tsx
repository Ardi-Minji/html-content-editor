'use client'

import { useState, useEffect } from 'react'
import { ContentData, Book, Award, SocialLink } from '@/types/content'
import { validateInput, sanitizeString } from '@/lib/security'
import Link from 'next/link'

interface Version {
  filename: string
  timestamp: number
  date: string
}

export default function Dashboard () {
  const [content, setContent] = useState<ContentData>({
    authorName: '',
    subtitle: '',
    tagline: '',
    bioParagraph1: '',
    bioParagraph2: '',
    bioParagraph3: '',
    awards: [],
    books: [],
    contactEmail: '',
    contactMessage: '',
    socialLinks: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [versions, setVersions] = useState<Version[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const [rollingBack, setRollingBack] = useState(false)
  const isVercel =
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app')

  useEffect(() => {
    fetchContent()
    fetchVersions()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage('Error loading content')
    } finally {
      setLoading(false)
    }
  }

  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/versions')
      if (response.ok) {
        const data = await response.json()
        setVersions(data)
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
    }
  }

  const handleRollback = async (filename: string) => {
    if (
      !confirm(
        'Are you sure you want to rollback to this version? Current unsaved changes will be lost.'
      )
    ) {
      return
    }

    setRollingBack(true)
    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      })

      if (response.ok) {
        setMessage('Successfully rolled back to selected version!')
        await fetchContent()
        await fetchVersions()
      } else {
        setMessage('Error rolling back version')
      }
    } catch (error) {
      console.error('Error rolling back:', error)
      setMessage('Error rolling back version')
    } finally {
      setRollingBack(false)
    }
  }

  const handleInputChange = (field: keyof ContentData, value: string) => {
    if (!validateInput(value)) {
      setMessage(
        'Invalid input detected. Scripts and event handlers are not allowed.'
      )
      return
    }

    setContent(prev => ({ ...prev, [field]: sanitizeString(value) }))
    setMessage('')
  }

  const handleAddBook = () => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: '',
      year: '',
      description: '',
      review: '',
      coverColor: 'navy'
    }
    setContent(prev => ({ ...prev, books: [...prev.books, newBook] }))
  }

  const handleRemoveBook = (id: string) => {
    setContent(prev => ({
      ...prev,
      books: prev.books.filter(book => book.id !== id)
    }))
  }

  const handleBookChange = (id: string, field: keyof Book, value: string) => {
    if (!validateInput(value)) {
      setMessage(
        'Invalid input detected. Scripts and event handlers are not allowed.'
      )
      return
    }

    setContent(prev => ({
      ...prev,
      books: prev.books.map(book =>
        book.id === id ? { ...book, [field]: sanitizeString(value) } : book
      )
    }))
    setMessage('')
  }

  const handleAddAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: ''
    }
    setContent(prev => ({ ...prev, awards: [...prev.awards, newAward] }))
  }

  const handleRemoveAward = (id: string) => {
    setContent(prev => ({
      ...prev,
      awards: prev.awards.filter(award => award.id !== id)
    }))
  }

  const handleAwardChange = (id: string, value: string) => {
    if (!validateInput(value)) {
      setMessage(
        'Invalid input detected. Scripts and event handlers are not allowed.'
      )
      return
    }

    setContent(prev => ({
      ...prev,
      awards: prev.awards.map(award =>
        award.id === id ? { ...award, title: sanitizeString(value) } : award
      )
    }))
    setMessage('')
  }

  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      platform: '',
      url: ''
    }
    setContent(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }))
  }

  const handleRemoveSocialLink = (index: number) => {
    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    if (!validateInput(value)) {
      setMessage(
        'Invalid input detected. Scripts and event handlers are not allowed.'
      )
      return
    }

    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: sanitizeString(value) } : link
      )
    }))
    setMessage('')
  }

  const handlePreview = async () => {
    try {
      // Save current content first to ensure preview shows latest changes
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      // Generate HTML with current content
      await fetch('/api/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveVersion: false, content })
      })

      // Open preview in new tab
      window.open('/preview', '_blank')
    } catch (error) {
      console.error('Error preparing preview:', error)
      // Still open preview even if save fails - it will use default content
      window.open('/preview', '_blank')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Save content
      const saveResponse = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      if (!saveResponse.ok) throw new Error('Failed to save content')

      // Generate HTML with versioning, pass content for Vercel
      const generateResponse = await fetch(
        '/api/generate-html?saveVersion=true',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saveVersion: true, content })
        }
      )

      if (!generateResponse.ok) throw new Error('Failed to generate HTML')

      const result = await generateResponse.json()
      setMessage(
        result.message || '✅ Content saved and website generated successfully!'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
      await fetchVersions()
    } catch (error) {
      console.error('Error saving:', error)
      setMessage('❌ Error saving content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
          <div className='text-xl text-gray-600'>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Author Dashboard
              </h1>
              <p className='text-gray-600 mt-1'>Manage your website content</p>
            </div>
            <div className='flex gap-3'>
              <Link
                href='/'
                className='inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
                Home
              </Link>
              <button
                onClick={handlePreview}
                className='inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                Preview
              </button>
              <button
                onClick={() => setShowVersions(!showVersions)}
                className='inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                Versions ({versions.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {isVercel && (
          <div className='mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <svg className='w-5 h-5 text-yellow-600 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-yellow-800'>Demo Mode</h3>
                <p className='text-sm text-yellow-700 mt-1'>
                  Changes will generate a preview but won't be saved permanently on Vercel deployments.
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl border ${
              message.includes('✅')
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200'
                : message.includes('❌')
                ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-200'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border-yellow-200'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                {message.includes('✅') ? (
                  <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                ) : message.includes('❌') ? (
                  <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                  </svg>
                )}
              </div>
              <div className='ml-3'>
                {message}
              </div>
            </div>
          </div>
        )}

        {showVersions && versions.length > 0 && (
          <div className='mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='flex items-center mb-6'>
              <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 ml-3'>
                Version History
              </h2>
            </div>
            <div className='space-y-3'>
              {versions.map(version => (
                <div
                  key={version.filename}
                  className='flex justify-between items-center p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-all duration-200'
                >
                  <div>
                    <span className='font-medium text-gray-900'>
                      {version.date}
                    </span>
                    <span className='text-sm text-gray-500 ml-3'>
                      ({version.filename})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRollback(version.filename)}
                    disabled={rollingBack}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium'
                  >
                    {rollingBack ? 'Rolling back...' : 'Rollback'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Hero Section */}
          <section className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='flex items-center mb-8'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <h2 className='text-2xl font-semibold text-gray-900 ml-4'>
                Basic Information
              </h2>
            </div>
            <div className='grid gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Author Name
                </label>
                <input
                  type='text'
                  value={content.authorName}
                  onChange={e =>
                    handleInputChange('authorName', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subtitle
                </label>
                <input
                  type='text'
                  value={content.subtitle}
                  onChange={e => handleInputChange('subtitle', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  placeholder='Award-Winning Author of Historical Fiction'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tagline
                </label>
                <input
                  type='text'
                  value={content.tagline}
                  onChange={e => handleInputChange('tagline', e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  placeholder='Stories that transport you through time'
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='flex items-center mb-8'>
              <div className='w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h2 className='text-2xl font-semibold text-gray-900 ml-4'>
                About & Biography
              </h2>
            </div>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Biography Paragraph 1
                </label>
                <textarea
                  value={content.bioParagraph1}
                  onChange={e =>
                    handleInputChange('bioParagraph1', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  rows={4}
                  placeholder='Write your first biography paragraph here...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Biography Paragraph 2
                </label>
                <textarea
                  value={content.bioParagraph2}
                  onChange={e =>
                    handleInputChange('bioParagraph2', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  rows={4}
                  placeholder='Continue your story here...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Biography Paragraph 3
                </label>
                <textarea
                  value={content.bioParagraph3}
                  onChange={e =>
                    handleInputChange('bioParagraph3', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  rows={4}
                  placeholder='Complete your biography...'
                />
              </div>

              {/* Awards */}
              <div className='pt-4 border-t border-gray-200'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-medium text-gray-900'>Awards & Recognition</h3>
                  <button
                    type='button'
                    onClick={handleAddAward}
                    className='inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                  >
                    <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                    Add Award
                  </button>
                </div>
                <div className='space-y-3'>
                  {content.awards.map(award => (
                    <div key={award.id} className='flex gap-3'>
                      <input
                        type='text'
                        value={award.title}
                        onChange={e =>
                          handleAwardChange(award.id, e.target.value)
                        }
                        placeholder='Award title'
                        className='flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveAward(award.id)}
                        className='px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200'
                      >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Books Section */}
          <section className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-center'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center'>
                  <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                </div>
                <h2 className='text-2xl font-semibold text-gray-900 ml-4'>Books</h2>
              </div>
              <button
                type='button'
                onClick={handleAddBook}
                className='inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                Add Book
              </button>
            </div>
            <div className='space-y-6'>
              {content.books.map(book => (
                <div
                  key={book.id}
                  className='p-6 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50'
                >
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Book Title
                        </label>
                        <input
                          type='text'
                          value={book.title}
                          onChange={e =>
                            handleBookChange(book.id, 'title', e.target.value)
                          }
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-gray-900'
                          placeholder='Enter book title'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Year Published
                        </label>
                        <input
                          type='text'
                          value={book.year}
                          onChange={e =>
                            handleBookChange(book.id, 'year', e.target.value)
                          }
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-gray-900'
                          placeholder='2023'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Description
                      </label>
                      <textarea
                        value={book.description}
                        onChange={e =>
                          handleBookChange(
                            book.id,
                            'description',
                            e.target.value
                          )
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-gray-900'
                        rows={3}
                        placeholder='Describe your book...'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Review Quote
                      </label>
                      <textarea
                        value={book.review}
                        onChange={e =>
                          handleBookChange(book.id, 'review', e.target.value)
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-gray-900'
                        rows={2}
                        placeholder='"A masterpiece of historical fiction" - The New York Times'
                      />
                    </div>
                    <div className='flex gap-4 items-end'>
                      <div className='flex-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Cover Color
                        </label>
                        <select
                          value={book.coverColor}
                          onChange={e =>
                            handleBookChange(
                              book.id,
                              'coverColor',
                              e.target.value
                            )
                          }
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-gray-900'
                        >
                          <option value='navy'>Navy</option>
                          <option value='gold'>Gold</option>
                          <option value='teal'>Teal</option>
                        </select>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveBook(book.id)}
                        className='px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium'
                      >
                        Remove Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-lg'>
            <div className='flex items-center mb-8'>
              <div className='w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center'>
                <svg className='w-6 h-6 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <h2 className='text-2xl font-semibold text-gray-900 ml-4'>
                Contact Information
              </h2>
            </div>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contact Email
                </label>
                <input
                  type='email'
                  value={content.contactEmail}
                  onChange={e =>
                    handleInputChange('contactEmail', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  placeholder='author@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Contact Message
                </label>
                <textarea
                  value={content.contactMessage}
                  onChange={e =>
                    handleInputChange('contactMessage', e.target.value)
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                  rows={3}
                  placeholder='Message displayed in contact section'
                />
              </div>

              {/* Social Links */}
              <div className='pt-4 border-t border-gray-200'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-medium text-gray-900'>Social Media Links</h3>
                  <button
                    type='button'
                    onClick={handleAddSocialLink}
                    className='inline-flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                  >
                    <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                    Add Social Link
                  </button>
                </div>
                <div className='space-y-3'>
                  {content.socialLinks.map((link, index) => (
                    <div key={index} className='flex gap-3'>
                      <input
                        type='text'
                        value={link.platform}
                        onChange={e =>
                          handleSocialLinkChange(
                            index,
                            'platform',
                            e.target.value
                          )
                        }
                        placeholder='Platform (e.g., Twitter, Instagram)'
                        className='flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                      />
                      <input
                        type='text'
                        value={link.url}
                        onChange={e =>
                          handleSocialLinkChange(index, 'url', e.target.value)
                        }
                        placeholder='URL'
                        className='flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-gray-900'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveSocialLink(index)}
                        className='px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200'
                      >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className='flex justify-center pt-8'>
            <button
              type='submit'
              disabled={saving}
              className='inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg'
            >
              {saving ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3'></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' />
                  </svg>
                  Save All Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
