# Watson Chatbot Build System

This build system minifies the Watson Creative chatbot JavaScript and CSS files to reduce file size and improve loading performance.

## Setup

1. Install Node.js if you haven't already (https://nodejs.org/)

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

### Build Once
To minify your files once:
```bash
npm run build
```

This will create:
- `script.min.js` - Minified version of `script.js`
- `styles.min.css` - Minified version of `styles.css`

### Watch Mode
To automatically rebuild whenever you save changes:
```bash
npm run watch
```

Press `Ctrl+C` to stop watching.

## What It Does

The build process:
1. **Minifies JavaScript** - Removes whitespace, shortens variable names, and optimizes code
2. **Minifies CSS** - Removes whitespace, combines rules, and optimizes selectors
3. **Adds build info** - Includes a build ID and timestamp in each file
4. **Shows statistics** - Displays original size, minified size, and compression ratio

## Configuration

The build script is configured to:
- Keep console.log statements in JavaScript (for debugging)
- Preserve important global variables like `watsonChatDebug`
- Maintain IE11 compatibility for CSS
- Generate unique build IDs for cache busting

## Files

- `script.js` → `script.min.js`
- `styles.css` → `styles.min.css`

## Using Minified Files

Update your HTML to use the minified versions:

```html
<!-- Instead of -->
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>

<!-- Use -->
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

## Build Output Example

```
🔨 Starting Watson Chatbot build process...

Building CSS...
  Processing: ./styles.css
✓ CSS build complete!
  Build ID: 2024-01-15T10-30-45-123Z-abc123
  Original size: 12.34 KB
  Minified size: 8.56 KB
  Size reduction: 30.63%
  Output: ./styles.min.css

Building JavaScript...
  Processing: ./script.js
✓ JavaScript build complete!
  Build ID: 2024-01-15T10-30-45-456Z-def456
  Original size: 45.67 KB
  Minified size: 23.45 KB
  Size reduction: 48.67%
  Output: ./script.min.js

✨ Build complete!
``` 