export interface Book {
  id: string
  title: string
  year: string
  description: string
  review: string
  coverColor: 'navy' | 'gold' | 'teal'
}

export interface Award {
  id: string
  title: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface ContentData {
  // Hero Section
  authorName: string
  subtitle: string
  tagline: string

  // About Section
  bioParagraph1: string
  bioParagraph2: string
  bioParagraph3: string
  awards: Award[]

  // Books Section
  books: Book[]

  // Contact Section
  contactEmail: string
  contactMessage: string
  socialLinks: SocialLink[]
}
