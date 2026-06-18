import { useSelector } from 'react-redux'
import { User, Mail, Shield, Calendar } from 'lucide-react'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary-600 h-32 relative">
          <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
            <div className="h-full w-full rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
          <p className="text-gray-500 capitalize flex items-center gap-2 mt-1">
            <Shield size={16} className="text-primary-500" />
            {user?.role} Account
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</p>
                <p className="font-medium text-gray-900">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</p>
                <p className="font-medium text-gray-900">May 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
          <Shield size={18} />
          Security Notice
        </h3>
        <p className="text-sm text-amber-700">
          Your account is protected by industry-standard JWT authentication and bcrypt password hashing. 
          Make sure to use a strong, unique password and never share your credentials.
        </p>
      </div>
    </div>
  )
}

export default Profile
