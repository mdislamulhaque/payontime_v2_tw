# Payontime

Payontime is a multi-page website built with HTML, JavaScript, Vite, and Tailwind CSS v4. Tailwind is compiled locally by Vite; the pages do not load Tailwind from a CDN.

## Requirements

- Node.js (current LTS version recommended)
- npm (included with Node.js)
- Git

## Clone and run

```bash
git clone <repository-url>
cd payontime-tw-v2
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The main page is `index.html`; the other pages can be opened at `/dashboard.html`, `/login.html`, and `/signup.html` on the same local server.

Do not open the HTML files directly with `file://`. Vite needs to serve the pages and compile Tailwind CSS.

## Build and preview

Create the production site in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tailwind CSS v4

Tailwind CSS and its official Vite plugin are project dependencies. The plugin is configured in `vite.config.js`, and `src/style.css` starts with:

```css
@import "tailwindcss";
```

Both `index.html` and `dashboard.html` load this local stylesheet. When adding Tailwind classes, Vite detects the classes and includes the generated styles during development and production builds. There is no Tailwind CDN script to configure.

## Project structure

```text
.
├── index.html       Main website
├── dashboard.html   User dashboard
├── login.html       Login page
├── signup.html      Sign-up page
├── src/
│   └── style.css    Tailwind entry point and shared styles
├── public/
│   ├── js/           Page scripts grouped by page and feature
│   └── ...           Images and other static assets
├── vite.config.js   Vite and Tailwind configuration
├── package.json     Scripts and dependencies
└── README.md        Setup and run instructions
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies after cloning |
| `npm run dev` | Start the local development server |
| `npm run build` | Build all pages for production |
| `npm run preview` | Serve the production build locally |
