# Requirements Document: Monaco Editor Integration

## Introduction

This document specifies the requirements for a coding arena platform frontend that enables users to browse coding problems and solve them using an integrated code editor. The platform loads all problem data and starter code templates from JSON files, supports four programming languages (C, C++, Java, Python), and submits code to a dummy API endpoint with mock responses. This phase focuses on UI/UX and dynamic data loading without backend integration.

## Glossary

- **System**: The Monaco Editor Integration platform frontend
- **User**: A person interacting with the platform to browse and solve coding problems
- **Problem**: A coding challenge with description, constraints, and test examples
- **Editor**: The Monaco Editor component for writing code
- **Console**: The output panel displaying submission results
- **Starter_Code**: Language-specific code template loaded from JSON
- **Mock_API**: Dummy API endpoint that returns simulated "Accepted" responses
- **Problem_List**: The page displaying all available coding problems
- **Editor_Page**: The split-panel interface with problem description and code editor
- **Language_Template**: A JSON object containing starter code for a specific programming language

## Requirements

### Requirement 1: JSON-Driven Problem Data

**User Story:** As a developer, I want all problem data to be loaded from a JSON file, so that problems can be managed dynamically without code changes.

#### Acceptance Criteria

1. WHEN the System starts, THE System SHALL load problem data from `/public/data/problems.json`
2. THE System SHALL NOT contain any hardcoded problem data in component code
3. WHEN problems.json contains a problem with required fields (id, title, difficulty, category, points, solvedCount, description, inputFormat, outputFormat, constraints, examples, timeLimit, memoryLimit), THE System SHALL parse and display all fields correctly
4. IF problems.json fails to load, THEN THE System SHALL display an error message to the User
5. WHEN problems.json is updated, THE System SHALL reflect changes on page reload without code modifications

### Requirement 2: JSON-Driven Starter Code Templates

**User Story:** As a developer, I want starter code templates to be loaded from a JSON file, so that templates can be updated without modifying code.

#### Acceptance Criteria

1. WHEN the System starts, THE System SHALL load starter code templates from `/public/data/starter-code.json`
2. THE System SHALL NOT contain any hardcoded starter code in component code
3. FOR ALL supported languages (C, C++, Java, Python), THE starter-code.json SHALL contain a template with fields: id, name, monacoId, extension, starterCode
4. WHEN a User selects a language, THE System SHALL load the corresponding starter code from the JSON data
5. IF starter-code.json fails to load, THEN THE System SHALL display an error message and provide a fallback empty editor

### Requirement 3: Problem Listing Page

**User Story:** As a user, I want to see a list of available coding problems, so that I can choose which problem to solve.

#### Acceptance Criteria

1. WHEN a User navigates to the problem list page, THE System SHALL display all problems loaded from problems.json
2. WHEN displaying a problem card, THE System SHALL show the problem's title, difficulty, category, points, and solved count
3. WHEN a User clicks on a problem card, THE System SHALL navigate to `/problem/[id]` where [id] is the problem's unique identifier
4. WHERE the problem list contains multiple problems, THE System SHALL display them in a grid or card layout
5. WHEN a User searches or filters problems, THE System SHALL update the displayed list based on difficulty or category criteria

### Requirement 4: Split-Panel Editor Interface

**User Story:** As a user, I want a split-panel interface with the problem description on the left and the code editor on the right, so that I can read the problem while writing code.

#### Acceptance Criteria

1. WHEN a User navigates to the editor page, THE System SHALL display a split-panel layout with problem panel on the left and editor panel on the right
2. THE System SHALL allow Users to resize the panels by dragging the divider
3. WHEN the editor page loads, THE System SHALL fetch the problem details from problems.json using the problem ID from the URL
4. IF the problem ID does not exist in problems.json, THEN THE System SHALL display a 404 error page with a link back to the problem list
5. THE System SHALL display a console panel below or within the editor panel for submission results

### Requirement 5: Monaco Editor Integration

**User Story:** As a user, I want a professional code editor with syntax highlighting, so that I can write code comfortably.

#### Acceptance Criteria

1. WHEN the editor page loads, THE System SHALL initialize the Monaco Editor in the editor panel
2. THE Monaco_Editor SHALL support syntax highlighting for C, C++, Java, and Python
3. THE Monaco_Editor SHALL use a dark theme (vs-dark or HackerRank-inspired theme)
4. THE Monaco_Editor SHALL provide features including line numbers, minimap, automatic layout, and code folding
5. WHEN a User types in the editor, THE System SHALL capture all changes and update the component state
6. WHEN the editor component unmounts, THE System SHALL properly dispose of the Monaco Editor instance to prevent memory leaks

### Requirement 6: Language Selection and Starter Code Loading

**User Story:** As a user, I want to select a programming language and have starter code automatically loaded, so that I can start coding quickly.

#### Acceptance Criteria

1. WHEN the editor page loads, THE System SHALL display a language selector with options for C, C++, Java, and Python
2. WHEN the editor page loads, THE System SHALL set Python as the default language
3. WHEN a User selects a language from the selector, THE System SHALL load the corresponding starter code from starter-code.json
4. WHEN starter code is loaded, THE System SHALL replace the current editor content with the starter code for the selected language
5. WHEN a User switches languages, THE System SHALL update the Monaco Editor's language mode to match the selected language

