import Link from 'next/link'

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
              HTML Content Editor
            </h1>
            <p className='text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Manage and edit your website content dynamically with a secure, user-friendly dashboard
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
              <Link
                href='/login'
                className='inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
              >
                Get Started
                <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
              <Link
                href='/preview'
                className='inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors'
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Everything you need to manage content
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              A complete solution for dynamic content management with security at its core
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            <Link
              href='/login'
              className='group block p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center mb-6'>
                <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 ml-4'>Dashboard</h3>
              </div>
              <p className='text-gray-600 text-lg leading-relaxed'>
                Edit content, manage data, and update your website in real-time with our intuitive interface
              </p>
            </Link>

            <Link
              href='/preview'
              className='group block p-8 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300'
            >
              <div className='flex items-center mb-6'>
                <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors'>
                  <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 ml-4'>Preview</h3>
              </div>
              <p className='text-gray-600 text-lg leading-relaxed'>
                View your website with live updates from the dashboard and see changes instantly
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 sm:p-12'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
                Security First
              </h2>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                Built with enterprise-grade security features to protect your content and users
              </p>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='text-center'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Input Validation</h3>
                <p className='text-sm text-gray-600'>Only safe string inputs accepted</p>
              </div>

              <div className='text-center'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Auto Escaping</h3>
                <p className='text-sm text-gray-600'>HTML tags escaped automatically</p>
              </div>

              <div className='text-center'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Secure Uploads</h3>
                <p className='text-sm text-gray-600'>Safe image upload handling</p>
              </div>

              <div className='text-center'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm'>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Script Blocking</h3>
                <p className='text-sm text-gray-600'>Malicious code prevention</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className='text-2xl font-bold mb-4'>Ready to get started?</h3>
          <p className='text-gray-400 mb-8 max-w-2xl mx-auto'>
            Start managing your content today with our secure and user-friendly platform
          </p>
          <Link
            href='/dashboard'
            className='inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
          >
            Launch Dashboard
            <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
