import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProblems, type Problem } from '@/lib/data-service'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const navigate = useNavigate()

  const loadProblems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProblems()
      setProblems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load problems')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProblems()
  }, [])

  // Get unique categories from problems
  const categories = useMemo(() => {
    const uniqueCategories = new Set(problems.map(p => p.category))
    return ['All', ...Array.from(uniqueCategories).sort()]
  }, [problems])

  // Filter problems based on selected criteria
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter
      const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter
      return matchesDifficulty && matchesCategory
    })
  }, [problems, difficultyFilter, categoryFilter])

  const handleProblemClick = (problemId: string) => {
    navigate(`/problem/${problemId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500'
      case 'Medium':
        return 'text-yellow-500'
      case 'Hard':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Problems</h1>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-gray-400">Loading problems...</div>
            </div>
          </div>
          {/* Skeleton screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Problems</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 sm:p-6">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadProblems}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Problems</h1>
          
          {/* Filter Controls */}
          <div className="mb-6 flex gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="difficulty-filter" className="text-gray-300 text-sm">
                Difficulty:
              </label>
              <select
                id="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-gray-600"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-gray-300 text-sm">
                Category:
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 hover:border-gray-600"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {(difficultyFilter !== 'All' || categoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setDifficultyFilter('All')
                  setCategoryFilter('All')
                }}
                className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          {!loading && !error && (
            <div className="mb-4 text-sm text-gray-400">
              Showing {filteredProblems.length} of {problems.length} problems
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleProblemClick(problem.id)}
                className="bg-gray-800 rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleProblemClick(problem.id)
                  }
                }}
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-3 line-clamp-2">{problem.title}</h2>
                
                <div className="flex items-center gap-3 sm:gap-4 mb-3 flex-wrap">
                  <span className={`font-medium text-sm sm:text-base ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">{problem.category}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                  <span>{problem.points} points</span>
                  <span>{problem.solvedCount.toLocaleString()} solved</span>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {!loading && !error && filteredProblems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No problems match the selected filters.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
