# Application Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Home     │  │  Dashboard  │  │   Preview   │        │
│  │     (/)     │  │ (/dashboard)│  │  (/preview) │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           ↓                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API ROUTES                          │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │   /content   │  │   /upload    │  │ /generate  │ │  │
│  │  │   GET/POST   │  │     POST     │  │    POST    │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │  │
│  │         │                  │                 │        │  │
│  └─────────┼──────────────────┼─────────────────┼────────┘  │
│            │                  │                 │           │
│            ↓                  ↓                 ↓           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SECURITY LAYER                           │  │
│  │  ┌────────────────┐  ┌─────────────────────────┐    │  │
│  │  │  validateInput │  │   sanitizeString        │    │  │
│  │  │  - Script tags │  │   - Escape HTML         │    │  │
│  │  │  - Event hdlr  │  │   - Escape quotes       │    │  │
│  │  │  - JS protocol │  │   - Escape special char │    │  │
│  │  └────────────────┘  └─────────────────────────┘    │  │
│  │  ┌────────────────┐  ┌─────────────────────────┐    │  │
│  │  │ isValidImage   │  │  generateSafeFilename   │    │  │
│  │  │ - Check type   │  │  - Timestamp            │    │  │
│  │  │ - Check size   │  │  - Random string        │    │  │
│  │  └────────────────┘  └─────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│            │                  │                 │           │
│            ↓                  ↓                 ↓           │
└────────────┼──────────────────┼─────────────────┼───────────┘
             │                  │                 │
             ↓                  ↓                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    FILE SYSTEM                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │  data/           │  │  public/         │  │ public/  │ │
│  │  content.json    │  │  uploads/        │  │ website  │ │
│  │                  │  │  *.jpg, *.png    │  │ .html    │ │
│  │  {               │  │                  │  │          │ │
│  │    name: "...",  │  │  image1.jpg      │  │ <html>   │ │
│  │    email: "...", │  │  image2.png      │  │ ...      │ │
│  │    books: [...]  │  │  ...             │  │ </html>  │ │
│  │  }               │  │                  │  │          │ │
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

### Workflow 1: Edit Content

```
User (Dashboard)
    │
    │ 1. Fill form fields
    │
    ↓
Client Validation
    │
    │ 2. Validate input (no HTML tags)
    │
    ↓
POST /api/content
    │
    │ 3. Send JSON data
    │
    ↓
Server Validation
    │
    │ 4. Validate & Sanitize
    │
    ↓
Write content.json
    │
    │ 5. Save to file system
    │
    ↓
POST /api/generate-html
    │
    │ 6. Trigger HTML generation
    │
    ↓
Generate HTML
    │
    │ 7. Read content.json
    │    Sanitize all strings
    │    Generate HTML
    │
    ↓
Write website.html
    │
    │ 8. Save HTML file
    │
    ↓
Success Response
    │
    │ 9. Return success
    │
    ↓
User sees confirmation
```

### Workflow 2: Upload Image

```
User (Dashboard)
    │
    │ 1. Select image file
    │
    ↓
Client Upload
    │
    │ 2. Create FormData
    │
    ↓
POST /api/upload
    │
    │ 3. Send multipart data
    │
    ↓
Server Validation
    │
    │ 4. Check file type
    │    Check file size
    │    Generate safe name
    │
    ↓
Write to /public/uploads
    │
    │ 5. Save image file
    │
    ↓
Generate URL
    │
    │ 6. Create URL path
    │    /uploads/image_123.jpg
    │
    ↓
Return URL
    │
    │ 7. Send URL to client
    │
    ↓
Update State
    │
    │ 8. Add to imageSources array
    │
    ↓
Display Image
```

### Workflow 3: Preview Content

```
User (Preview)
    │
    │ 1. Click Preview or Refresh
    │
    ↓
POST /api/generate-html
    │
    │ 2. Regenerate HTML
    │
    ↓
GET /api/generate-html
    │
    │ 3. Fetch HTML content
    │
    ↓
Read website.html
    │
    │ 4. Read from file system
    │
    ↓
Return HTML
    │
    │ 5. Send HTML content
    │
    ↓
Render in iframe
    │
    │ 6. Display with sandbox
    │
    ↓
User sees website
```

## 🛡️ Security Flow

