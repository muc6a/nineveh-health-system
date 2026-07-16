const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Remove the Safari 10 nomodule polyfill script completely
  html = html.replace(/<script nomodule[^>]*>!function[^<]*<\/script>/g, '');
  
  // Remove the module detection and dynamic import fallback completely
  html = html.replace(/<script type="module"[^>]*>!function[^<]*<\/script>/g, '');
  
  // Remove all modern <script type="module" ...> completely
  html = html.replace(/<script type="module"[^>]*>.*?<\/script>/g, '');
  
  // Remove all modern module preloads completely
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');
  
  // Now, we only have the legacy polyfill and legacy entry left, but they have 'nomodule' and 'data-src' attributes.
  // We remove 'nomodule' so ALL browsers execute them.
  html = html.replace(/<script nomodule/g, '<script');
  
  // The legacy entry point relies on the inline script to execute `System.import()`.
  // Since we deleted the inline module fallback script, we MUST inject a simple script to run the legacy entry.
  // The legacy entry is usually `<script id="vite-legacy-entry" data-src="/assets/index-legacy-xyz.js">System.import(...)</script>`
  // Removing 'nomodule' is not enough because it doesn't have a 'src', it relies on 'data-src' and inline execution.
  // Oh wait, the legacy entry ALREADY contains the inline `System.import` logic inside it!
  // It looks like: `<script nomodule crossorigin id="vite-legacy-entry" data-src="/assets/index-legacy.js">System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))</script>`
  // So by just removing `nomodule`, it WILL execute!
  // And it will load the legacy chunk!
  
  // We should also remove 'crossorigin' just in case it blocks execution on older webviews, though it shouldn't.
  html = html.replace(/crossorigin/g, '');

  fs.writeFileSync(htmlPath, html);
  console.log('Postbuild: Forced legacy ES5 build in index.html');
} else {
  console.error('Postbuild: dist/index.html not found');
}
