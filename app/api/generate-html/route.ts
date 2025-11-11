import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ContentData } from '@/types/content'
import { generateAuthorWebsite } from '@/lib/htmlTemplate'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')
const HTML_FILE_PATH = path.join(process.cwd(), 'public', 'website.html')
const VERSIONS_DIR = path.join(process.cwd(), 'public', 'versions')
const MAX_VERSIONS = 5
const isVercel = process.env.VERCEL === '1'

async function ensureVersionsDir () {
  try {
    await fs.access(VERSIONS_DIR)
  } catch {
    await fs.mkdir(VERSIONS_DIR, { recursive: true })
  }
}

async function saveVersion (html: string, data: ContentData) {
  await ensureVersionsDir()

  // Get existing versions
  const files = await fs.readdir(VERSIONS_DIR)
  const versionFiles = files
    .filter(f => f.startsWith('website_v') && f.endsWith('.html'))
    .sort()
    .reverse()

  // Delete oldest versions if we have MAX_VERSIONS
  while (versionFiles.length >= MAX_VERSIONS) {
    const oldest = versionFiles.pop()
    if (oldest) {
      await fs.unlink(path.join(VERSIONS_DIR, oldest))
      // Also delete corresponding JSON
      const jsonFile = oldest.replace('.html', '.json')
      try {
        await fs.unlink(path.join(VERSIONS_DIR, jsonFile))
      } catch {}
    }
  }

  // Create new version with timestamp
  const timestamp = Date.now()
  const versionHtmlPath = path.join(VERSIONS_DIR, `website_v${timestamp}.html`)
  const versionJsonPath = path.join(VERSIONS_DIR, `website_v${timestamp}.json`)

  await fs.writeFile(versionHtmlPath, html, 'utf-8')
  await fs.writeFile(versionJsonPath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST (request: NextRequest) {
  try {
    // Check if we should save a version (default: false for preview, true for save)
    const body = await request.json().catch(() => ({}))
    const shouldSaveVersion = body.saveVersion === true

    // Get content data - either from request body or from file
    let data: ContentData
    if (body.content) {
      data = body.content
    } else {
      if (isVercel) {
        // On Vercel, use default content from API
        const response = await fetch(new URL('/api/content', request.url))
        data = await response.json()
      } else {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        data = JSON.parse(fileContent)
      }
    }

    // Generate HTML content with sanitized data
    const html = generateAuthorWebsite(data)

    // Only save version if explicitly requested and not on Vercel
    if (shouldSaveVersion && !isVercel) {
      await saveVersion(html, data)
    }

    // Write to main HTML file (skip on Vercel)
    if (!isVercel) {
      await fs.writeFile(HTML_FILE_PATH, html, 'utf-8')
    }

    return NextResponse.json({
      success: true,
      message: isVercel
        ? 'HTML generated (preview only - not persisted on Vercel)'
        : 'HTML file updated successfully',
      html: isVercel ? html : undefined
    })
  } catch (error) {
    console.error('Error generating HTML:', error)
    return NextResponse.json(
      { error: 'Failed to generate HTML file' },
      { status: 500 }
    )
  }
}

export async function GET () {
  try {
    // Always generate HTML on the fly for faster response
    let data: ContentData

    if (isVercel) {
      // Use default content for Vercel
      const contentResponse = await fetch(
        new URL('/api/content', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      )
      data = await contentResponse.json()
    } else {
      // Try to read from file, fallback to default
      try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        data = JSON.parse(fileContent)
      } catch {
        // Fallback to default content if file doesn't exist
        const contentResponse = await fetch('http://localhost:3000/api/content')
        data = await contentResponse.json()
      }
    }

    const html = generateAuthorWebsite(data)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error generating HTML:', error)
    
    // Return a basic error page instead of JSON
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Preview Error</title></head>
      <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #ef4444;">Preview Error</h1>
          <p style="color: #6b7280;">Unable to generate preview. Please try again.</p>
          <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">Retry</button>
        </div>
      </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      headers: {
        'Content-Type': 'text/html'
      },
      status: 200 // Return 200 so the preview can display the error page
    })
  }
}