```
User Input
    │
    ↓
┌───────────────────────┐
│  Client Validation    │
│  - Basic checks       │
│  - Type validation    │
└───────┬───────────────┘
        │
        ↓
┌───────────────────────┐
│  Network Transfer     │
│  - HTTPS (production) │
└───────┬───────────────┘
        │
        ↓
┌───────────────────────┐
│  Server Validation    │
│  - validateInput()    │
│  - Check patterns     │
│  - Reject if invalid  │
└───────┬───────────────┘
        │
        ↓
┌───────────────────────┐
│  Sanitization         │
│  - sanitizeString()   │
│  - Escape all HTML    │
│  - Safe for output    │
└───────┬───────────────┘
        │
        ↓
┌───────────────────────┐
│  Storage              │
│  - Save sanitized     │
│  - Generate HTML      │
└───────┬───────────────┘
        │
        ↓
┌───────────────────────┐
│  Output               │
│  - Escaped content    │
│  - No code execution  │
└───────────────────────┘
```

## 📦 Component Structure

```
App
├── layout.tsx (Root Layout)
│   ├── Metadata
│   └── Global Styles
│
├── page.tsx (Home Page)
│   ├── Hero Section
│   ├── Navigation Cards
│   └── Security Info
│
├── dashboard/
│   └── page.tsx (Dashboard)
│       ├── Basic Info Form
│       ├── Image Gallery
│       │   ├── Upload Button
│       │   └── Image Grid
│       ├── Books Section
│       │   ├── Add Book Button
│       │   └── Book Cards
│       │       ├── Title Input
│       │       ├── Author Input
│       │       ├── Price Input
│       │       ├── Description Input
│       │       └── Remove Button
│       └── Save Button
│
└── preview/
    └── page.tsx (Preview)
        ├── Control Bar
        │   ├── Refresh Button
        │   ├── Edit Link
        │   └── Home Link
        ├── Preview Frame (iframe)
        └── Tips Section
```

## 🗄️ Data Model

```typescript
ContentData
├── name: string
├── email: string
├── bookDescription: string
├── imageSources: string[]
├── workingHours: string
└── books: Book[]
    └── Book
        ├── id: string
        ├── title: string
        ├── author: string
        ├── price: string
        └── description: string
```

## 🔌 API Architecture

```
API Layer
├── /api/content
│   ├── GET: Read content.json
│   └── POST: Update content.json
│       └── Validate → Sanitize → Save
│
├── /api/upload
│   └── POST: Upload image
│       └── Validate → Save → Return URL
│
└── /api/generate-html
    ├── POST: Generate HTML
    │   └── Read → Sanitize → Generate → Save
    └── GET: Retrieve HTML
        └── Read → Return
```

## 🎨 Styling Architecture

```
Tailwind CSS
├── Utility Classes
├── Responsive Design
├── Component Styles
└── Custom Theme
    ├── Colors
    ├── Spacing
    └── Typography

Generated HTML
└── Embedded CSS
    ├── Reset Styles
    ├── Layout Styles
    ├── Component Styles
    └── Responsive Media Queries
```

## 📱 Responsive Design

```
Mobile (< 768px)
├── Single column layout
├── Stacked navigation
├── Full-width cards
└── Touch-friendly buttons

Tablet (768px - 1024px)
├── Two-column grid
├── Flexible layouts
└── Medium-sized cards

Desktop (> 1024px)
├── Multi-column grid
├── Wide container
└── Hover effects
```

## 🔐 Security Layers

```
Layer 1: Client-Side
├── Input validation
├── Type checking
└── UI feedback

Layer 2: Network
├── API routes
└── Request validation

Layer 3: Server-Side
├── Double validation
├── Sanitization
└── Type safety

Layer 4: Storage
├── Safe filenames
├── Structured data
└── Validated content

Layer 5: Output
├── Escaped HTML
├── Sandboxed iframe
└── No script execution
```

## 🚀 Deployment Architecture

```
Development
├── npm run dev
├── Hot reload
├── Source maps
└── Detailed errors

Production
├── npm run build
├── Optimized bundles
├── Minified code
├── Static generation
└── npm start
```

## 📊 File Organization

```
Project Root
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   └── next.config.js
│
├── Application Code
│   ├── app/ (Pages & API)
│   ├── lib/ (Utilities)
│   └── types/ (TypeScript)
│
├── Data & Assets
│   ├── data/ (JSON storage)
│   └── public/ (Static files)
│
└── Documentation
    ├── README.md
    ├── SECURITY.md
    ├── USER_GUIDE.md
    ├── QUICK_START.md
    ├── ARCHITECTURE.md
    └── PROJECT_SUMMARY.md
```

This architecture ensures:
✅ Security at every layer
✅ Clear separation of concerns
✅ Type safety throughout
✅ Easy to maintain and extend
✅ Production-ready structure
