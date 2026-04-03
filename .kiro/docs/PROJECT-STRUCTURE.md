# Frontend Project Structure

## Overview
This is a Next.js 16.2.1 application with React 19.2.4, featuring a coding arena platform (similar to HackerRank) with Monaco Editor integration.

## Directory Tree

```
frontend/
├── app/                          # Next.js App Router (main application)
│   ├── api/                      # API routes
│   │   └── submit/
│   │       └── route.ts          # POST /api/submit - Mock submission endpoint
│   ├── problem/                  # Dynamic problem pages
│   │   └── [id]/
│   │       └── page.tsx          # Individual problem page with editor
│   ├── problems/
│   │   └── page.tsx              # Problem list/browse page
│   ├── favicon.ico               # Site favicon
│   ├── globals.css               # Global styles (Tailwind)
│   ├── layout.tsx                # Root layout component
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page (/)
│
├── components/                   # Reusable React components
│   ├── CodeEditorPanel.tsx       # Monaco Editor wrapper with language selector
│   ├── ConsolePanel.tsx          # Output/submission results display
│   ├── ErrorBoundary.tsx         # Error boundary for graceful error handling
│   └── ProblemPanel.tsx          # Problem description display
│
├── lib/                          # Utility libraries
│   └── data-service.ts           # Data fetching service for problems/starter code
│
├── public/                       # Static assets
│   ├── data/
│   │   ├── problems.json         # Problem definitions (id, title, difficulty, etc.)
│   │   └── starter-code.json    # Starter code templates for each language
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── node_modules/                 # Dependencies (managed by npm)
│
├── .gitignore                    # Git ignore rules
├── .next/                        # Next.js build output (generated)
├── eslint.config.mjs             # ESLint configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.ts                # Next.js configuration (CSP headers)
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── postcss.config.mjs            # PostCSS configuration (Tailwind)
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Main documentation
├── MONACO-EDITOR-ISSUES.md       # Monaco Editor technical analysis
└── PROJECT-STRUCTURE.md          # This file
```

## Key Files Explained

### Application Entry Points

**`app/layout.tsx`**
- Root layout component
- Sets up fonts (Geist Sans, Geist Mono)
- Provides HTML structure for all pages
- Clean implementation (no Monaco error handling)

**`app/page.tsx`**
- Home page at `/`
- Landing page for the application

**`app/problems/page.tsx`**
- Problem list page at `/problems`
- Displays all available coding problems
- Browse interface for selecting problems

**`app/problem/[id]/page.tsx`**
- Individual problem page at `/problem/{id}`
- Main coding interface with:
  - Problem description (left panel)
  - Monaco Editor (center panel)
  - Console/output (bottom panel)
- Uses React Resizable Panels for split layout

### Components

**`components/CodeEditorPanel.tsx`**
- Monaco Editor integration
- Language selector (C, C++, Java, Python)
- Lazy loaded with Next.js dynamic import
- SSR disabled for Monaco compatibility
- Debounced onChange (300ms) for performance
- Clean implementation (no error handling code)

**`components/ProblemPanel.tsx`**
- Displays problem description
- Shows difficulty, title, description
- Renders examples and constraints

**`components/ConsolePanel.tsx`**
- Shows submission results
- Displays test case outcomes
- Run/Submit button interface

**`components/ErrorBoundary.tsx`**
- React error boundary
- Graceful error handling for component failures

### Data Layer

**`lib/data-service.ts`**
- Fetches problems from `/data/problems.json`
- Fetches starter code from `/data/starter-code.json`
- Provides typed interfaces for data structures

**`public/data/problems.json`**
- Problem definitions
- Structure:
  ```json
  {
    "id": "two-sum",
    "title": "Two Sum",
    "difficulty": "Easy",
    "description": "...",
    "examples": [...],
    "constraints": [...]
  }
  ```

**`public/data/starter-code.json`**
- Starter code templates for each problem
- Organized by problem ID and language
- Structure:
  ```json
  {
    "two-sum": {
      "c": "...",
      "cpp": "...",
      "java": "...",
      "python": "..."
    }
  }
  ```

### API Routes

**`app/api/submit/route.ts`**
- POST endpoint for code submissions
- Mock implementation (returns success)
- Accepts: `{ problemId, language, code }`
- Returns: `{ success, message, testResults }`

### Configuration Files

**`next.config.ts`**
- CSP headers for security
- Allows Monaco Editor workers (blob:, self)
- No Monaco-specific workarounds

**`tsconfig.json`**
- TypeScript configuration
- Path aliases configured
- Strict mode enabled

**`package.json`**
- Dependencies:
  - next: 16.2.1
  - react: 19.2.4
  - @monaco-editor/react: Monaco integration
  - tailwindcss: Styling
  - lucide-react: Icons
  - react-resizable-panels: Split layout
- Scripts:
  - `npm run dev`: Development server
  - `npm run build`: Production build
  - `npm start`: Production server

## Data Flow

1. **Problem List**: `/problems` → `data-service.ts` → `problems.json`
2. **Problem Page**: `/problem/[id]` → `data-service.ts` → `problems.json` + `starter-code.json`
3. **Code Editing**: User types → Monaco Editor → Debounced state update
4. **Submission**: Submit button → `/api/submit` → Mock response → Console display

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Global styles**: `app/globals.css`
- **Fonts**: Geist Sans (body), Geist Mono (code)
- **Theme**: Dark mode for editor, light mode for UI

## Known Issues

- Monaco Editor shows console warnings about worker loading
- These are cosmetic and don't affect functionality
- See `MONACO-EDITOR-ISSUES.md` for detailed analysis

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

- Modern browsers with ES6+ support
- Monaco Editor requires JavaScript enabled
- No SSR for Monaco components (client-side only)
