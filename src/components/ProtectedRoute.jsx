import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false, requireFullAccess = false }) => {
  const { isAuthenticated, isLoading, user, isAdmin, canUseApp } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-medical-blue/20 blur-xl rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-br from-medical-blue to-medical-purple p-4 rounded-full">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  // Check full access requirement (for upload/analysis pages)
  if (requireFullAccess && !canUseApp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Password Change Required</h1>
          <p className="text-gray-600 mb-4">
            You must change your temporary password before accessing this feature.
          </p>
          <p className="text-sm text-gray-500">
            Please go to Settings to change your password.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute