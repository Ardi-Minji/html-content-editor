import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ContentData } from '@/types/content'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')
const isVercel = process.env.VERCEL === '1'

// Default content for Vercel deployments
const defaultContent: ContentData = {
  authorName: 'Elena Morrison',
  subtitle: 'Award-Winning Contemporary Fiction Author',
  tagline: 'Stories that illuminate the extraordinary within the ordinary',
  bioParagraph1:
    'Elena Morrison is a bestselling contemporary fiction author whose work explores the intricate tapestry of human relationships, identity, and belonging in the modern world.',
  bioParagraph2:
    'Born in Seattle and raised between the Pacific Northwest and rural Ireland, Elena draws inspiration from her multicultural upbringing and background in psychology.',
  bioParagraph3:
    "When she's not writing, Elena teaches creative writing workshops, mentors emerging authors, and advocates for diverse voices in literature.",
  awards: [
    { id: '1', title: 'National Book Award Finalist (2020)' },
    { id: '2', title: 'Goodreads Choice Award Winner - Fiction (2019)' },
    { id: '3', title: "Women's Prize for Fiction Longlist (2021)" },
    { id: '4', title: 'New York Times Bestselling Author' }
  ],
  books: [
    {
      id: '1',
      title: 'The Memory Keeper',
      year: '2018',
      description:
        'A powerful debut about a woman who discovers a box of letters that unravel decades of family secrets.',
      review:
        'A stunning exploration of memory, loss, and the stories we tell ourselves. - The New York Times',
      coverColor: 'navy'
    },
    {
      id: '2',
      title: 'Between Two Worlds',
      year: '2020',
      description: "Following a young immigrant's journey between cultures.",
      review:
        "Morrison's prose sings with authenticity and grace. - The Guardian",
      coverColor: 'gold'
    },
    {
      id: '3',
      title: 'The Last Summer',
      year: '2022',
      description: 'Three childhood friends reunite for one final summer.',
      review: 'A masterclass in character development. - NPR Books',
      coverColor: 'teal'
    }
  ],
  contactEmail: 'hello@elenamorrison.com',
  contactMessage:
    "Interested in booking speaking engagements or media inquiries? I'd love to hear from you.",
  socialLinks: [
    { platform: 'Email', url: 'mailto:hello@elenamorrison.com' },
    { platform: 'Twitter', url: '#' },
    { platform: 'Instagram', url: '#' }
  ]
}

export async function GET () {
  try {
    // On Vercel, return default content
    if (isVercel) {
      return NextResponse.json(defaultContent)
    }

    // Locally, read from file
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    const data: ContentData = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading content file:', error)
    return NextResponse.json(defaultContent)
  }
}

export async function POST (request: NextRequest) {
  try {
    const data: ContentData = await request.json()

    // On Vercel, we can't write to filesystem - just return success
    if (isVercel) {
      return NextResponse.json({
        success: true,
        message:
          'Preview generated (Note: Changes are not persisted on Vercel)',
        isDemo: true
      })
    }

    // Locally, write to file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json({
      success: true,
      message: 'Content updated successfully'
    })
  } catch (error) {
    console.error('Error updating content file:', error)
    return NextResponse.json(
      { error: 'Failed to update content data' },
      { status: 500 }
    )
  }
}
