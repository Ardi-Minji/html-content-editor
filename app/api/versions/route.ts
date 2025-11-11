import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const VERSIONS_DIR = path.join(process.cwd(), 'public', 'versions')
const HTML_FILE_PATH = path.join(process.cwd(), 'public', 'website.html')
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')
const isVercel = process.env.VERCEL === '1'

// GET - List all versions
export async function GET () {
  try {
    // On Vercel, versions aren't persisted
    if (isVercel) {
      return NextResponse.json({ versions: [] })
    }

    await fs.access(VERSIONS_DIR)
    const files = await fs.readdir(VERSIONS_DIR)

    const versions = files
      .filter(f => f.startsWith('website_v') && f.endsWith('.html'))
      .map(f => {
        const timestamp = parseInt(
          f.replace('website_v', '').replace('.html', '')
        )
        return {
          filename: f,
          timestamp,
          date: new Date(timestamp).toLocaleString()
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Error listing versions:', error)
    return NextResponse.json({ versions: [] })
  }
}

// POST - Rollback to a specific version
export async function POST (request: NextRequest) {
  try {
    // On Vercel, rollback is not supported
    if (isVercel) {
      return NextResponse.json(
        { error: 'Version rollback is not available on Vercel deployment' },
        { status: 400 }
      )
    }

    const { filename } = await request.json()

    if (!filename || !filename.startsWith('website_v')) {
      return NextResponse.json(
        { error: 'Invalid version filename' },
        { status: 400 }
      )
    }

    const versionHtmlPath = path.join(VERSIONS_DIR, filename)
    const versionJsonPath = path.join(
      VERSIONS_DIR,
      filename.replace('.html', '.json')
    )

    // Read version files
    const html = await fs.readFile(versionHtmlPath, 'utf-8')
    const jsonData = await fs.readFile(versionJsonPath, 'utf-8')

    // Restore to main files
    await fs.writeFile(HTML_FILE_PATH, html, 'utf-8')
    await fs.writeFile(DATA_FILE_PATH, jsonData, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Successfully rolled back to previous version'
    })
  } catch (error) {
    console.error('Error rolling back version:', error)
    return NextResponse.json(
      { error: 'Failed to rollback version' },
      { status: 500 }
    )
  }
}
