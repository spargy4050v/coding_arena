'use client'

import { useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'isomorphic-dompurify'
import type { Problem } from '@/lib/data-service'

interface ProblemPanelProps {
  problem: Problem
}

function ProblemPanelComponent({ problem }: ProblemPanelProps) {
  const navigate = useNavigate()

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedDescription = useMemo(
    () => DOMPurify.sanitize(problem.description),
    [problem.description]
  )

  const sanitizedInputFormat = useMemo(
    () => DOMPurify.sanitize(problem.inputFormat),
    [problem.inputFormat]
  )

  const sanitizedOutputFormat = useMemo(
    () => DOMPurify.sanitize(problem.outputFormat),
    [problem.outputFormat]
  )

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-white p-4 sm:p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/problems')}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm hover:bg-gray-800 py-1.5 px-3 rounded-md -ml-3"
      >
        <span>←</span> Back to Problems
      </button>

      {/* Problem Title */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">{problem.title}</h1>

      {/* Problem Metadata */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 text-sm flex-wrap">
        <span
          className={`font-medium ${
            problem.difficulty === 'Easy'
              ? 'text-green-500'
              : problem.difficulty === 'Medium'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        >
          {problem.difficulty}
        </span>
        <span className="text-gray-400">{problem.category}</span>
        <span className="text-gray-400">{problem.points} points</span>
      </div>

      {/* Problem Description */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Description</h2>
        <div
          className="text-gray-300 leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </section>

      {/* Input Format */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Input Format</h2>
        <div
          className="text-gray-300 leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: sanitizedInputFormat }}
        />
      </section>

      {/* Output Format */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Output Format</h2>
        <div
          className="text-gray-300 leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: sanitizedOutputFormat }}
        />
      </section>

      {/* Constraints */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Constraints</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
          {problem.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </section>

      {/* Examples */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Examples</h2>
        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
            >
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Example {index + 1}
              </h3>

              {/* Input */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">
                  Input:
                </div>
                <pre className="bg-gray-900 rounded p-2 text-xs sm:text-sm text-gray-300 overflow-x-auto">
                  {example.input}
                </pre>
              </div>

              {/* Output */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">
                  Output:
                </div>
                <pre className="bg-gray-900 rounded p-2 text-xs sm:text-sm text-gray-300 overflow-x-auto">
                  {example.output}
                </pre>
              </div>

              {/* Explanation (optional) */}
              {example.explanation && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">
                    Explanation:
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Time and Memory Limits */}
      <section className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3">Limits</h2>
        <div className="flex gap-4 sm:gap-6 text-sm text-gray-300 flex-wrap">
          <div>
            <span className="text-gray-500">Time Limit:</span>{' '}
            <span className="font-medium">{problem.timeLimit}ms</span>
          </div>
          <div>
            <span className="text-gray-500">Memory Limit:</span>{' '}
            <span className="font-medium">{problem.memoryLimit}MB</span>
          </div>
        </div>
      </section>
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export const ProblemPanel = memo(ProblemPanelComponent)
