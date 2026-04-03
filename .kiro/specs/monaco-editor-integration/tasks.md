# Implementation Plan: Monaco Editor Integration

## Overview

This plan implements a coding arena platform frontend with problem listing and split-panel editor interface. All data is loaded from JSON files (problems.json, starter-code.json) with no hardcoded values. The implementation uses Next.js 14+ with App Router, React 18+, Monaco Editor, TypeScript, and Tailwind CSS. Submissions go to a dummy API endpoint that returns mock "Accepted" responses.

## Tasks

- [x] 1. Set up project structure and data files
  - Create directory structure for data files and API routes
  - Create `/public/data/problems.json` with sample problem data
  - Create `/public/data/starter-code.json` with templates for C, C++, Java, Python
  - Install required dependencies: @monaco-editor/react, react-resizable-panels, lucide-react
  - _Requirements: 1.1, 2.1, 2.3_

- [x] 2. Create dummy API endpoint for submissions
  - [x] 2.1 Implement `/app/api/submit/route.ts` with mock "Accepted" responses
    - Create POST handler that accepts problem_id, language, source
    - Return mock response with submission_id (timestamp), status "AC", message "Accepted", timestamp
    - Add 500ms delay to simulate processing
    - _Requirements: 7.1, 8.1, 8.2, 8.5_

- [x] 3. Implement data loading utilities
  - [x] 3.1 Create service functions for loading JSON data
    - Write `getProblems()` to fetch and parse problems.json
    - Write `getProblemById(id)` to fetch specific problem
    - Write `getStarterCodeTemplates()` to fetch starter-code.json
    - Add error handling for failed loads
    - _Requirements: 1.1, 1.4, 2.1, 2.5, 11.1, 11.2_
  
  - [x] 3.2 Write property test for data loading
    - **Property 1: Problem Data Completeness and Display**
    - **Property 2: Language Template Completeness**
    - **Validates: Requirements 1.3, 2.3, 3.2, 10.1, 10.2, 10.3**

- [x] 4. Build problem listing page
  - [x] 4.1 Create `/app/problems/page.tsx` with problem list component
    - Load problems from problems.json on mount
    - Display problems in grid/card layout with title, difficulty, category, points, solvedCount
    - Implement click handler to navigate to `/problem/[id]`
    - Add loading and error states
    - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3, 3.4_
  
  - [x] 4.2 Add filtering and search functionality
    - Implement difficulty filter (Easy, Medium, Hard)
    - Implement category filter
    - Update displayed list based on filter criteria
    - _Requirements: 3.5_
  
  - [x] 4.3 Write property test for problem list display
    - **Property 4: Problem List Display Completeness**
    - **Property 5: Problem Navigation**
    - **Validates: Requirements 3.1, 3.3, 3.5, 4.3**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement problem panel component
  - [x] 6.1 Create `ProblemPanel` component
    - Display problem title, description, input/output format, constraints
    - Render test examples with input, output, explanation
    - Show time limit and memory limit
    - Sanitize HTML content to prevent XSS
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 14.1_
  
  - [x] 6.2 Write unit tests for problem panel
    - Test rendering of all problem fields
    - Test XSS sanitization
    - Test with missing optional fields
    - _Requirements: 10.1, 10.5, 14.1_

- [x] 7. Implement Monaco Editor component
  - [x] 7.1 Create `CodeEditorPanel` component with Monaco integration
    - Initialize Monaco Editor with vs-dark theme
    - Configure editor options (line numbers, minimap, automaticLayout, fontSize 14)
    - Implement onChange handler to emit code changes to parent
    - Add proper cleanup on unmount to prevent memory leaks
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 13.4_
  
  - [x] 7.2 Add language selector and starter code loading
    - Create language dropdown with C, C++, Java, Python options
    - Load starter code from templates when language changes
    - Update Monaco Editor language mode on selection
    - Set Python as default language
    - _Requirements: 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 7.3 Write property tests for editor functionality
    - **Property 3: Starter Code Loading on Language Change**
    - **Property 6: Monaco Editor Syntax Highlighting Support**
    - **Property 7: Editor State Synchronization**
    - **Validates: Requirements 2.4, 5.2, 5.5, 6.3, 6.4, 6.5**

