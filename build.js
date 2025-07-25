const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const chokidar = require('chokidar');

// Configuration for single files
const config = {
  css: {
    inputFile: './styles.css',
    outputFile: './styles.min.css'
  },
  js: {
    inputFile: './script.js',
    outputFile: './script.min.js'
  }
};

// Function to generate a unique build ID
function generateBuildId() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

// Function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Function to minify CSS
function buildCSS() {
  console.log('Building CSS...');
  
  if (!fileExists(config.css.inputFile)) {
    console.error(`CSS file not found: ${config.css.inputFile}`);
    return;
  }
  
  // Generate unique build ID
  const buildId = generateBuildId();
  
  // Read CSS file
  console.log(`  Processing: ${config.css.inputFile}`);
  const cssContent = fs.readFileSync(config.css.inputFile, 'utf8');
  
  // Minify the CSS
  const minifier = new CleanCSS({
    level: 2, // Advanced optimizations
    compatibility: 'ie11'
  });
  
  const minified = minifier.minify(cssContent);
  
  if (minified.errors.length > 0) {
    console.error('CSS minification errors:', minified.errors);
    return;
  }
  
  if (minified.warnings.length > 0) {
    console.warn('CSS minification warnings:', minified.warnings);
  }
  
  // Add build info comment at the top
  const finalCSS = `/* Watson Creative Chatbot Styles - Build ID: ${buildId} */\n/* Built: ${new Date().toISOString()} */\n${minified.styles}`;
  
  // Write the minified CSS to output file
  fs.writeFileSync(config.css.outputFile, finalCSS);
  
  // Calculate and display file sizes
  const originalSize = Buffer.byteLength(cssContent, 'utf8');
  const minifiedSize = Buffer.byteLength(finalCSS, 'utf8');
  const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
  
  console.log(`✓ CSS build complete!`);
  console.log(`  Build ID: ${buildId}`);
  console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`  Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
  console.log(`  Size reduction: ${savings}%`);
  console.log(`  Output: ${config.css.outputFile}\n`);
}

// Function to minify JavaScript
function buildJS() {
  console.log('Building JavaScript...');
  
  if (!fileExists(config.js.inputFile)) {
    console.error(`JavaScript file not found: ${config.js.inputFile}`);
    return;
  }
  
  // Generate unique build ID
  const buildId = generateBuildId();
  
  // Read JS file
  console.log(`  Processing: ${config.js.inputFile}`);
  const jsContent = fs.readFileSync(config.js.inputFile, 'utf8');
  
  // Minify the JS
  try {
    const minified = UglifyJS.minify(jsContent, {
      compress: {
        drop_console: false, // Keep console statements for debugging
        drop_debugger: true,
        passes: 2,
        unused: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        loops: true,
        if_return: true,
        join_vars: true
      },
      mangle: {
        reserved: [
          // Preserve function names and globals that might be referenced externally
          'watsonChatDebug',
          'showIntakeForm',
          'resetForm',
          'checkStatus',
          // Preserve any globals from embedded widget
          'anythingllm'
        ]
      },
      output: {
        comments: false,
        beautify: false
      }
    });
    
    if (minified.error) {
      console.error('JavaScript minification error:', minified.error);
      return;
    }
    
    // Add build info comment at the top
    const finalJS = `/* Watson Creative Chatbot Scripts - Build ID: ${buildId} */\n/* Built: ${new Date().toISOString()} */\n${minified.code}`;
    
    // Write the minified JS to output file
    fs.writeFileSync(config.js.outputFile, finalJS);
    
    // Calculate and display file sizes
    const originalSize = Buffer.byteLength(jsContent, 'utf8');
    const minifiedSize = Buffer.byteLength(finalJS, 'utf8');
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ JavaScript build complete!`);
    console.log(`  Build ID: ${buildId}`);
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
    console.log(`  Size reduction: ${savings}%`);
    console.log(`  Output: ${config.js.outputFile}\n`);
    
    // Show any warnings
    if (minified.warnings) {
      console.warn('Build warnings:', minified.warnings);
    }
  } catch (error) {
    console.error('JavaScript minification error:', error.message);
  }
}

// Main build function
function build() {
  console.log('\n🔨 Starting Watson Chatbot build process...\n');
  buildCSS();
  buildJS();
  console.log('✨ Build complete!\n');
}

// Watch mode
function watch() {
  console.log('👁  Watching for changes...\n');
  
  // Initial build
  build();
  
  // Watch CSS file
  if (fileExists(config.css.inputFile)) {
    const cssWatcher = chokidar.watch(config.css.inputFile, {
      ignoreInitial: true
    });
    
    cssWatcher
      .on('change', () => {
        console.log(`\n📝 ${config.css.inputFile} changed`);
        buildCSS();
      });
  }
  
  // Watch JS file
  if (fileExists(config.js.inputFile)) {
    const jsWatcher = chokidar.watch(config.js.inputFile, {
      ignoreInitial: true
    });
    
    jsWatcher
      .on('change', () => {
        console.log(`\n📝 ${config.js.inputFile} changed`);
        buildJS();
      });
  }
  
  console.log('Press Ctrl+C to stop watching.\n');
}

// Check command line arguments
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch') || args.includes('-w');

// Check if source files exist
if (!fileExists(config.css.inputFile) && !fileExists(config.js.inputFile)) {
  console.error('❌ No source files found!');
  console.error(`   Expected: ${config.css.inputFile} and/or ${config.js.inputFile}`);
  process.exit(1);
}

// Run the appropriate mode
if (isWatchMode) {
  watch();
} else {
  build();
} 