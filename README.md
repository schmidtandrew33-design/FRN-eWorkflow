# EPA FRN Approval System
### Power Apps Code App — v2.12.1

Federal Register Notice Document Management & Approval Workflow

---

## Prerequisites

Install these before anything else:

| Tool | Download |
|---|---|
| **Node.js** (LTS) | https://nodejs.org |
| **VS Code** | https://code.visualstudio.com |
| **Power Apps CLI** | `npm install -g @microsoft/power-apps` |

---

## First-Time Setup

### 1. Copy your existing HTML pages into this folder

Place these files at the **project root** (same level as `package.json`):

| Rename from | Rename to |
|---|---|
| `dashboard__2_.html` | **`dashboard.html`** |
| `Active_Reviews.html` | **`active-reviews.html`** |

These two must be renamed. All others keep their original names:

```
frn-code-app/
├── dashboard.html          ← renamed
├── active-reviews.html     ← renamed
├── my-tasks.html
├── new-notice.html
├── DocumentLibrary.html
├── pending-approvals.html
├── analytics.html
├── calendar.html
├── leaderboards.html
├── team.html               ← placeholder (provided)
├── reports.html            ← placeholder (provided)
├── settings.html           ← placeholder (provided)
└── help.html               ← placeholder (provided)
```

### 2. Add the EPA Seal image

Drop your `EPA Seal.png` into the `Images/` folder:

```
Images/
└── EPA Seal.png
```

The nav sidebar has a fallback (🏛️ emoji) if the image is missing.

### 3. Install npm dependencies

```bash
cd frn-code-app
npm install
```

---

## Running Locally

```bash
npm start
```

Opens the app at **http://localhost:3000**

The app runs as a full SPA — the left nav stays fixed and each page loads without a full browser reload.

---

## Deploying to Power Platform

### Enable Code Apps (admin step — one time)

1. Go to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
2. **Manage → Environments → [your environment] → Settings → Product → Features**
3. Toggle **Power Apps code apps → Enable code apps → Save**

### Authenticate and push

```bash
# Log in to Power Platform
pac auth create

# Deploy the app
npm run push
```

The app will appear in your Power Platform environment under **Apps → Code Apps**.

---

## How the SPA Router Works

The app is a Single Page Application (SPA):

- **`index.html`** is the only entry point. It contains the shared nav sidebar.
- **`src/app.js`** is the router. When you click a nav item:
  1. It fetches the target HTML file (e.g. `dashboard.html`)
  2. Parses the HTML and extracts the `.content-wrapper` and `.right-sidebar` divs
  3. Injects page-specific `<style>` blocks into a dedicated `<style id="page-styles">` slot
  4. Re-runs any `<script>` tags from the page (calendar JS, slider JS, etc.)
  5. Updates nav active states and URL hash
- **`src/shared.css`** has the shared CSS variables, nav sidebar, and loading indicator styles

Page HTML files require **zero modifications** — the router works with them as-is.

---

## Project Structure

```
frn-code-app/
├── package.json            ← Power Apps Code App config + npm scripts
├── .gitignore
├── README.md               ← this file
│
├── index.html              ← SPA shell — the only entry point
├── src/
│   ├── app.js              ← Client-side SPA router
│   └── shared.css          ← Shared CSS (nav sidebar, CSS vars, loading bar)
│
├── Images/
│   └── EPA Seal.png        ← Drop your seal here
│
├── dashboard.html
├── new-notice.html
├── DocumentLibrary.html
├── my-tasks.html
├── active-reviews.html
├── pending-approvals.html
├── analytics.html
├── calendar.html
├── leaderboards.html
├── team.html
├── reports.html
├── settings.html
└── help.html
```

---

## Notes & Known Limitations

- **Google Fonts** loads from the CDN — requires internet access. For fully offline use, download the font files and update the `<link>` tag in `index.html` to point to local files.
- **Power Apps Premium license** required for end-users running the deployed app.
- Code Apps are not supported in the Power Apps mobile app or Power Apps for Windows (web browser only).
- The `team.html`, `reports.html`, `settings.html`, and `help.html` pages are placeholders — replace them with full implementations when ready.

---

*EPA PMTaRP Product — Official Use Only — v2.12.1*
