/**
 * Sanitizes a string by escaping HTML tags and special characters
 * to prevent XSS attacks and code injection
 */
export function sanitizeString (input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validates that input is a string and contains no script tags or malicious code
 */
export function validateInput (input: any): boolean {
  if (typeof input !== 'string') {
    return false
  }

  // Check for script tags, event handlers, and other dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=, onerror=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<style/i
  ]

  return !dangerousPatterns.some(pattern => pattern.test(input))
}

/**
 * Validates image file type
 */
export function isValidImageType (filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return validExtensions.includes(extension)
}

/**
 * Generates a safe filename for uploaded images
 */
export function generateSafeFilename (originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalFilename.substring(
    originalFilename.lastIndexOf('.')
  )
  const safeName = originalFilename
    .substring(0, originalFilename.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20)

  return `${safeName}_${timestamp}_${randomString}${extension}`
}
