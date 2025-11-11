# User Guide - HTML Content Editor

## Getting Started

### Starting the Application

1. Open terminal in project directory
2. Run: `npm run dev`
3. Open browser to: `http://localhost:3000`

## Navigation

### Home Page (`/`)
- Welcome page with links to Dashboard and Preview
- Shows security features overview
- Starting point for the application

### Dashboard (`/dashboard`)
- Main editing interface
- Manage all content
- Upload images
- Save changes

### Preview (`/preview`)
- Live preview of your website
- See changes in real-time
- Refresh to update

## Dashboard Guide

### 1. Basic Information Section

#### Name Field
- Enter your store/business name
- Example: "John Doe Bookstore"
- This appears as the main heading

#### Email Field
- Enter contact email
- Example: "contact@mybookstore.com"
- Displayed in header

#### Description Field
- Describe your business
- Multiple lines supported
- Example: "Welcome to our curated collection..."

#### Working Hours Field
- Enter operating hours
- Multiple lines supported
- Example:
  ```
  Monday - Friday: 9:00 AM - 8:00 PM
  Saturday: 10:00 AM - 6:00 PM
  Sunday: Closed
  ```

### 2. Image Gallery Section

#### Uploading Images

1. Click "Choose File" button
2. Select an image from your computer
3. Wait for "Image uploaded successfully!" message
4. Image appears in gallery below

**Supported Formats:**
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

**File Size Limit:** 5MB per image

#### Removing Images

1. Hover over any image in gallery
2. Click "Remove" button that appears
3. Image is removed from list

### 3. Books Section

#### Adding a Book

1. Click "+ Add Book" button
2. Fill in the fields:
   - **Title**: Book name
   - **Author**: Author name
   - **Price**: Price (without currency symbol)
   - **Description**: Brief description
3. Repeat for multiple books

#### Editing a Book

1. Find the book in the list
2. Click into any field to edit
3. Changes are saved when you click "Save All Changes"

#### Removing a Book

1. Find the book card
2. Click "Remove" button in top-right
3. Book is removed from list

### 4. Saving Changes

1. After making any changes, click "Save All Changes" button
2. Wait for success message
3. HTML file is automatically generated
4. Changes are now live

## Preview Guide

### Viewing Your Website

1. Navigate to `/preview`
2. Website loads in iframe
3. All your content is displayed

### Refreshing Preview

1. Make changes in Dashboard
2. Click "Save All Changes"
3. Go to Preview
4. Click "🔄 Refresh" button
5. See updated content

### Preview Features

- **Live rendering** - See exactly how your site looks
- **Responsive** - Adjusts to different screen sizes
- **Safe viewing** - Sandboxed for security
- **No external links** - All content is local

## Workflow Examples

### Example 1: Setting Up Your Store

1. **Go to Dashboard**
   ```
   Navigate to /dashboard
   ```

2. **Fill Basic Info**
   - Name: "Riverside Books"
   - Email: "hello@riversidebooks.com"
   - Description: "Your neighborhood bookstore since 1995"
   - Hours: "Mon-Sat: 9am-7pm, Sun: 10am-5pm"

3. **Upload Store Photos**
   - Click Choose File
   - Select storefront.jpg
   - Select interior.jpg

4. **Add Books**
   - Click + Add Book
   - Title: "The Great Gatsby"
   - Author: "F. Scott Fitzgerald"
   - Price: "12.99"
   - Description: "A classic American novel"
   
   - Click + Add Book again
   - Add more books...

5. **Save**
   - Click "Save All Changes"
   - Wait for success message

6. **Preview**
   - Click "Preview" button
   - View your website
   - Check everything looks good

### Example 2: Updating Content

1. **Edit Existing Content**
   - Go to Dashboard
   - Change description text
   - Update working hours

2. **Add New Book**
   - Scroll to Books section
   - Click + Add Book
   - Fill in details

3. **Save and View**
   - Click "Save All Changes"
   - Go to Preview
   - Click Refresh
   - See updated content

### Example 3: Managing Images

1. **Add Multiple Images**
   - Upload image 1
   - Wait for confirmation
   - Upload image 2
   - Wait for confirmation
   - Continue...

2. **Remove Old Images**
   - Hover over unwanted image
   - Click "Remove"
   - Image disappears

3. **Save Changes**
   - Click "Save All Changes"
   - Check Preview

## Tips & Tricks

### Writing Good Descriptions

✅ **Good:**
```
Welcome to our cozy bookstore! We specialize in rare finds 
and contemporary bestsellers. Visit us for personalized 
recommendations and a warm cup of coffee.
```

❌ **Avoid:**
```
<b>Welcome</b> to our bookstore! Click here: http://...
```

