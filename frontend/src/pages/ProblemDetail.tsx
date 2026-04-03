import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Panel, Group, Separator } from 'react-resizable-panels'
import { ProblemPanel } from '@/components/ProblemPanel'
import { CodeEditorPanel } from '@/components/CodeEditorPanel'
import { ConsolePanel, type ConsoleMessage } from '@/components/ConsolePanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import {
  getProblemById,
  getStarterCodeTemplates,
  type Problem,
  type LanguageTemplate,
} from '@/lib/data-service'

export default function ProblemDetail() {
  const { id: problemId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [starterCodeTemplates, setStarterCodeTemplates] = useState<
    LanguageTemplate[]
  >([])
  const [code, setCode] = useState<string>('')
  const [language, setLanguage] = useState<string>('python')
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(true)

  // Load problem data and starter code templates
  const loadData = async () => {
    if (!problemId) return

    setIsLoading(true)
    setError(null)

    try {
      // Load problem by ID
      const problemData = await getProblemById(problemId)

      if (!problemData) {
        // Problem not found - navigate to 404
        navigate('/not-found')
        return
      }

      setProblem(problemData)

      // Load starter code templates
      const templates = await getStarterCodeTemplates()
      setStarterCodeTemplates(templates)

      // Load initial starter code
      // Default to python if available, otherwise use the first available template
      const defaultTemplate = templates.find((t) => t.id === 'python') || templates[0]
      if (defaultTemplate) {
        setLanguage(defaultTemplate.id)
        setCode(defaultTemplate.starterCode)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load problem data'
      setError(errorMessage)
      setConsoleMessages([
        {
          type: 'error',
          message: errorMessage,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [problemId]) // Only reload if problemId changes

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)

    // Load starter code for new language
    const template = starterCodeTemplates.find((t) => t.id === newLanguage)
    if (template) {
      setCode(template.starterCode)
    }
  }

  // Handle code run
  const handleRun = async () => {
    // Validate code is non-empty
    if (!code.trim()) {
      setConsoleMessages([
        {
          type: 'error',
          message: 'Code cannot be empty',
          timestamp: Date.now(),
        },
      ])
      return
    }

    setIsRunning(true)
    setIsConsoleOpen(true)
    setConsoleMessages([
      {
        type: 'info',
        message: 'Running code against test cases...',
        timestamp: Date.now(),
      },
    ])

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem_id: problemId,
          language: language,
          source: code,
        }),
      })

      if (!response.ok) {
        throw new Error(`Run failed: ${response.statusText}`)
      }

      const result = await response.json()

      setConsoleMessages([
        {
          type: 'success',
          message: `Run ${result.run_id} - ${result.message}`,
          timestamp: Date.now(),
        },
      ])
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Run failed: Unable to reach server'
      
      console.error('Run error:', err)
      
      setConsoleMessages([
        {
          type: 'error',
          message: errorMessage,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsRunning(false)
    }
  }

  // Handle code submission
  const handleSubmit = async () => {
    // Validate code is non-empty
    if (!code.trim()) {
      setConsoleMessages([
        {
          type: 'error',
          message: 'Code cannot be empty',
          timestamp: Date.now(),
        },
      ])
      return
    }

    setIsSubmitting(true)
    setIsConsoleOpen(true)
    setConsoleMessages([
      {
        type: 'info',
        message: 'Submitting...',
        timestamp: Date.now(),
      },
    ])

    try {
      // Send submission to dummy API (handled by our mock-api.ts interceptor)
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem_id: problemId,
          language: language,
          source: code,
        }),
      })

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Display success message
      setConsoleMessages([
        {
          type: 'success',
          message: `Submission ${result.submission_id} - ${result.message}`,
          timestamp: Date.now(),
        },
      ])
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Submission failed: Unable to reach server'
      
      // Log to console for debugging
      console.error('Submission error:', err)
      
      setConsoleMessages([
        {
          type: 'error',
          message: errorMessage,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle console close
  const handleCloseConsole = () => {
    setIsConsoleOpen(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-xl mb-2">Loading problem...</div>
          <div className="text-gray-400 text-sm">Please wait</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !problem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center max-w-md">
          <div className="text-xl mb-2 text-red-400">Error</div>
          <div className="text-gray-400 text-sm mb-4">
            {error || 'Problem not found'}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/problems')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-gray-900">
        <Group orientation="horizontal">
          {/* Left Panel: Problem Description */}
          <Panel defaultSize={40} minSize={25}>
            <ErrorBoundary
              fallback={
                <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="text-center">
                    <div className="text-xl mb-2 text-red-400">
                      Failed to load problem panel
                    </div>
                    <button
                      onClick={loadData}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              }
            >
              <ProblemPanel problem={problem} />
            </ErrorBoundary>
          </Panel>

          <Separator className="w-2 bg-gray-800 hover:bg-blue-600 transition-colors duration-200 cursor-col-resize active:bg-blue-500" />

          {/* Right Panel: Editor and Console */}
          <Panel defaultSize={60} minSize={35}>
            <Group orientation="vertical">
              {/* Editor Panel */}
              <Panel defaultSize={70} minSize={30}>
                <div className="h-full flex flex-col overflow-hidden">
                  <div className="flex-1 min-h-0">
                    <ErrorBoundary
                    fallback={
                      <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
                        <div className="text-center">
                          <div className="text-xl mb-2 text-red-400">
                            Failed to load editor
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            Using fallback editor
                          </p>
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-64 bg-gray-800 text-white font-mono text-sm p-4 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    }
                  >
                    <CodeEditorPanel
                      value={code}
                      language={language}
                      onChange={setCode}
                      onLanguageChange={handleLanguageChange}
                      availableLanguages={starterCodeTemplates}
                    />
                  </ErrorBoundary>
                  </div>
                  {/* Action Buttons */}
                  <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex gap-3 shrink-0">
                    <button
                      onClick={handleRun}
                      disabled={isSubmitting || isRunning}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      {isRunning ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Running...
                        </span>
                      ) : (
                        'Run Code'
                      )}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isRunning}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded transition-all duration-200 transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Code'
                      )}
                    </button>
                  </div>
                </div>
              </Panel>

              {isConsoleOpen && (
                <>
                  <Separator className="h-2 bg-gray-800 hover:bg-blue-600 transition-colors duration-200 cursor-row-resize active:bg-blue-500" />
                  
                  {/* Console Panel */}
                  <Panel 
                    defaultSize={30} 
                    minSize={15} 
                  >
                    <ErrorBoundary
                      fallback={
                        <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
                          <div className="text-center">
                            <div className="text-xl mb-2 text-red-400">
                              Failed to load console
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <ConsolePanel
                        messages={consoleMessages}
                        onClose={handleCloseConsole}
                      />
                    </ErrorBoundary>
                  </Panel>
                </>
              )}
            </Group>
          </Panel>
        </Group>
      </div>
    </ErrorBoundary>
  )
}
