const fs = require('fs');
const path = require('path');

const root = process.cwd();
const distDir = path.join(root, 'dist');

const routePages = [
  'dashboard.html',
  'new-notice.html',
  'update-notice.html',
  'DocumentLibrary.html',
  'DocumentReview.html',
  'my-tasks.html',
  'Active-Reviews.html',
  'pending-approvals.html',
  'analytics.html',
  'calendar.html',
  'leaderboards.html',
  'team.html',
  'reports.html',
  'settings.html',
  'notifications-escalations.html',
  'help.html'
];

function ensureCleanDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

ensureCleanDir(distDir);

const sealPath = path.join(root, 'Images', 'EPA Seal.png');
const sealDataUri = `data:image/png;base64,${fs.readFileSync(sealPath).toString('base64')}`;
const sharedCss = fs.readFileSync(path.join(root, 'src', 'shared.css'), 'utf8');
const frnDataJs = fs.readFileSync(path.join(root, 'src', 'frn-data.js'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'src', 'app.js'), 'utf8');
const rootIndexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function inlineAssetPaths(html) {
  return html.replace(/Images\/EPA Seal\.png/g, sealDataUri);
}

function replaceExactTag(html, tag, replacement) {
  return html
    .replace(`${tag}\r\n`, `${replacement}\r\n`)
    .replace(`${tag}\n`, `${replacement}\n`)
    .replace(tag, replacement);
}

function escapeForInlineScript(content) {
  return content
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--');
}

const manifest = {};
for (const fileName of routePages) {
  manifest[fileName] = inlineAssetPaths(fs.readFileSync(path.join(root, fileName), 'utf8'));
}

let inlinedIndex = inlineAssetPaths(rootIndexHtml);
inlinedIndex = replaceExactTag(
  inlinedIndex,
  '    <link rel="stylesheet" href="src/shared.css">',
  `    <style>\n${sharedCss}\n    </style>`
);
inlinedIndex = replaceExactTag(
  inlinedIndex,
  '    <script src="src/frn-data.js"></script>',
  `    <script>\n${escapeForInlineScript(frnDataJs)}\n    </script>`
);
inlinedIndex = replaceExactTag(
  inlinedIndex,
  '    <script src="src/page-manifest.js"></script>',
  `    <script>\nwindow.FRN_PAGE_MANIFEST = ${escapeForInlineScript(JSON.stringify(manifest))};\n    </script>`
);
inlinedIndex = replaceExactTag(
  inlinedIndex,
  '    <script src="src/app.js"></script>',
  `    <script>\n${escapeForInlineScript(appJs)}\n    </script>`
);

fs.writeFileSync(path.join(distDir, 'index.html'), inlinedIndex, 'utf8');

console.log(`Built Power Apps bundle in ${distDir}`);
