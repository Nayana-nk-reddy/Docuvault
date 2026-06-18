import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  History, 
  UserPlus, 
  LogIn, 
  Upload, 
  Download, 
  Share2, 
  Trash2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const activeToken = token || localStorage.getItem('token')
    if (activeToken) {
      fetchLogs()
    }
  }, [token])

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/logs')
      setLogs(data)
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error('Failed to load activity logs')
      }
    } finally {
      setLoading(false)
    }
  }

  const getLogIcon = (action) => {
    switch (action) {
      case 'user_registration': return <UserPlus className="text-blue-600" size={20} />
      case 'user_login': return <LogIn className="text-green-600" size={20} />
      case 'file_upload': return <Upload className="text-purple-600" size={20} />
      case 'file_download': return <Download className="text-primary-600" size={20} />
      case 'file_share': return <Share2 className="text-orange-600" size={20} />
      case 'file_delete': return <Trash2 className="text-red-600" size={20} />
      case 'failed_login': return <AlertCircle className="text-red-600" size={20} />
      default: return <History className="text-gray-600" size={20} />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500">Track all major actions on your account</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No activity logs found</div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg mt-1">
                  {getLogIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {log.action.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <History size={12} />
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityLogs
