import axios from 'axios'

console.log('[API] Initializing with baseURL: http://127.0.0.1:5000/api')

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    console.log('[API] Request:', config.method?.toUpperCase(), config.url)
    
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('[API] Token attached')
    }
    
    return config
  },
  (error) => {
    console.error('[API] Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response Success:', response.status)
    return response
  },
  (error) => {
    console.error('[API] Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isPublicPage = ['/login', '/register', '/'].includes(currentPath)
      
      if (!isPublicPage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.replace('/login?error=session_expired')
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
