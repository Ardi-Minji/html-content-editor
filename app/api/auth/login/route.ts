import { NextRequest, NextResponse } from 'next/server'

// Demo credentials - in production, use proper authentication
const DEMO_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password123'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check credentials (demo implementation)
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      // Generate a simple token (in production, use JWT or proper auth)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          email,
          name: 'Admin User'
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}