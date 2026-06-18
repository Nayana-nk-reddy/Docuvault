import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  Upload, 
  Search, 
  File, 
  Download, 
  Share2, 
  Trash2, 
  X,
  UserPlus,
  Check
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

const Dashboard = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  
  // Sharing Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)

  useEffect(() => {
    const activeToken = token || localStorage.getItem('token')
    if (activeToken && loading) {
      fetchFiles()
    }
  }, [token, loading])

  useEffect(() => {
    if (userSearchTerm.length > 2) {
      searchUsers()
    } else {
      setUsers([])
    }
  }, [userSearchTerm])

  const fetchFiles = async () => {
    try {
      const { data } = await api.get('/files')
      setFiles(data.my_files)
    } catch (error) {
      // Don't show error toast if it's a 401, the interceptor will handle redirect
      if (error.response?.status !== 401) {
        toast.error('Failed to load files')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setIsUploading(true)
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('File uploaded successfully')
      fetchFiles()
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return
    try {
      await api.delete(`/files/${id}`)
      toast.success('File deleted')
      fetchFiles()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleDownload = async (id, filename) => {
    try {
      console.log(`[DOWNLOAD] Requesting file ID: ${id}`);
      const response = await api.get(`/files/${id}/download`, { 
        responseType: 'blob',
        timeout: 30000 // 30 seconds timeout for larger files
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url) // Clean up the URL object
      console.log(`[DOWNLOAD] Success: ${filename}`);
    } catch (error) {
      console.error('[DOWNLOAD] Error details:', error.response || error);
      toast.error(error.response?.data?.message || 'Download failed. Please check your connection.')
    }
  }

  const searchUsers = async () => {
    setIsSearchingUsers(true)
    try {
      const { data } = await api.get(`/users/search?q=${userSearchTerm}`)
      setUsers(data)
    } catch (error) {
      console.error('Failed to search users')
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleShare = async (userId) => {
    try {
      await api.post(`/files/${selectedFile.id}/share`, { user_id: userId })
      toast.success('File shared successfully')
      setIsShareModalOpen(false)
      fetchFiles()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to share file')
    }
  }

  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <label className={`flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-primary-700 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={20} />
          <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
          <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Total Files</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{files.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Storage Used</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatSize(files.reduce((acc, f) => acc + f.size, 0))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Shared Files</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {files.filter(f => f.shared_with.length > 0).length}
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Size</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Uploaded</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading files...</td>
                </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <File size={48} className="text-gray-300" />
                      <p>No files found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                          <File size={20} />
                        </div>
                        <span className="font-medium text-gray-900">{file.filename}</span>
                        {file.shared_with && file.shared_with.length > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Shared
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatSize(file.size)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(file.upload_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedFile(file)
                            setIsShareModalOpen(true)
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Share"
                        >
                          <Share2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDownload(file.id, file.filename)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share Document</h3>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-[280px]">
                  {selectedFile?.filename}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsShareModalOpen(false)
                  setUserSearchTerm('')
                  setUsers([])
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search user by email or name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-height-[300px] overflow-auto pr-2">
                {isSearchingUsers ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Searching users...</div>
                ) : users.length === 0 ? (
                  userSearchTerm.length > 2 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No users found</div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Type at least 3 characters to search
                    </div>
                  )
                ) : (
                  users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      {selectedFile?.shared_with.includes(user.id) ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full">
                          <Check size={14} />
                          Shared
                        </div>
                      ) : (
                        <button
                          onClick={() => handleShare(user.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                        >
                          <UserPlus size={14} />
                          Share
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