### Requirement 7: Code Submission to Dummy API

**User Story:** As a user, I want to submit my code and see a result, so that I can verify my solution works.

#### Acceptance Criteria

1. WHEN a User clicks the submit button, THE System SHALL send a POST request to `/api/submit` with payload containing problem_id, language, and source code
2. THE System SHALL validate that the code is non-empty before submitting
3. WHEN the submission is in progress, THE System SHALL disable the submit button and display a "Submitting..." message in the console
4. WHEN the Mock_API responds, THE System SHALL display the result in the console panel
5. IF the API request fails, THEN THE System SHALL display an error message in the console and re-enable the submit button

### Requirement 8: Mock API Response Handling

**User Story:** As a developer, I want the dummy API to always return "Accepted" responses, so that I can test the submission flow without a real judge server.

#### Acceptance Criteria

1. WHEN the Mock_API receives a submission request, THE Mock_API SHALL return a response with status "AC" (Accepted)
2. THE Mock_API response SHALL include a submission_id (generated using timestamp), status "AC", message "Accepted", and timestamp
3. WHEN the System receives the mock response, THE System SHALL display "Submission [id] - Accepted" in the console
4. THE Mock_API SHALL NOT perform any actual code execution or grading
5. THE Mock_API SHALL respond within 500ms to simulate a fast response

### Requirement 9: Console Panel Display

**User Story:** As a user, I want to see submission results in a console panel, so that I know whether my solution was accepted.

#### Acceptance Criteria

1. WHEN the editor page loads, THE System SHALL display an empty console panel
2. WHEN a submission is initiated, THE System SHALL add an info message "Submitting..." to the console
3. WHEN a submission completes successfully, THE System SHALL add a success message with the submission ID and status to the console
4. WHEN a submission fails, THE System SHALL add an error message to the console
5. THE Console SHALL provide a clear button that removes all messages when clicked

### Requirement 10: Problem Description Display

**User Story:** As a user, I want to read the problem description, constraints, and examples, so that I understand what to solve.

#### Acceptance Criteria

1. WHEN the editor page loads, THE Problem_Panel SHALL display the problem title, description, input format, output format, constraints, and examples
2. WHEN displaying examples, THE Problem_Panel SHALL show input, output, and optional explanation for each example
3. THE Problem_Panel SHALL display time limit and memory limit for the problem
4. THE Problem_Panel SHALL format the problem description with proper spacing and readability
5. WHERE the problem description contains special characters, THE System SHALL sanitize the content to prevent XSS attacks

### Requirement 11: Data Validation and Error Handling

**User Story:** As a developer, I want robust error handling for data loading failures, so that users receive helpful feedback when issues occur.

#### Acceptance Criteria

1. WHEN problems.json fails to load, THE System SHALL display an error message "Failed to load problems" and provide a retry option
2. WHEN starter-code.json fails to load, THE System SHALL display an error message "Failed to load starter code templates" and provide a fallback empty editor
3. WHEN a User navigates to a non-existent problem ID, THE System SHALL display a 404 page with message "Problem not found" and a link to the problem list
4. WHEN the Monaco Editor fails to initialize, THE System SHALL display a fallback textarea with basic functionality
5. WHEN the Mock_API endpoint is unreachable, THE System SHALL display an error message "Submission failed: Unable to reach server" in the console

### Requirement 12: Submission Payload Validation

**User Story:** As a developer, I want to validate submission data before sending to the API, so that invalid requests are caught early.

#### Acceptance Criteria

1. WHEN creating a submission payload, THE System SHALL validate that problem_id is a non-empty string
2. WHEN creating a submission payload, THE System SHALL validate that language is one of: "c", "cpp", "java", "python"
3. WHEN creating a submission payload, THE System SHALL validate that source code is a non-empty string
4. IF any validation fails, THEN THE System SHALL display an error message in the console and NOT send the request
5. WHEN all validations pass, THE System SHALL construct a payload with fields: problem_id, language, source

### Requirement 13: Performance Optimization

**User Story:** As a user, I want the application to load quickly and respond smoothly, so that I have a good experience.

#### Acceptance Criteria

1. WHEN the application loads, THE System SHALL lazy load the Monaco Editor to reduce initial bundle size
2. WHEN the User types in the editor, THE System SHALL debounce onChange events to reduce re-renders
3. THE System SHALL cache problems.json and starter-code.json data to avoid redundant network requests
4. WHEN rendering large problem lists, THE System SHALL use efficient rendering techniques to maintain performance
5. THE Monaco_Editor SHALL be configured with automaticLayout: true to handle window resizing efficiently

### Requirement 14: Security Measures

**User Story:** As a developer, I want to protect against common security vulnerabilities, so that the application is safe to use.

#### Acceptance Criteria

1. WHEN displaying problem descriptions from JSON, THE System SHALL sanitize HTML content to prevent XSS attacks
2. WHEN displaying console output, THE System SHALL sanitize user-generated content to prevent XSS attacks
3. WHEN validating problem IDs, THE System SHALL reject IDs containing special characters or path traversal attempts
4. THE System SHALL use proper Content Security Policy headers for the Monaco Editor
5. WHEN sending submission requests, THE System SHALL sanitize all user input before including it in the payload
