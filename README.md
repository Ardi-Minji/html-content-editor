# HTML Content Editor

A secure Next.js application for managing and editing HTML content dynamically through a user-friendly dashboard.

## Features

### 1. JSON Data Storage
Store and manage website content including:
- Name
- Email
- Book Description
- Image Sources
- Working Hours
- Books Collection

### 2. Dashboard Interface
- Edit all content fields in real-time
- Upload images with automatic link generation
- Add, edit, and remove books
- Form validation and security checks
- User-friendly interface with Tailwind CSS

### 3. Live Preview
- View your website with live updates
- Refresh to see latest changes
- Safe iframe rendering with sandboxing

### 4. HTML Generation
- Dynamically generate HTML files from JSON data
- Beautiful, responsive design
- Modern styling with gradients and animations

## Security Features

### Input Sanitization
- All HTML tags are escaped (`<`, `>`, `&`, `"`, `'`, `/`)
- Script tags and event handlers are blocked
- No code injection possible

### Image Upload Security
- Only image files allowed (.jpg, .jpeg, .png, .gif, .webp, .svg)
- File size limit: 5MB
- Automatic safe filename generation
- No direct URL input - all images uploaded through secure endpoint

### Validation
- All inputs validated before saving
- Dangerous patterns detected and rejected:
  - `<script>` tags
  - Event handlers (onclick, onerror, etc.)
  - JavaScript protocols
  - iframes, objects, embeds
  - Style and link tags

## Workflow

1. **Edit Content** → Open Dashboard (`/dashboard`)
2. **Make Changes** → Update text, upload images, manage books
3. **Save Changes** → Click "Save All Changes" button
4. **Generate HTML** → System automatically generates HTML file
5. **Preview** → View live preview (`/preview`)
6. **Update** → Click refresh to see latest changes

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
html-content-editor/
├── app/
│   ├── api/
│   │   ├── content/          # Content CRUD operations
│   │   ├── upload/           # Image upload handler
│   │   └── generate-html/    # HTML generation
│   ├── dashboard/            # Dashboard page
│   ├── preview/              # Preview page
│   ├── layout.tsx
│   ├── page.tsx             # Home page
│   └── globals.css
├── data/
│   └── content.json         # Content data storage
├── lib/
│   └── security.ts          # Security utilities
├── types/
│   └── content.ts           # TypeScript types
├── public/
│   ├── uploads/             # Uploaded images
│   └── website.html         # Generated HTML file
└── package.json
```

## API Routes

### GET `/api/content`
Get current content data

### POST `/api/content`
Update content data
```json
{
  "name": "Store Name",
  "email": "email@example.com",
  "bookDescription": "Description...",
  "imageSources": ["/uploads/image.jpg"],
  "workingHours": "Mon-Fri: 9-5",
  "books": [...]
}
```

### POST `/api/upload`
Upload image file
- Accepts: multipart/form-data with 'file' field
- Returns: `{ success: true, imageUrl: "/uploads/..." }`

### POST `/api/generate-html`
Generate HTML file from current data

### GET `/api/generate-html`
Get generated HTML file

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Node.js
- **File System**: Node.js fs/promises

## Security Best Practices

1. **No Direct HTML Input**: All user inputs are treated as plain text
2. **Server-Side Validation**: All validation happens on the server
3. **Sanitization**: Content is sanitized before HTML generation
4. **File Upload Security**: Strict file type and size validation
5. **Sandbox Preview**: Preview iframe uses sandbox attribute
6. **No External Links**: Only server-generated image links allowed

## Usage Example

### Adding Content via Dashboard

1. Navigate to `/dashboard`
2. Fill in the form fields:
   - Store name: "My Bookstore"
   - Email: "contact@mybookstore.com"
   - Description: "Welcome to our store..."
   - Working hours: "Mon-Fri: 9am-6pm"
3. Upload images (optional)
4. Add books with title, author, price, description
5. Click "Save All Changes"
6. Navigate to `/preview` to see the result

### Viewing the Generated HTML

The generated HTML file is available at:
- Preview: `/preview` (in-app)
- Direct: `/website.html` (static file)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Build for production
npm run build
```

## Environment

- Node.js 18+ recommended
- npm or yarn package manager

## License

ISC

## Author

Created for secure HTML content management