- [x] 8. Implement console panel component
  - [x] 8.1 Create `ConsolePanel` component
    - Display messages with type-based styling (info, success, error)
    - Show timestamp for each message
    - Implement clear button to remove all messages
    - Sanitize console output to prevent XSS
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 14.2_
  
  - [x] 8.2 Write property test for console functionality
    - **Property 11: Console Message Display**
    - **Property 12: Console Clear Functionality**
    - **Validates: Requirements 7.4, 8.3, 9.3, 9.5**

- [x11 ] 9. Build editor page with split-panel layout
  - [x] 9.1 Create `/app/problem/[id]/page.tsx` with split layout
    - Use react-resizable-panels for resizable split view
    - Place ProblemPanel on left, CodeEditorPanel and ConsolePanel on right
    - Load problem data by ID from problems.json
    - Load starter code templates from starter-code.json
    - Handle invalid problem IDs with 404 page
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 11.3_
  
  - [x] 9.2 Implement editor state management
    - Manage code, language, isSubmitting, consoleOutput state
    - Initialize editor with starter code for default language (Python)
    - Handle language changes and reload starter code
    - _Requirements: 6.2, 6.3, 6.4_

- [x] 10. Implement submission workflow
  - [x] 10.1 Create submission service and validation
    - Write `submitCode()` function to POST to /api/submit
    - Validate problem_id is non-empty string
    - Validate language is one of: c, cpp, java, python
    - Validate source code is non-empty string
    - Sanitize all inputs before sending
    - _Requirements: 7.1, 7.2, 12.1, 12.2, 12.3, 12.4, 12.5, 14.5_
  
  - [x] 10.2 Wire submission to editor page
    - Add submit button with loading state
    - Display "Submitting..." in console when submission starts
    - Handle successful response and display result in console
    - Handle errors and display error messages
    - Re-enable submit button after completion
    - _Requirements: 7.3, 7.4, 7.5, 8.3, 9.2, 9.3, 9.4_
  
  - [x] 10.3 Write property tests for submission
    - **Property 8: Submission Payload Construction**
    - **Property 9: Submission Payload Validation Rejection**
    - **Property 10: Mock API Response Structure**
    - **Validates: Requirements 7.1, 8.1, 8.2, 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Add security and validation measures
  - [x] 12.1 Implement content sanitization
    - Sanitize problem descriptions before rendering
    - Sanitize console output before displaying
    - Validate and sanitize problem IDs (reject special characters, path traversal)
    - Add CSP headers for Monaco Editor
    - _Requirements: 10.5, 14.1, 14.2, 14.3, 14.4_
  
  - [x] 12.2 Write property test for sanitization
    - **Property 13: Content Sanitization**
    - **Validates: Requirements 14.1, 14.2, 14.5**

- [x] 13. Implement performance optimizations
  - [x] 13.1 Add lazy loading and caching
    - Lazy load Monaco Editor to reduce initial bundle size
    - Implement caching for problems.json and starter-code.json
    - Debounce editor onChange events
    - Use React.memo for expensive components
    - _Requirements: 13.1, 13.2, 13.3, 13.5_
  
  - [x] 13.2 Write performance tests
    - Test lazy loading of Monaco Editor
    - Test caching behavior for JSON data
    - Test debouncing of editor changes
    - _Requirements: 13.1, 13.2, 13.3_

- [x] 14. Add error handling and fallbacks
  - [x] 14.1 Implement comprehensive error handling
    - Add error boundaries for component failures
    - Provide fallback textarea if Monaco fails to load
    - Add retry logic for failed JSON loads
    - Display user-friendly error messages for all error scenarios
    - _Requirements: 1.4, 2.5, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 14.2 Write unit tests for error scenarios
    - Test JSON loading failures
    - Test invalid problem ID handling
    - Test Monaco Editor load failure
    - Test API failure handling
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Final integration and polish
  - [x] 15.1 Wire all components together
    - Ensure navigation flow works: problem list → editor page
    - Verify all data flows correctly from JSON files
    - Test complete submission workflow end-to-end
    - Verify panel resizing works smoothly
    - _Requirements: 3.3, 4.1, 4.2, 7.1, 7.4_
  
  - [x] 15.2 Add styling and UI polish
    - Apply Tailwind CSS styling for consistent look
    - Add hover states and transitions
    - Ensure responsive layout for different screen sizes
    - Add loading spinners and skeleton screens
    - _Requirements: 3.4, 4.1, 10.4_

- [x] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- All data must be loaded from JSON files with no hardcoded values
- Monaco Editor should be lazy loaded for performance
- Dummy API always returns "Accepted" status for now
