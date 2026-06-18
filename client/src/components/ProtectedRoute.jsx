import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  // 1. Critical Check: Is there a token in storage?
  const token = localStorage.getItem('token')
  const hasValidToken = token && token !== 'undefined' && token !== 'null'
  
  // 2. Allow access if Redux OR Storage says we are logged in
  const isAuth = isAuthenticated || hasValidToken

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  // 3. Admin logic with storage fallback
  const storageUser = JSON.parse(localStorage.getItem('user') || 'null')
  const currentUser = user || storageUser

  if (adminOnly && currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