### Formatting Working Hours

✅ **Good:**
```
Monday - Friday: 9:00 AM - 8:00 PM
Saturday: 10:00 AM - 6:00 PM
Sunday: Closed
Holiday Hours: Check our website
```

### Book Descriptions

✅ **Good:**
```
An epic tale of adventure and discovery that will keep 
you turning pages late into the night. Perfect for fans 
of fantasy and mystery.
```

❌ **Too Short:**
```
Good book.
```

### Image Best Practices

1. **Use high-quality images**
   - Minimum 800x600 pixels
   - Clear, well-lit photos

2. **Optimize file size**
   - Compress before uploading
   - Keep under 1MB when possible

3. **Use relevant images**
   - Store photos
   - Book covers
   - Author photos
   - Events

## Troubleshooting

### "Invalid input detected" Error

**Cause:** You tried to enter HTML tags or special characters

**Solution:**
1. Remove any `<` or `>` characters
2. Remove any script tags
3. Enter plain text only
4. Try saving again

### "Error loading content" Message

**Cause:** Content file not found or corrupted

**Solution:**
1. Check that `data/content.json` exists
2. Refresh the page
3. Contact administrator if persists

### Images Not Displaying

**Cause:** Image upload failed or wrong file type

**Solution:**
1. Check file is an image format (JPG, PNG, etc.)
2. Check file size is under 5MB
3. Try uploading again
4. Refresh the page

### Preview Not Updating

**Cause:** Changes not saved or browser cache

**Solution:**
1. Make sure you clicked "Save All Changes"
2. Click "🔄 Refresh" in preview
3. Clear browser cache if needed
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Server Not Starting

**Cause:** Port already in use or dependencies not installed

**Solution:**
1. Run `npm install` first
2. Check port 3000 is available
3. Try `npm run dev` again
4. Check error messages in terminal

## Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save changes (if supported by browser)
- **Ctrl/Cmd + R** - Refresh preview
- **Tab** - Navigate between fields
- **Escape** - Close dialogs

## FAQ

### Q: Can I use HTML in my descriptions?
**A:** No, only plain text is accepted. HTML tags will be rejected for security.

### Q: How do I add links?
**A:** You cannot add clickable links. This is a security feature to prevent malicious code.

### Q: Can I upload videos?
**A:** No, only image files are supported.

### Q: How many books can I add?
**A:** There's no hard limit, but we recommend keeping it under 50 for performance.

### Q: Can I undo changes?
**A:** Not yet. Make sure you want the changes before saving.

### Q: Is my data backed up?
**A:** The data is stored in `data/content.json`. We recommend backing up this file regularly.

### Q: Can multiple users edit at once?
**A:** No, this version doesn't support multi-user editing. Last save wins.

### Q: How do I export my website?
**A:** The generated HTML is in `public/website.html`. You can copy this file to any web server.

## Advanced Usage

### Exporting HTML

1. Navigate to project folder
2. Open `public/website.html`
3. Copy file to your web host
4. All images are in `public/uploads/`
5. Copy both HTML and uploads folder

### Customizing Styles

The generated HTML has embedded CSS. To customize:

1. Edit `app/api/generate-html/route.ts`
2. Find the `<style>` section in `generateHTMLContent`
3. Modify CSS as needed
4. Save and regenerate HTML

### Backing Up Data

**Manual Backup:**
```bash
cp data/content.json data/content.backup.json
```

**Backup Script:**
```bash
# Create backups folder
mkdir -p backups

# Backup with timestamp
cp data/content.json "backups/content_$(date +%Y%m%d_%H%M%S).json"
```

## Support

### Getting Help

1. Read this guide thoroughly
2. Check SECURITY.md for security questions
3. Review README.md for technical details
4. Check error messages carefully

### Reporting Issues

When reporting an issue, include:
- What you were trying to do
- What happened instead
- Any error messages
- Browser and OS version
- Steps to reproduce

## Best Practices

1. ✅ Save frequently
2. ✅ Preview before publishing
3. ✅ Use descriptive text
4. ✅ Optimize images before upload
5. ✅ Keep content organized
6. ✅ Backup regularly
7. ✅ Test on different devices
8. ✅ Keep descriptions concise but informative

## What Not To Do

1. ❌ Don't enter HTML tags
2. ❌ Don't use special characters excessively
3. ❌ Don't upload files over 5MB
4. ❌ Don't try to inject scripts
5. ❌ Don't use external image URLs
6. ❌ Don't forget to save changes

## Conclusion

This application provides a secure, user-friendly way to manage your website content. Follow this guide and the security measures to create a beautiful, safe website.

Enjoy editing! 🎉
