# Vercel Deployment Notes

## Important: File System Limitations

This application uses file system operations for data persistence, which **do not work on Vercel's serverless platform** because:

1. **Read-only file system**: Vercel's serverless functions cannot write to the file system
2. **Ephemeral storage**: Any changes made during a request are lost after the function execution

## Vercel Deployment Behavior

When deployed on Vercel:
- ✅ **Preview works**: You can see the generated website preview
- ✅ **Demo content**: Default author content is displayed
- ⚠️ **No persistence**: Changes you make in the dashboard are not saved permanently
- ❌ **No version control**: Version history and rollback features are disabled

A yellow banner will appear on the dashboard to indicate you're in demo mode.

## Solutions for Production

To make this application production-ready on Vercel, you need to add a database:

### Option 1: Vercel KV (Redis)
```bash
npm install @vercel/kv
```
Store content data in Vercel's Redis-compatible KV store.

### Option 2: Vercel Postgres
```bash
npm install @vercel/postgres
```
Store content in a PostgreSQL database.

### Option 3: Vercel Blob
```bash
npm install @vercel/blob
```
Store generated HTML files in Vercel Blob storage.

### Option 4: Third-party Database
Connect to:
- MongoDB Atlas
- Supabase
- PlanetScale
- Any other cloud database

## Local Development

For full functionality with file persistence:
```bash
npm run dev
```

All features work perfectly in local development mode.

## Current API Routes

| Route | Local | Vercel |
|-------|-------|--------|
| GET /api/content | ✅ Reads from file | ✅ Returns default content |
| POST /api/content | ✅ Writes to file | ⚠️ No persistence |
| POST /api/generate-html | ✅ Saves HTML & versions | ⚠️ Returns HTML only |
| GET /api/generate-html | ✅ Reads HTML file | ✅ Generates on-the-fly |
| GET /api/versions | ✅ Lists versions | ❌ Empty array |
| POST /api/versions | ✅ Rollback feature | ❌ Not supported |

## Recommended Next Steps

1. Choose a database solution from the options above
2. Update API routes to use database instead of file system
3. Migrate version control to database or remove the feature
4. Consider storing generated HTML in Blob storage or serving dynamically
