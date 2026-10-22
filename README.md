# Mithilesh Tayade — Personal Portfolio Website

A standalone, self-contained personal portfolio website built with **React 19**, **TypeScript**, **Vite**, **GSAP**, and custom **WebGL** shaders.

This project runs completely independently of Google AI Studio or any external backend/API service.

---

## Project Structure

```text
├── public/
│   ├── _redirects                 # SPA routing fallback for Netlify / Cloudflare Pages / Render
│   └── images/
│       └── mithilesh-signal.png   # Default hero portrait asset (used by WebGL point-cloud & fallback)
├── src/
│   ├── components/
│   │   ├── Modals.tsx             # Interactive contact modal with validation & mailto handoff
│   │   ├── SignalPortrait.tsx     # WebGL hero point-cloud scene & interactive discipline explorer canvas
│   │   └── Subpages.tsx           # Editorial subpages (/work, /content, /speaking)
│   ├── data/
│   │   ├── portfolioData.ts       # Structured portfolio content, disciplines, perspectives & helpers
│   │   └── portfolioData.test.ts  # Node.js unit test suite for portfolio logic & contact validation
│   ├── App.tsx                    # Main portfolio layout, navigation, GSAP text-scramble & scroll state
│   ├── index.css                  # Complete typography, layout, animation & responsive stylesheet
│   └── main.tsx                   # React application entry point
├── index.html                     # HTML entry point, SEO/OpenGraph metadata & Google Fonts
├── package.json                   # Dependencies and npm scripts
├── tsconfig.json                  # TypeScript configuration
├── vercel.json                    # SPA rewrite configuration for Vercel deployment
└── vite.config.ts                 # Vite build & development server configuration
```

---

## Running Locally on Windows (or macOS / Linux)

### 1. Prerequisites
- Install **Node.js** (v20 LTS or newer recommended) from [https://nodejs.org](https://nodejs.org).
- Verify your installation in **PowerShell**, **Command Prompt**, or **Windows Terminal**:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install Dependencies
Open a terminal in the project folder and run:
```powershell
npm install
```

### 3. Start the Local Development Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Type-Checking & Unit Tests (Optional)
```powershell
npm run lint
npm test
```

### 5. Build & Preview for Production
To generate an optimized production bundle in the `dist/` folder:
```powershell
npm run build
```
To test the production build locally before deploying:
```powershell
npm run preview
```

---

## Deployment Guide

This is a **100% static client-side Single Page Application (SPA)**. No environment variables, API keys, or backend servers are required.

- **Build Command:** `npm run build`
- **Output / Publish Directory:** `dist`
- **Node.js Version:** `20.x` (or newer)

### Deploying to Popular Hosting Providers
- **Vercel:** Import the repository or run `npx vercel`. `vercel.json` is pre-configured to route all paths to `/index.html`.
- **Netlify / Cloudflare Pages / Render Static Site:** Connect your repository, set the build command to `npm run build` and publish directory to `dist`. `public/_redirects` is automatically copied into `dist/_redirects` during the build to handle SPA routing.
- **GitHub Pages / Any Static Host:** Run `npm run build` and upload the contents of the `dist/` directory.
