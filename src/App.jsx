import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import PasswordChangeRequired from './components/PasswordChangeRequired'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import TestimonialFooter from './components/TestimonialFooter'
import { useLocation } from 'react-router-dom'

// Main App Content Component
const AppContent = () => {
  const { user, isAuthenticated, canUseApp } = useAuth()

  // Show password change screen if user needs to change password
  if (isAuthenticated && user?.needsPasswordChange && user?.role !== 'admin') {
    return <PasswordChangeRequired />
  }

  const FooterWrapper = () => {
    const location = useLocation()
    const showFooter = ['/login', '/about'].includes(location.pathname)

    if (!showFooter) return null
    return <TestimonialFooter />
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <About />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute requireFullAccess={true}>
              <div>
                <Navbar />
                <Upload />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute requireFullAccess={true}>
              <div>
                <Navbar />
                <Analysis />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Settings />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <div>
                <Navbar />
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <FooterWrapper />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App