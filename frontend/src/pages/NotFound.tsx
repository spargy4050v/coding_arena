import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl mb-2">Problem Not Found</h2>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          The problem you're looking for doesn't exist.
        </p>
        <Link
          to="/problems"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Back to Problems
        </Link>
      </div>
    </div>
  )
}
