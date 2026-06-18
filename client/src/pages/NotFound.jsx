import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary-100 relative">
          404
          <span className="absolute inset-0 flex items-center justify-center text-primary-600 text-4xl">
            Oops!
          </span>
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-8">Page Not Found</h2>
        <p className="text-gray-500 mt-4 mb-12 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
