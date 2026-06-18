import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Shield, Share2, Zap, Lock, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
          Securely store and share <br />
          <span className="text-primary-600">your documents</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          DocuVault provides a professional-grade platform for managing your sensitive files 
          with role-based access control and detailed activity tracking.
        </p>
        <div className="flex items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center gap-2"
            >
              Go to Dashboard <ChevronRight size={20} />
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            <Shield size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Military Grade Security</h3>
          <p className="text-gray-600 leading-relaxed">
            All files are stored securely with role-based access control and JWT authentication.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            <Share2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Seamless Sharing</h3>
          <p className="text-gray-600 leading-relaxed">
            Share documents with specific users and track who has access to your files.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Lightning Fast</h3>
          <p className="text-gray-600 leading-relaxed">
            Upload, download, and preview your documents with optimized performance.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-primary-400 text-sm font-bold">
            <Lock size={16} />
            TRUSTED BY PROFESSIONALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Your privacy is our priority</h2>
          <p className="text-gray-400 text-lg">
            We use the latest security practices to ensure your data remains your data. 
            No compromises, just pure security.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
