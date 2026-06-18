import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  Share2, 
  File, 
  Download, 
  User,
  Clock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

const SharedFiles = () => {
  const [sharedFiles, setSharedFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const activeToken = token || localStorage.getItem('token')
    if (activeToken) {
      fetchSharedFiles()
    }
  }, [token])

  const fetchSharedFiles = async () => {
    try {
      const { data } = await api.get('/files')
      setSharedFiles(data.shared_with_me)
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error('Failed to load shared files')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (id, filename) => {
    try {
      console.log(`[DOWNLOAD] Requesting shared file ID: ${id}`);
      const response = await api.get(`/files/${id}/download`, { 
        responseType: 'blob',
        timeout: 30000 
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      console.log(`[DOWNLOAD] Success: ${filename}`);
    } catch (error) {
      console.error('[DOWNLOAD] Error details:', error.response || error);
      toast.error(error.response?.data?.message || 'Download failed')
    }
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
          <Share2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shared with Me</h1>
          <p className="text-gray-500">Documents shared with you by other users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading shared documents...</div>
        ) : sharedFiles.length === 0 ? (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
            <Share2 size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-medium">No documents shared with you yet</p>
          </div>
        ) : (
          sharedFiles.map((file) => (
            <div key={file.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                  <File size={28} />
                </div>
                <button 
                  onClick={() => handleDownload(file.id, file.filename)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 truncate mb-1" title={file.filename}>
                {file.filename}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{new Date(file.upload_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={14} />
                  <span>Shared by {file.owner_username || 'Unknown User'}</span>
                </div>
                <div className="text-xs font-medium text-primary-600 bg-primary-50 inline-block px-2 py-1 rounded-md mt-2">
                  {formatSize(file.size)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SharedFiles
