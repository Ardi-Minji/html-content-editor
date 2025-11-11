# Security Implementation Guide

## Overview

This application implements multiple layers of security to prevent XSS attacks, code injection, and other security vulnerabilities.

## Security Layers

### 1. Input Validation (`lib/security.ts`)

#### `validateInput(input: any): boolean`
Validates that input is a string and contains no dangerous patterns:
- Script tags (`<script>`, `</script>`)
- JavaScript protocols (`javascript:`)
- Event handlers (`onclick=`, `onerror=`, etc.)
- Dangerous HTML elements (`<iframe>`, `<object>`, `<embed>`, `<link>`, `<style>`)

**Usage:**
```typescript
if (!validateInput(userInput)) {
  throw new Error('Invalid input detected');
}
```

#### `sanitizeString(input: string): string`
Escapes all HTML special characters:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#x27;`
- `/` → `&#x2F;`

**Usage:**
```typescript
const safe = sanitizeString(userInput);
// Now safe to insert into HTML
```

### 2. Image Upload Security

#### File Type Validation
Only specific image formats allowed:
- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`

#### File Size Limit
Maximum upload size: **5MB**

#### Safe Filename Generation
```typescript
generateSafeFilename('my file!@#.jpg')
// Returns: my_file_1699632000000_a1b2c3.jpg
```

Features:
- Removes special characters
- Adds timestamp
- Adds random string
- Prevents file overwrites
- Prevents directory traversal

### 3. API Security

#### Content API (`/api/content`)
```typescript
// Validates all fields before saving
const fieldsToValidate = [
  content.name,
  content.email,
  content.bookDescription,
  content.workingHours,
  ...content.books.flatMap(book => [
    book.title,
    book.author,
    book.description,
    book.price,
  ]),
];

for (const field of fieldsToValidate) {
  if (!validateInput(field)) {
    return error('Invalid input detected');
  }
}
```

#### Upload API (`/api/upload`)
```typescript
// Multiple security checks
1. File exists check
2. File type validation
3. File size validation (5MB max)
4. Safe filename generation
5. Secure file storage
```

#### Generate HTML API (`/api/generate-html`)
```typescript
// All content is sanitized before HTML generation
const name = sanitizeString(data.name);
const email = sanitizeString(data.email);
// ... etc

// Outputs safe HTML with escaped content
```

### 4. Frontend Security

#### Dashboard Validation
```typescript
// Client-side validation before sending to server
for (const field of fieldsToValidate) {
  if (!validateInput(field)) {
    setMessage('Invalid input detected. Please remove any HTML tags or scripts.');
    return; // Prevents submission
  }
}
```

#### Preview Sandboxing
```typescript
<iframe
  srcDoc={htmlContent}
  sandbox="allow-same-origin"
  // Restricts iframe capabilities
/>
```

The `sandbox` attribute prevents:
- Script execution
- Form submission
- Navigation
- Pop-ups
- Plugins

### 5. Content Security Policy (Recommended)

Add to `next.config.js` for production:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

## Attack Prevention

### 1. XSS (Cross-Site Scripting)

**Attack:**
```javascript
userInput = "<script>alert('hacked')</script>"
```

**Prevention:**
```javascript
sanitizeString(userInput)
// Output: "&lt;script&gt;alert('hacked')&lt;/script&gt;"
// Renders as text, not executable code
```

### 2. HTML Injection

**Attack:**
```javascript
userInput = "<img src=x onerror='alert(1)'>"
```

**Prevention:**
```javascript
validateInput(userInput) // Returns false (contains onerror=)
// Request rejected before processing
```

### 3. Script Tag Injection

**Attack:**
```javascript
userInput = "Hello</script><script>alert('xss')</script>"
```

**Prevention:**
```javascript
validateInput(userInput) // Returns false (contains <script>)
sanitizeString(userInput) // Escapes all tags
```

### 4. Event Handler Injection

**Attack:**
```javascript
userInput = "Text onclick='malicious()' here"
```

**Prevention:**
```javascript
validateInput(userInput) // Returns false (contains onclick=)
```

### 5. JavaScript Protocol

**Attack:**
```javascript
userInput = "javascript:alert('xss')"
```

**Prevention:**
```javascript
validateInput(userInput) // Returns false (contains javascript:)
```

### 6. File Upload Attacks

**Attack:**
Upload `malicious.php` or `exploit.html`

**Prevention:**
```javascript
isValidImageType('malicious.php') // Returns false
// Only image extensions accepted
```

### 7. Path Traversal

**Attack:**
```javascript
filename = "../../etc/passwd"
```

**Prevention:**
```javascript
generateSafeFilename(filename)
// Output: etc_passwd_1699632000000_a1b2c3
// No directory traversal possible
```

## Testing Security

### Test XSS Prevention

1. Go to Dashboard
2. Try entering in any field:
   - `<script>alert('xss')</script>`
   - `<img src=x onerror='alert(1)'>`
   - `javascript:alert('xss')`
3. Click Save
4. Should see: "Invalid input detected. Please remove any HTML tags or scripts."

### Test Sanitization

1. Go to Dashboard
2. Enter: `<b>Bold text</b> & "quotes"`
3. Click Save
4. Check Preview
5. Should display: `<b>Bold text</b> & "quotes"` (as text, not formatted)

### Test File Upload

1. Try uploading non-image file (.txt, .exe, .php)
2. Should see: "Invalid file type. Only images are allowed."

3. Try uploading large file (>5MB)
4. Should see: "File too large. Maximum size is 5MB."

## Best Practices

### For Developers

1. **Never trust user input** - Always validate and sanitize
2. **Use TypeScript** - Type checking prevents many errors
3. **Server-side validation** - Never rely on client-side only
4. **Escape output** - Sanitize before inserting into HTML
5. **Limit file uploads** - Size, type, and location restrictions
6. **Use CSP headers** - Add Content-Security-Policy in production
7. **Regular updates** - Keep dependencies up to date

### For Users

1. **Only enter text** - Don't try to enter HTML or code
2. **Upload images only** - Other file types will be rejected
3. **Check preview** - Always verify changes before publishing
4. **Regular backups** - Save content.json regularly

## Security Checklist

- [x] Input validation on all fields
- [x] HTML sanitization before output
- [x] Script tag detection and blocking
- [x] Event handler detection and blocking
- [x] File type validation for uploads
- [x] File size limits (5MB)
- [x] Safe filename generation
- [x] No direct URL input for images
- [x] Sandbox iframe for preview
- [x] Server-side validation
- [x] Client-side validation
- [x] TypeScript type safety
- [x] No eval() or Function() usage
- [x] No dangerouslySetInnerHTML usage

## Future Security Enhancements

1. **Rate Limiting** - Prevent brute force attacks
2. **CSRF Tokens** - Prevent cross-site request forgery
3. **Authentication** - Add user login system
4. **Audit Logging** - Track all changes
5. **Content Versioning** - Ability to rollback changes
6. **Automated Security Scanning** - Regular vulnerability checks
7. **Encryption** - Encrypt sensitive data at rest
8. **HTTPS Only** - Force secure connections in production

## Reporting Security Issues

If you discover a security vulnerability, please email: security@example.com

Do not post security issues publicly until they have been addressed.

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
