import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HTML Content Editor',
  description: 'Edit and manage HTML content dynamically'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
