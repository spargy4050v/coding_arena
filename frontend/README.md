# Coding Arena Platform - Frontend

A modern coding challenge platform built with Next.js 14+, featuring a split-panel interface with Monaco Editor integration for solving programming problems.

## Overview

This is a HackerRank-inspired coding arena where users can:
- Browse coding problems by difficulty and category
- Write and test code in multiple programming languages (C, C++, Java, Python)
- Submit solutions to a mock API endpoint
- View results in a real-time console

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Code Editor**: Monaco Editor (via @monaco-editor/react)
- **Layout**: react-resizable-panels for split views
- **Icons**: lucide-react
- **Security**: DOMPurify for XSS prevention

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # Mock submission API endpoint
│   ├── problem/
│   │   └── [id]/
│   │       └── page.tsx          # Problem detail page with editor
│   ├── problems/
│   │   └── page.tsx              # Problem list page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── not-found.tsx             # 404 page
├── components/
│   ├── CodeEditorPanel.tsx       # Monaco Editor wrapper
│   ├── ConsolePanel.tsx          # Output console
│   ├── ProblemPanel.tsx          # Problem description display
│   └── ErrorBoundary.tsx         # Error handling
├── lib/
│   └── data-service.ts           # Data fetching utilities
├── public/
│   └── data/
│       ├── problems.json         # Problem data
│       └── starter-code.json     # Language templates
└── next.config.ts                # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

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

The application will be available at `http://localhost:3000`

## How It Works

### 1. Problem Browsing (`/problems`)

- Loads problem data from `/public/data/problems.json`
- Displays problems in a responsive grid layout
- Shows metadata: title, difficulty, category, points, solved count
- Supports filtering by difficulty (Easy, Medium, Hard) and category
- Click any problem to navigate to the editor page

### 2. Problem Solving (`/problem/[id]`)

The editor page features a split-panel layout:

**Left Panel: Problem Description**
- Problem title and metadata
- Description with input/output format
- Constraints and examples
- Time and memory limits

**Right Panel: Code Editor + Console**
- Monaco Editor with syntax highlighting
- Language selector (C, C++, Java, Python)
- Starter code templates loaded from JSON
- Submit button
- Console panel for output

### 3. Code Submission Flow

```
User writes code → Clicks Submit → POST /api/submit
                                    ↓
                            Mock API responds "Accepted"
                                    ↓
                            Console displays result
```

### 4. Data Flow

```
problems.json → Problem List → User Selection → Problem Detail
                                                      ↓
starter-code.json → Language Templates → Monaco Editor
                                                      ↓
                                            User Code → Submit
                                                      ↓
                                            Mock API → Console
```

## Key Features

### Dynamic Data Loading
- All problem data loaded from JSON files
- No hardcoded values in components
- Easy to add/modify problems without code changes

### Monaco Editor Integration
- Professional code editor with IntelliSense
- Syntax highlighting for 4 languages
- Line numbers, minimap, code folding
- Automatic layout adjustment
- Debounced onChange for performance

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (1 col) → tablet (2 cols) → desktop (3 cols)
- Resizable panels with drag handles
- Smooth transitions and hover states

### Security
- XSS prevention with DOMPurify
- Content Security Policy headers
- Input validation and sanitization
- Path traversal protection

### Performance Optimizations
- Lazy loading of Monaco Editor
- Code splitting by route
- Debounced editor changes (300ms)
- React.memo for expensive components
- Caching of JSON data

### Error Handling
- Error boundaries for component failures
- Fallback textarea if Monaco fails
- Retry logic for failed data loads
- User-friendly error messages
- 404 page for invalid problem IDs

## Configuration

### Adding New Problems

Edit `/public/data/problems.json`:

```json
{
  "problems": [
    {
      "id": "unique-id",
      "title": "Problem Title",
      "difficulty": "Easy|Medium|Hard",
      "category": "Arrays",
      "points": 100,
      "solvedCount": 0,
      "description": "Problem description...",
      "inputFormat": "Input format...",
      "outputFormat": "Output format...",
      "constraints": ["constraint 1", "constraint 2"],
      "examples": [
        {
          "input": "example input",
          "output": "example output",
          "explanation": "optional explanation"
        }
      ],
      "timeLimit": 1000,
      "memoryLimit": 256
    }
  ]
}
```

### Adding Language Templates

Edit `/public/data/starter-code.json`:

```json
{
  "languages": [
    {
      "id": "python",
      "name": "Python",
      "monacoId": "python",
      "extension": ".py",
      "starterCode": "# Write your code here\n"
    }
  ]
}
```

## API Endpoints

### POST `/api/submit`

Mock submission endpoint that always returns "Accepted"

**Request:**
```json
{
  "problem_id": "two-sum",
  "language": "python",
  "source": "def solution():\n    return [0, 1]"
}
```

**Response:**
```json
{
  "submission_id": 1234567890,
  "status": "AC",
  "message": "Accepted",
  "timestamp": 1234567890
}
```

## Styling

The application uses Tailwind CSS with a dark theme:

- **Background**: gray-900 (#1a1a1a)
- **Text**: white/gray-300
- **Accents**: blue-500/600
- **Success**: green-500/600
- **Error**: red-500/600
- **Warning**: yellow-500/600

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Monaco Editor requires modern browser features (ES6+, Web Workers).

## Known Issues

Monaco Editor may show console warnings about worker initialization in development. These are cosmetic and don't affect functionality — the editor works perfectly.

## Future Enhancements

- Real backend integration with judge server
- User authentication and profiles
- Problem submission history
- Test case execution
- Code execution with actual output
- Leaderboards and rankings
- Discussion forums
- Editorial solutions

## License

This project is for educational purposes.
